import {CollectionInfo} from "../../../services/FilesService";
import {useEffect, useState} from "react";
import {useMyCollection} from "./useMyCollection";
import { useRealtimeRemoteState } from "../../../shared/hooks/useRealtimeRemoteState";

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

export function useRealtimeCollectionInfo(): CollectionInfo | null {
    const myCollection = useMyCollection()
    return useRealtimeRemoteState({
        fetchFn: async () => {
          if (myCollection == null) {
            return null;
          }
          return myCollection.info()
        },
        isEqualFn: (oldData, newData) => {
            const isAddressEqual = oldData?.address.toString() === newData?.address.toString()
            const isBalanceEqual = oldData?.balance === newData?.balance
            return isAddressEqual && isBalanceEqual
        },
        deps: [myCollection]
    })
}
