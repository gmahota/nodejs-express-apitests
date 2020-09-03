import { Client } from '@paymentsds/mpesa'

import dotenv from 'dotenv'

dotenv.config();

const client = new Client({
   apiKey: process.env.Mpesa_ApiKey,        // API Key
   publicKey: process.env.Mpesa_PublicKey,  
   serviceProviderCode: process.env.Mpesa_ServiceProviderCode, // input_ServiceProviderCode

   verifySSL: false,
   debugging: true,        
});

console.log(process.env.Mpesa_ApiKey);

 const set_paymentData = async (from,reference,transaction,amount)=>{
      
    const paymentData = {
        from: from,               // input_CustomerMSISDN
        reference: reference +  Math.floor(Math.random()*100),              // input_ThirdPartyReference
        transaction: transaction,          // input_TransactionReference
        amount: amount                    // input_Amount
     };

     await client.receive(paymentData).then(r => {
      console.log(r)
        // Handle success scenario
     }).catch(e =>{
        console.log(e)
        // Handle success scenario
     });
 };

 export{
   set_paymentData
 }