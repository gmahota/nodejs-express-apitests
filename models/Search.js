// models/Search.js
class SearchPage {
    constructor(page) {
      this.page = page;
    }
    async goto() {
      await this.page.goto('https://bing.com');
    }
    async search(text) {
      await this.page.fill('[aria-label="Enter your search term"]', text);
      await this.page.keyboard.press('Enter');
    }
  }

  module.exports = { SearchPage };