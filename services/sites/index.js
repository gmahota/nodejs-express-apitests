const playwright = require('playwright');
// search.spec.js
const { SearchPage } = require('../../models/Search')

const fetchData = async (siteUrl) => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

async function read(content) {
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
