/***
 *  Author Armando Fernandez
 *  Date: 05/29/2024
 *  Description: Learning Solana Development. This script transfers solana in lamports from one account to another by creationg a transaction with instructions for programs to exectute.
 */

import {Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction, Keypair} from "@solana/web3.js";
import { getKeypairFromEnvironment,} from "@solana-developers/helpers";
import * as dotenv from 'dotenv';
dotenv.config();


// Open a connection to the solana cluster.
const connection = new Connection(clusterApiUrl(`devnet`));
console.log("Solana (DEV) Connected!");

// Declare wallet addresses.
const fromAddress = new PublicKey(``);
const recipientAddress = new PublicKey('');

outputBalances(fromAddress, recipientAddress);

const solanaAmount = 1;
const transaction = createSendingTransaction(fromAddress, recipientAddress, solanaAmount);


// Loads the secret key from the .env file, which is then to retrieve the KeyPair. The keyPair is also used to create the signature below.
const keypair = getKeypairFromEnvironment(`SECRET_KEY`);

const signature = sendAndConfirmTransaction(
    connection,
    transaction,
    [keypair] // Holds an array of the signers for the transaction. In this case its just one signer (the sender).
  )


outputBalances(fromAddress, recipientAddress);


async function outputBalances(fromAddress, recipientAddress){

  const recipientsBalance = await connection.getBalance(recipientAddress)/LAMPORTS_PER_SOL;
  const myCurrentSolanaBalance = await connection.getBalance(fromAddress)/LAMPORTS_PER_SOL;

  console.log(`My Balance is ${myCurrentSolanaBalance} SOL`);
  console.log(`Recipient's Balance is ${recipientsBalance} SOL`);
}


function createSendingTransaction(fromAddress, recipientAddress, solanaAmount){

  const transaction = new Transaction();

  // Specify the instructions.
  const sendToKittyInstructions = SystemProgram.transfer({
    fromPubkey: fromAddress,
    toPubkey: recipientAddress,
    lamports: (LAMPORTS_PER_SOL * solanaAmount)
  });

  transaction.add(sendToKittyInstructions);

  return transaction;
}


