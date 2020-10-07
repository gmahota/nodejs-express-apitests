const cheerio = require("cheerio");
const axios = require("axios");
const FormData = require("form-data");
const readSiteGov = require("../sites/governo/portalgovernomz/index.js")

const sites = {
  governo:require("../sites/governo/portalgovernomz/index.js"),
  noticias:require("../sites/jornal/noticiasmz/index.js"),
  default:require("../sites/index.js")
}

const fetchData = async (siteUrl) => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

async function read(content) {
  switch (content.searchTerm.toLowerCase()) {
    case "ministros":await sites.governo.readSite(content); break;
    case "noticias":await sites.noticias.readSite(content); break;
    default: sites.default;break;
  }
  
}

module.exports = {
  read,
};
