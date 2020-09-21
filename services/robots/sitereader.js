const cheerio = require("cheerio");
const axios = require("axios");
const FormData = require("form-data");
const readSiteGov = require("../sites/portalgovernomz/portalgovernomz.js")

const fetchData = async (siteUrl) => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

async function read(content) {
  await readSiteGov.readSite(content);
}

module.exports = {
  read,
};
