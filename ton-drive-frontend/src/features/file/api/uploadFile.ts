import { Sender, TonClient } from "ton";
import {Address, Cell} from "ton-core";
import tonDrive, {storageProviderAddress} from "../../../services/FilesService";
import { apiConfig } from "../../../shared/config/api";

export interface FileUploadOptions {
  file: File;
  tonClient: {
    client: TonClient | undefined;
  };
  sender: Sender;
  wallet: string;
}

export async function uploadFile({ file, tonClient, sender, wallet }: FileUploadOptions) {
  const formData = new FormData()
  formData.append('file', file)

  if (!tonClient || !sender || !wallet) {
      console.log("Wallet not connected")
      return;
  }
  const tonDriveService = tonDrive(tonClient.client!!, sender)
  const response = await fetch(new URL('upload', apiConfig.baseUrl), {
      method: 'POST',
      body: formData
  })

  const {bagId} = await response.json() as {bagId: string}
  const contractParams = new URLSearchParams()
  contractParams.append('bagId', bagId)
  contractParams.append('providerAddress', storageProviderAddress.toRawString())
  // TODO: use POST method body instead of query params
  const contractResponse = await fetch(new URL('/contracts?' + contractParams.toString(), apiConfig.baseUrl).toString(), {
    method: 'POST'
  })
  const contractFile = await contractResponse.arrayBuffer()

  const base64 = btoa(new Uint8Array(contractFile)
      .reduce((data, byte) => data + String.fromCharCode(byte), ''))

  const msgBody = Cell.fromBase64(base64)
  const slice = msgBody.beginParse()
  const opQueryId = slice.loadUint(32 + 64)
  const torrentHash = slice.loadRef().hash().toString('hex')
  console.log(`HEX: ${torrentHash}`, BigInt(`0x${torrentHash}`))
  const userCollection = tonDriveService.userCollection(Address.parse(wallet))
  return userCollection.createContract(msgBody, {
    name: file.name,
    size: file.size
  })
}
