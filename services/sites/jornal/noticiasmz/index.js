const cheerio = require("cheerio");
const axios = require("axios");
const FormData = require("form-data");

const fetchData = async (siteUrl) => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

async function readSite(content) {
  
  content.website = {
    path: "/",
    url:"https://www.jornalnoticias.co.mz"
  };

  const $ = await fetchData(content.website.url + content.website.path );

  content.website.posts=[];

  $(".module.clearfix").each((index, element) => {
    getFeatures($,content,$(element));
  });

  content.website.title = "Jornal Noticias";

  content.website.subtitle = "Pagina Inicial";
}

function getFeatures($,content,page) {
  const posts = [];
  let keyword = removeBlankLinesAndMarkdown(page.find("h3").text());
  
  const post = page.find(".item-wrap");
  const outherLinks = page.find(".other-links");
  
  getFeaturePost(posts,post,keyword);

  getOuterPosts($,posts,outherLinks,keyword)

  if(keyword.length > 0){
    content.website.posts.push(posts)
  }
}

function getFeaturePost(posts,feature,keyword){
  
  feature.find(".icon-calendar").remove();

  const post = {
    keyword:keyword,
    url:feature.find("a").attr("href"),
    title:removeBlankLinesAndMarkdown(feature.find("a").text()).replace('Leia +',''),
    desc:removeBlankLinesAndMarkdown(feature.find(".item-desc").text()),
    date:removeBlankLinesAndMarkdown(feature.find(".item-date").text()),
    image:feature.find("img").attr('src'),
    featured:true
  }

  if(post.desc.length>0){
    posts.push(post);
  }  
}

function getOuterPosts($,posts,outherLinks,keyword){
  outherLinks.find(".icon-calendar").remove();

  outherLinks.find('li').each((index, element) => {
    const post = {
      keyword:keyword,
      url:$(element).find("a").attr("href"),
      title:removeBlankLinesAndMarkdown($(element).find(".item-title").text()).replace('Leia +',''),
      desc:removeBlankLinesAndMarkdown($(element).find(".item-title").text()).replace('Leia +',''),
      date:removeBlankLinesAndMarkdown($(element).find(".item-date").text()),
      image:$(element).find("img").attr('src'),
      featured:false
    }

    if(post.desc.length>0){
      posts.push(post);
    }  
  })

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
