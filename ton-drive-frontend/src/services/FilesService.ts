import {
    Address,
    beginCell,
    Builder,
    Cell,
    Dictionary,
    DictionaryValue,
    Sender,
    Slice,
    toNano,
    TupleBuilder
} from "ton-core";
import {TonClient} from "ton";

export type FileInfo = {
    storageContractAddress: Address | null,
    fileSize: bigint,
    name: string,
    bagId: bigint
}

export type CollectionInfo = {
    address: Address,
    balance: bigint
}

export interface UserCollection {
    fileList(): Promise<FileInfo[]>

    createContract(details: Cell, meta: { name: string, size: number }): Promise<void>

    info(): Promise<CollectionInfo>

    closeContract(bagId: bigint): Promise<void>

    closeCollection(): Promise<void>

    createCollection(): Promise<void>
}

export interface TonDrive {
    userCollection(userAddr: Address): UserCollection
}

type FileInfoInternal = {
    storageContractAddress: Address | null,
    fileSize: bigint,
    name: string,
    created: bigint
}

function loadFileInfo(slice: Slice): FileInfoInternal {
    let sc_0 = slice;
    let _storageContractAddress = sc_0.loadMaybeAddress();
    let _closed = sc_0.loadBit();
    let _fileSize = sc_0.loadIntBig(257);
    let _name = sc_0.loadStringRefTail();
    let _created = sc_0.loadIntBig(257);

    return {
        storageContractAddress: _storageContractAddress,
        fileSize: _fileSize,
        name: _name,
        created: _created
    };
}

function dictValueParserFileInfo(): DictionaryValue<FileInfoInternal> {
    return {
        serialize: (src, buidler) => {
            //TODO: not needed
        },
        parse: (src) => {
            return loadFileInfo(src.loadRef().beginParse());
        }
    }
}

const tonDriveMasterAddress = Address.parse('EQBBZT_bBXKNFM_L6vn6i5KmLeW3W-PV_0D_ogotewC1iasD')
export const storageProviderAddress = Address.parse('UQCYNSSutUKJRWI9VgZqpSkBz5E3tfSh60g0SBDxwSP5hakL')

const userCollectionAddress: (client: TonClient, userAddress: Address) => Promise<Address> = (() => {
    const cache = new Map<Address, Address>();
    return (client: TonClient, userAddress: Address) => new Promise(resolve => {
        if (cache.has(userAddress)) {
            resolve(cache.get(userAddress)!!)
        } else {
            let builder = new TupleBuilder();
            builder.writeAddress(userAddress);

            client.callGetMethod(
                tonDriveMasterAddress,
                'user_collection_address',
                builder.build()
            )
                .then(x => x.stack.readAddressOpt())
                .then(addr => {
                    cache.set(userAddress, addr!!)
                    resolve(addr!!)
                })
        }
    })
})()

export function tonUserCollection(client: TonClient, sender: Sender, userAddress: Address): UserCollection {
    return {
        async fileList(): Promise<FileInfo[]> {
            const collectionAddress: Address = await userCollectionAddress(client, userAddress)

            return await client.callGetMethod(
                collectionAddress!!,
                'allItems',
                []
            ).then(x => {
                let dict = Dictionary
                    .loadDirect(
                        Dictionary.Keys.BigUint(256),
                        dictValueParserFileInfo(),
                        x.stack.readCellOpt()
                    )
                return dict.keys().map(bagId => {
                    const info = dict.get(bagId)!!;

                    return {
                        ...info,
                        bagId
                    }
                })
            })
        },
        async createContract(details: Cell, meta): Promise<void> {
            function storeCreate() {
                return (builder: Builder) => {
                    let b_0 = builder;
                    b_0.storeUint(1563101277, 32);
                    b_0.storeRef(details);
                    b_0.storeAddress(storageProviderAddress);
                    b_0.storeStringRefTail(meta.name);
                };
            }

            const collectionAddress: Address = await userCollectionAddress(client, userAddress)

            await sender.send({
                to: collectionAddress,
                //TODO: should be specified by user
                value: toNano("0.1"),
                body: beginCell().store(storeCreate()).endCell()
            })
        },
        async info(): Promise<CollectionInfo> {
            const collectionAddress: Address = await userCollectionAddress(client, userAddress)
            const balance = await client.getBalance(collectionAddress)
            return {
                balance,
                address: collectionAddress
            }
        },
        async closeContract(bagId: bigint): Promise<void> {
            function storeCloseItem() {
                return (builder: Builder) => {
                    let b_0 = builder;
                    b_0.storeUint(515883932, 32);
                    b_0.storeInt(bagId, 257);
                };
            }

            const collectionAddress: Address = await userCollectionAddress(client, userAddress)

            await sender.send({
                to: collectionAddress,
                value: toNano("0.1"),
                body: beginCell().store(storeCloseItem()).endCell()
            })
        },
        async closeCollection(): Promise<void> {
            const collectionAddress: Address = await userCollectionAddress(client, userAddress)

            return await sender.send({
                to: collectionAddress,
                value: toNano("0.1"),
                body: beginCell().storeUint(0, 32).storeStringTail('withdraw_all').endCell()
            })
        },
        async createCollection(): Promise<void> {
            return await sender.send({
                to: tonDriveMasterAddress,
                value: toNano("0.5"),
                body: beginCell().storeUint(0, 32).storeStringTail('create_collection').endCell()
            })
        }
    }
}

export default function tonDrive(client: TonClient, sender: Sender): TonDrive {

    return {
        userCollection(userAddr: Address): UserCollection {
            return tonUserCollection(client, sender, userAddr)
        }
    }
}
