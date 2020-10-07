const cheerio = require("cheerio");
const axios = require("axios");
const FormData = require("form-data");

const fetchData = async (siteUrl) => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

async function readSite(content) {
  
  content.website = {
    path: "/por/Governo/Conselho-de-Ministros",
    url:"https://www.portaldogoverno.gov.mz"
    
  };

  const $ = await fetchData(content.website.url + content.website.path );

  content.website.title = removeBlankLinesAndMarkdown(
    $(".attribute-header").first().text()
  );

  content.website.subtitle = removeBlankLinesAndMarkdown(
    $(".attribute-short").first().text()
  );

  content.website.members = [];

  $(".list").find("td").each((index, element) => {
    let member = getMember($(element),content.website.url);
    console.log(member);
    if (member.post.length >0 ){
      content.website.members.push(member);
    }
    
    //content.website.tags.push($(element));
  });

  console.log(content.website);
}

function getMember(memberPost,url) {
  const member = {};
  member.post = removeBlankLinesAndMarkdown(memberPost.find("b").text());
  member.name = removeBlankLinesAndMarkdown(memberPost.find("p").last().text());
  member.imgUrl = [];

  member.imgUrl.push (url+memberPost.find("img").attr('src'));

  //console.log(post);
  return member;
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

  return withoutBlankLinesAndMarkdown.join(" ").replace(/\t/g, "").replace(/  /g, "").replace(/  /g, "");
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

module.exports = {
  readSite,
};
