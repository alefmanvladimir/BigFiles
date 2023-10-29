import {useEffect, useState} from "react";
import type {TonStorageFile} from "../../../entities/file/model/TonStorageFile";
import {useMyCollection} from "../../drive/hook/useMyCollection";

export function useUserFiles(): TonStorageFile[] {
    const [files, setFiles] = useState<TonStorageFile[]>([]);
    const myCollection = useMyCollection()

    useEffect(() => {
        if (myCollection == null) {
            return
        }
        myCollection.fileList()
            .then(x => x.map(xx => ({
                bagId: `${BigInt(xx.bagId).toString(16)}`,
                name: xx.name,
                extension: 'txt',
                //TODO: replace with a proper code
                size: parseInt(`${xx.fileSize}`),
                //TODO: rework once corresponding field is handled by the contract
                date: new Date('2021-08-03'),
                storageContractInfo: {
                    address: xx.storageContractAddress
                }
            })))
            .then(setFiles)
    }, [myCollection])


    return files;
}
