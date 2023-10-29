import {type FormEvent, useEffect} from "react"
import {Address, Cell} from "ton-core";
import {useTonClient} from "../shared/hooks/useTonClient";
import {useTonConnect} from "../shared/hooks/useTonConnect";
import tonDrive, {storageProviderAddress} from "../services/FilesService";
import {useTonAddress} from "@tonconnect/ui-react";

export interface FileUploadProps {
    className?: string;
}

export default function FileUpload({className = ''}: FileUploadProps) {
  const tonClient = useTonClient()
  const sender = useTonConnect().sender
  const wallet = useTonAddress()

  async function handleFileUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const file = formData.get('file')

    if (file == null) {
        console.log("File not chosen")
        return;
    }

    if (!(file instanceof File)) {
      console.error('File is not instance of File', file)
      return
    }

    const host = 'https://api.bigfiles.cloud'
    if (!tonClient || !sender || !wallet || wallet === '') {
        console.log("Wallet not connected")
        return;
    }
    const tonDriveService = tonDrive(tonClient.client!!, sender)
    const response = await fetch(`${host}/upload`, {
        method: 'POST',
        body: formData
    })

    const {bagId} = await response.json() as {bagId: string}
    const contractParams = new URLSearchParams()
    contractParams.append('bagId', bagId)
    contractParams.append('providerAddress', storageProviderAddress.toRawString())
    // TODO: use POST method body instead of query params
    const contractResponse = await fetch(new URL('/contracts?' + contractParams.toString(), host).toString(), {
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

  return (
    <div className={`card bg-base-200 ${className}`}>
      <form onSubmit={handleFileUpload} encType='multipart/form-data' className="card-body gap-y-2">
        <h2 className="card-title">Upload File</h2>
        <input type='file' name='file'
          className="file-input file-input-bordered file-input-accent w-full max-w-xs"/>
        <div className="card-actions justify-end">
          <button type='submit' className="btn btn-accent btn-sm">
            Upload
          </button>
        </div>
      </form>
    </div>
  )
}
