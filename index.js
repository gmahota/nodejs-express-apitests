import {set_paymentData} from "./services/mpesa.js";

async function start() {
    await set_paymentData("849535156","2","2",10);
}

start();
