import algorithmia from "algorithmia";
import sentenceBoundaryDetection from "sbd";

async function robot(content) {
  console.log(`Recebi com sucesso o content: ${content.searchTerm}`);

  await fetchContentFromWikipedia(content);
  sanitizeContent(content); //console.log(content.sourceContentOriginal);
  breakContentIntoSentences(content);

  console.log(content);
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
    return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ');
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

  
}

export { robot };
