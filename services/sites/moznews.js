const siteUrl = "https://moznews.co.mz/category/celebridades/";
const cheerio = require("cheerio");
const axios = require("axios");
const FormData = require("form-data");

const fetchData = async (siteUrl) => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

async function read(content) {
  await processForm();
  return;
  content.website = {
    url: "https://moznews.co.mz/category/celebridades/",
    tags: [],
    links: [],
    summary: [],
  };

  const $ = await fetchData(content.website.url);

  content.website.siteName = removeBlankLinesAndMarkdown(
    $(".page-heading").text()
  );
  content.website.posts = [];

  $(".listing-item").each((index, element) => {
    content.website.posts.push(getPosts($(element)));
    //content.website.tags.push($(element));
  });
}

function getPosts(blogPost) {
  const post = {};
  post.url = blogPost.find(".post-title").attr("href");
  post.title = removeBlankLinesAndMarkdown(blogPost.find(".post-title").text());
  post.summary = removeBlankLinesAndMarkdown(
    blogPost.find(".post-summary").text()
  );
  post.date = getDateInString(post.url);

  //console.log(post);
  return post;
  // $(".post-title").each((index, element) => {
  //   content.website.links.push($(element).attr("href"));
  // });

  // $("").each((index, element) => {
  //   content.website.summary.push(removeBlankLinesAndMarkdown($(element).text()));
  // });
}

function removeBlankLinesAndMarkdown(text) {
  const allLines = text.split("\n");

  const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
    if (line.trim().length === 0 || line.trim().startsWith("=")) {
      return false;
    }

    return true;
  });

  return withoutBlankLinesAndMarkdown.join(" ").replace(/\t/g, "");
}

function getDateInString(text) {
  var day, month, year;

  result = text.match("[0-9]{2}([-/ .])[0-9]{2}[-/ .][0-9]{4}");
  if (null != result) {
    dateSplitted = result[0].split(result[1]);
    day = dateSplitted[0];
    month = dateSplitted[1];
    year = dateSplitted[2];
  }
  result = text.match("[0-9]{4}([-/ .])[0-9]{2}[-/ .][0-9]{2}");
  if (null != result) {
    dateSplitted = result[0].split(result[1]);
    day = dateSplitted[2];
    month = dateSplitted[1];
    year = dateSplitted[0];
  }

  if (month > 12) {
    aux = day;
    day = month;
    month = aux;
  }

  return year + "/" + month + "/" + day;
}

 const processForm = async () => {
  const surl =
  "https://moznews.co.mz/2020/09/18/depois-de-lhe-chamar-de-mosquito-musico-yazy-manda-felicitacoes-ao-fred-jossias/";

  const $$ = await fetchData(surl);
  
  var bodyFormData = new FormData($$('passster-form'));
  
  bodyFormData.append("passster_password", "22");

  await axios({
    method: "post",
    url: surl,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: bodyFormData,
    headers:{
      Cookie:"passster=22"
    }
    
  }).then(
    function (response) {
      const $ = cheerio.load(response.data);
      
      $(".entry-content")
        .find("p")
        .each((index, element) => {
          console.log($(element).text());
        });
    },
    (error) => {
      console.log(error);
    }
  );

  return false;
};


module.exports = {
  read,
};
