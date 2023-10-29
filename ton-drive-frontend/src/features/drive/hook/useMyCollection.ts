import {useTonAddress} from "@tonconnect/ui-react";
import {useTonClient} from "../../../shared/hooks/useTonClient";
import {useEffect, useState} from "react";
import tonDrive, {UserCollection} from "../../../services/FilesService";
import {useTonConnect} from "../../../shared/hooks/useTonConnect";
import {Address} from "ton-core";

export function useMyCollection() {
    const wallet = useTonAddress()
    const tonClient = useTonClient()
    const [collection, setCollection] = useState<UserCollection | null>(null)
    const sender = useTonConnect().sender

    useEffect(() => {
        const client = tonClient.client

        if (wallet == null || wallet == '' || !client) {
            setCollection(null);
            return;
        }
        const userAddr = Address.parse(wallet)
        setCollection(tonDrive(client, sender)
            .userCollection(userAddr))
    }, [wallet, tonClient.client])

    return collection
}
