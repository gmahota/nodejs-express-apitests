const cheerio = require("cheerio");
const axios = require("axios");
const FormData = require("form-data");

const sites = {
  governo: require("../sites/governo/portalgovernomz/index.js"),
  noticias: require("../sites/jornal/noticiasmz/index.js"),
  opais: require("../sites/jornal/opais/index.js"),
  default: require("../sites/index.js"),
};

const fetchData = async (siteUrl) => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

async function read(content) {
  switch (content.searchTerm.toLowerCase()) {
    case "ministros":
      await sites.governo.readSite(content);
      break;
    case "noticias":
      await sites.noticias.readSite(content);
      await sites.opais.readSite(content);
      break;
    default:
      sites.default;
      break;
  }
}

module.exports = {
  read,
};
