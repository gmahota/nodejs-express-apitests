import express from 'express'
import {set_paymentData} from "./services/mpesa.js";
import {robots} from "./services/robots/index.js"

const app = express()
const port = 4000

app.get('/', (req, res) => {
    res.send('Hello World!')
  });

  app.get('/mpesa/payment/:number-:reference-:transaction-:amount',async (req, res) => {
    
    var number = req.params.number;
    var reference = req.params.reference;
    var transaction = req.params.transaction;
    var amount = req.params.amount;

    await set_paymentData(number,reference,transaction,amount);
  });

  app.get('/robot/:textsearch', async (req, res) => {
    const content = {};

    content.searchTerm = req.params.textsearch;
    content.lang = "pt"
    await robots.text(content);

    res.send(content.sourceContentOriginal);
  });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});