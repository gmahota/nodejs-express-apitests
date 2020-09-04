const algorithmia = require("algorithmia");

const sentenceBoundaryDetection = require("sbd");

const watson = require("../../credentials/watson-nlu.json");
const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

const state = require('./state.js')

const nlu = new NaturalLanguageUnderstandingV1({
  authenticator: new IamAuthenticator({ apikey: watson.apikey }),
  version: "2019-02-01",
  serviceUrl: watson.url,
});

async function robot(content) {
  console.log(`Recebi com sucesso o content: ${content.searchTerm}`);  
  state.save(content);
  await fetchContentFromWikipedia(content);
  sanitizeContent(content); //console.log(content.sourceContentOriginal);
  breakContentIntoSentences(content);
  limitMaximumSentences(content);
  await fetchKeywordsOfAllSentences(content);

  state.save(content);
  //Download Wikipedia Text
  async function fetchContentFromWikipedia(content) {
    console.log("> [text-robot] Fetching content from Wikipedia");
    const algorithmiaAuthenticated = algorithmia(
      process.env.algorithmia_ApiKey
    );
    const wikipediaAlgorithm = algorithmiaAuthenticated.algo(
      "web/WikipediaParser/0.1.2"
    );

    var input = {
      articleName: content.searchTerm,
      lang: content.lang,
    };

    const wikipediaResponse = await wikipediaAlgorithm.pipe(input);

    const wikipediaContent = wikipediaResponse.get();

    content.sourceContentOriginal = wikipediaContent.content;
    console.log("> [text-robot] Fetching done!");
  }

  function sanitizeContent(content) {
    const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(
      content.sourceContentOriginal
    );
    const withoutDatesInParentheses = removeDatesInParentheses(
      withoutBlankLinesAndMarkdown
    );

    content.sourceContentSanitized = withoutDatesInParentheses;

    function removeBlankLinesAndMarkdown(text) {
      const allLines = text.split("\n");

      const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
        if (line.trim().length === 0 || line.trim().startsWith("=")) {
          return false;
        }

        return true;
      });

      return withoutBlankLinesAndMarkdown.join(" ");
    }
  }
  function removeDatesInParentheses(text) {
    return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, "").replace(/  /g, " ");
  }

  function breakContentIntoSentences(content) {
    content.sentences = [];

    const sentences = sentenceBoundaryDetection.sentences(
      content.sourceContentSanitized
    );
    sentences.forEach((sentence) => {
      content.sentences.push({
        text: sentence,
        keywords: [],
        images: [],
      });
    });
  }

  function limitMaximumSentences(content) {
    content.sentences = content.sentences.slice(0, content.maximumSentences);
  }

  async function fetchKeywordsOfAllSentences(content) {
    try {
      console.log("> [text-robot] Starting to fetch keywords from Watson");

      for (const sentence of content.sentences) {
        console.log(`> [text-robot] Sentence: "${sentence.text}"`);

        sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text);

        console.log(
          `> [text-robot] Keywords: ${sentence.keywords.join(", ")}\n`
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchWatsonAndReturnKeywords(sentence) {
    try {
      return new Promise((resolve, reject) => {
        nlu
          .analyze({
            text: sentence, // Buffer or String
            features: {
              concepts: {},
              keywords: {},
            },
          })
          .then((response) => {
            const keywords = response.result.keywords.map((keyword) => {
              return keyword.text;
            });

            resolve(keywords);
          })
          .catch((err) => {
            console.log("error: ", err);
          });
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = robot;
