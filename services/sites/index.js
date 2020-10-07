
const cheerio = require("cheerio");
const axios = require("axios");
const FormData = require("form-data");

// search.spec.js
const { SearchPage } = require('../../models/Search')

const fetchData = async (siteUrl) => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

async function read(content) {
  return
  // In the test
  const page = await browser.newPage();
  const searchPage = new SearchPage(page);
  await searchPage.navigate();
  await searchPage.search(content.searchTerm);

  content.website = searchPage;
}

module.exports = {
  read,
};
