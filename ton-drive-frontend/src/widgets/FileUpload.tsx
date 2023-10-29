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
        // file.size;
        // file.name;
        // file.type;

        const host = 'https://api.bigfiles.cloud'
        if (!tonClient || !sender || !wallet || wallet === '') {
            console.log("Wallet not connected")
            return;
        }
        const tonDriveService = tonDrive(tonClient.client!!, sender)
        fetch(`${host}/upload`, {
            method: 'POST',
            body: formData
        }).then(res => res.json())
            .then(({bagId}) => {
                return fetch(`${host}/contracts?bagId=${bagId}&providerAddress=${storageProviderAddress.toRawString()}`, {
                    method: "POST"
                })
                    .then(res => res.arrayBuffer())
                    .then(contractFile => {
                        const base64 = btoa(new Uint8Array(contractFile)
                            .reduce((data, byte) => data + String.fromCharCode(byte), ''))

                        const msgBody = Cell.fromBase64(base64)
                        const slice = msgBody.beginParse()
                        const opQueryId = slice.loadUint(32 + 64)
                        const torrentHash = slice.loadRef().hash().toString('hex')
                        console.log(`HEX: ${torrentHash}`, BigInt(`0x${torrentHash}`))
                        const userCollection = tonDriveService.userCollection(Address.parse(wallet))
                        return userCollection.createContract(msgBody, {
                            //@ts-ignore
                            name: file.name,
                            //@ts-ignore
                            size: file.size
                        })
                    })
            })
    }

    return (
        <>
            <form onSubmit={handleFileUpload} encType='multipart/form-data'
                  className={`form-control gap-y-2 ${className}`}>
                <input type='file' name='file'
                       className="file-input file-input-bordered file-input-accent w-full max-w-xs"/>
                <button type='submit' className="btn btn-accent">
                    Upload
                </button>
            </form>
        </>
    )
}
