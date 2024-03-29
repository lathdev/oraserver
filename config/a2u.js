
import pi_backend_1 from "pi-backend";
import dotenv_1 from "dotenv";
dotenv_1.config();
const apiKey = process.env.PI_API_KEY;
const walletPrivateSeed = process.env.WALLET_PRIVATE_SEED ;
const pi = new pi_backend_1["default"](apiKey, walletPrivateSeed);
export async function createWithdraw(amount, userUid) {
  try {
    const res= await pi.createPayment({amount: amount, memo: "WithDraw", metadata: {withdraw: "UserWithdraw"},  uid: userUid })
    return res;
  }
    catch(err) {
      console.log("Error 1: ", err); 
    }
}
export async function createTxid(hiiu) {
  try {
    const paymentId=hiiu;
    const txid = await pi.submitPayment(paymentId);
    return txid;

  }
    catch(err) {
      console.log("Error 2: ", err); 
    }
}
export async function completeWithdraw(lanh,hehe) {
  try {
    const paymentId=lanh;
    const txid = hehe;
    const completedPayment = await pi.completePayment(paymentId, txid);
    return completedPayment;
  }
    catch(err) {
      console.log("Error 3: ", err); 
    }
}
export async function incompleteWithdraw() {
  try {
    const incompleteWithdraw = await pi.getIncompleteServerPayments();
    return incompleteWithdraw;
  }
  catch(err) {
    console.log("Error 4: ", err); 
  }
}
export async function cancelWithdraw(paymentID) {
  try {
    const paymentId = paymentID;
    const cancelWithdraw = await pi.cancelPayment(paymentId)
    return cancelWithdraw;
  }
  catch(err) {
    console.log("Error 5: ", err); 
  }
}

