const express = require("express");
const set_paymentData = require("./services/mpesa.js");
const robots = require("./services/robots/index.js");
const state = require("./services/robots/state.js");

const app = express();
const port = process.env.PORT || 4000;

app.get("/", async (req, res) => {
  
  res.send("Hello World!");
});

app.get(
  "/api/mpesa/payment/:number-:reference-:transaction-:amount",
  async (req, res) => {
    var number = req.params.number;
    var reference = req.params.reference;
    var transaction = req.params.transaction;
    var amount = req.params.amount;

    await set_paymentData(number, reference, transaction, amount);
  }
);

app.get("/api/site/:type", async (req, res) => {

  const content = {
    searchTerm: req.params.type,
    lang: "pt",
    portal :[]
  };

  await robots.sitereader.read(content);

  res.send(content);
});

app.get("/api/site/:type/:category", async (req, res) => {

  const content = {
    searchTerm: req.params.type,
    lang: "pt",
    category: req.params.category,
    portal :[]
  };

  await robots.sitereader.read(content);

  res.send(content.website);
});

app.get("/api/robot/:textsearch", async (req, res) => {
  const content = {
    searchTerm: req.params.textsearch,
    lang: "en",
    maximumSentences: 7,
  };

  state.save(content);

  await robots.text(content);

  await robots.image();

  await robots.video();

  res.send(content.sourceContentOriginal);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
