import * as StellarSdk from "stellar-sdk";
import axios from "axios";

const apiKey = "pqacyo0vwvkcgnhbk9i4ctqnnt5h9t95ddsgnbjzpzfl3gsb5feph6wgytscoasv";
const myKeypair = StellarSdk.Keypair.fromSecret("SBNNSRXAFSHZGVFSBTLAATOCIOTSEIE3CLC4GRGGXLRWLIS6B4YKCMMW");
// const typeNetwork = "Pi Network" | "Pi Testnet";
let currentPayment;

const validatePaymentData = (paymentData) => {
    if (!paymentData.amount) throw new Error("Missing amount");
    if (!paymentData.memo) throw new Error("Missing memo");
    if (!paymentData.metadata) throw new Error("Missing metadata");
    if (!paymentData.uid) throw new Error("Missing uid"); }

const getPayment = async (paymentId) => {
        const option = {
            method: "get",
            url: `https://api.minepi.com/v2/payments/${paymentId}`,
            headers: { Authorization: `Key ${apiKey}`, "Content-Type": "application/json" }
        };
        const res = await axios(option);
         return res.data;
      };

 const getHorizonClient = (network) => {
        const serverUrl = network === "Pi Network" ? "https://api.mainnet.minepi.com" : "https://api.testnet.minepi.com";
        return new StellarSdk.Server(serverUrl);
      };

const buildA2UTransaction = async (piHorizon, transactionData) => {
        if (transactionData.fromAddress !== myKeypair.publicKey()) {
          throw new Error("You should use a private seed of your app wallet!");
        }
    
        const myAccount = await piHorizon.loadAccount(myKeypair.publicKey());
        const baseFee = await piHorizon.fetchBaseFee();
    
        const paymentOperation = StellarSdk.Operation.payment({
          destination: transactionData.toAddress,
          asset: StellarSdk.Asset.native(),
          amount: transactionData.amount.toString(),
        });
    
        const transaction = new StellarSdk.TransactionBuilder(myAccount, {
          fee: baseFee.toString(),
          networkPassphrase: this.NETWORK_PASSPHRASE,
          timebounds: await piHorizon.fetchTimebounds(180),
        })
          .addOperation(paymentOperation)
          .addMemo(StellarSdk.Memo.text(transactionData.paymentIdentifier))
          .build();
    
        transaction.sign(myKeypair);
        return transaction;
      };

const submitTransaction = async (piHorizon, transaction) => {
        const txResponse = await piHorizon.submitTransaction(transaction);
        return txResponse.id;
      };

 const validateSeedFormat = (seed) => {
        if (!seed.startsWith("S")) throw new Error("Wallet private seed must starts with 'S'");
        if (seed.length !== 56) throw new Error("Wallet private seed must be 56-character long");
      };

export const createPayment = async (amount, userUid) =>{
    try {
        validatePaymentData(paymentData);
        const option = {
            method: "post",
            url: `https://api.minepi.com/v2/payments`,
            data: {amount: amount, memo: "WithDraw", metadata: {withdraw: "UserWithdraw"},  uid: userUid },
            headers: { Authorization: `Key ${apiKey}`, "Content-Type": "application/json" }
        };
        const res = await axios(option);
        currentPayment = res.data;
        return res.data.identifier;
    } catch (err) {
      console.log(err?.response?.data)
    }
};

export const submitPayment = async (paymentId) =>{
    try {
        if (!currentPayment || currentPayment.identifier != paymentId) {
            currentPayment = await getPayment(paymentId);
            const txid = currentPayment?.transaction?.txid;
            if (txid) {
              const errorObject = { message: "This payment already has a linked txid", paymentId, txid };
              throw new Error(JSON.stringify(errorObject));
            }
          }
    
          const piHorizon = getHorizonClient(currentPayment.network);
          const transactionData = {
            amount: currentPayment.amount,
            paymentIdentifier: currentPayment.identifier,
            fromAddress: currentPayment.from_address,
            toAddress: currentPayment.to_address
          };
    
          const transaction = await buildA2UTransaction(piHorizon, transactionData);
          const txid = await submitTransaction(piHorizon, transaction);
          return txid;
    } catch (err) {
      console.log(err)
    }
    finally {
        currentPayment = null;
      }
};

export const completePayment = async (paymentId, txid) => {
    try {
      const option = {
        method: "post",
        url: `https://api.minepi.com/v2/payments/v2/payments/${paymentId}/complete`,
        data: {
            txid
        },
        headers: { Authorization: `Key ${apiKey}`, "Content-Type": "application/json" }
    };
    const res = await axios(option);
    return res.data;
    } finally {
      currentPayment = null;
    }
  };

 export const cancelPayment = async (paymentId) => {
    try {
      const option = {
        method: "post",
        url: `https://api.minepi.com/v2/payments/${paymentId}/cancel`,
        headers: { Authorization: `Key ${apiKey}`, "Content-Type": "application/json" }
};
    const res = await axios(option);
      return res.data;
    } finally {
      currentPayment = null;
    }
  };

export const getIncompleteServerPayments = async () => {
        const option = {
        method: "get",
        url: "https://api.minepi.com/v2/payments/incomplete_server_payments",
        headers: { Authorization: `Key ${apiKey}`, "Content-Type": "application/json" }
};
    const res = await axios(option);
     return res.data;
  };

 

 

  



 
