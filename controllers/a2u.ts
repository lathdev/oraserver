import PiNetwork from 'pi-backend';
import dotenv from 'dotenv'
import { withdrawModel } from "../models/a2uModel.js";
import { UserModel } from "../models/UserModel.js";
dotenv.config()
const apiKey = process.env.PI_API_KEY || "ss"
const walletPrivateSeed = process.env.WALLET_PRIVATE_SEED || "aa"
const pi = new PiNetwork(apiKey, walletPrivateSeed);
export default pi;
