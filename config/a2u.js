import PiNetwork from 'pi-backend/dist/index.js';

import dotenv from 'dotenv'
import { withdrawModel } from "../models/a2uModel.js";
import { UserModel } from "../models/UserModel.js";
dotenv.config()
const apiKey = process.env.PI_API_KEY || "ss"
const walletPrivateSeed = process.env.WALLET_PRIVATE_SEED || "aa"
 export default pi = new PiNetwork(apiKey,walletPrivateSeed);
