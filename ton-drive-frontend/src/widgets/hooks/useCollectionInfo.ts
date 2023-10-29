import {CollectionInfo} from "../../services/FilesService";
import {useEffect, useState} from "react";
import {useMyCollection} from "./useMyCollection";

export function useCollectionInfo(): CollectionInfo | null {
    const [info, setInfo] = useState<CollectionInfo | null>(null)
    const myCollection = useMyCollection()

    useEffect(() => {
        if (myCollection == null) {
            return;
        }
        myCollection
            .info()
            .then(setInfo)
    }, [myCollection])

    return info
}
