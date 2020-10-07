const cheerio = require("cheerio");
const axios = require("axios");
const FormData = require("form-data");

const fetchData = async (siteUrl) => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

async function readSite(content) {
  
  await getSiteHome(content);

  await getCategorySite(content);

  async function getSiteHome(content){
    const portal = {
      path: "/",
      url:"http://opais.sapo.mz/"
    };
  
    const $ = await fetchData(portal.url + portal.path );
  
    //if(content.website.posts)
    portal.posts=[];
  
    const features = $("#parallax-3").find(".entry-item");
    const outherLinks = $("#parallax-4");

    $(features).each((index, element) => {    
        getFeaturePost($,portal,element);
    });   
    
    $(outherLinks).each((index, element) => {    
      //getFeaturePost($,portal,element);
      //getOuterPosts($,content,outherLinks,category)
    }); 
    
  
    portal.title = "O Pais";
  
    portal.subtitle = "Pagina Inicial";

    content.portal.push(portal);
  }

  async function getCategorySite(portal){
    if(!content.category)
      return;

      portal.posts = portal.posts
      .filter(post => post.category.toLowerCase() === content.category.toLowerCase());
     
      for(let i  = 0 ; i < content.website.posts.length ; i++){
        portal.posts[i] = await getSinglePost(content,portal.posts[i]);
      } 
  }  
}

async function getSinglePost(portal,post){

  const $ = await fetchData(portal.url + post.url );

  post.author = $(".topbanner").find("font").text();
  post.title = $(".page-header").find("headline").text();
  post.text = $(".component-inner2").find("p").text();
  
  return post;
}

function getFeatures($,portal,page) {

    
  const post = page.find(".item-wrap");
  const outherLinks = page.find(".other-links");

  getOuterPosts($,portal,outherLinks,category)
}

function getFeaturePost($,portal,feature){
  
  const post = {
    category:$(feature).find(".categories-4").text().toLowerCase(),
    url:$(feature).find(".categories-4").attr("href"),
    resume:removeBlankLinesAndMarkdown($(feature).find("h6").text()),
    desc:removeBlankLinesAndMarkdown($(feature).find("h6").text()),
    date:removeBlankLinesAndMarkdown($(feature).find(".entry-time").text()),
    image:$(feature).find("img").attr('src'),
    featured:true
  }

  if(post.desc.length>0){
    portal.posts.push(post);
  }  
}

function getOuterPosts($,content,outherLinks,category){
  outherLinks.find(".icon-calendar").remove();

  outherLinks.find('li').each((index, element) => {
    const post = {
      category:category,
      url:$(element).find("a").attr("href"),
      resume:removeBlankLinesAndMarkdown($(element).find(".item-title").text()).replace('Leia +',''),
      desc:removeBlankLinesAndMarkdown($(element).find(".item-title").text()).replace('Leia +',''),
      date:removeBlankLinesAndMarkdown($(element).find(".item-date").text()),
      image:$(element).find("img").attr('src'),
      featured:false
    }

    if(post.desc.length>0){
      content.website.posts.push(post);
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
