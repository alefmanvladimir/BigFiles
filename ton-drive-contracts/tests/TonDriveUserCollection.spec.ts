import {
    Blockchain,
    SandboxContract,
    TreasuryContract
} from '@ton-community/sandbox';
import {Address, beginCell, Dictionary, fromNano, toNano} from 'ton-core';
import {FileInfo, TonDriveUserCollection} from '../wrappers/TonDriveUserCollection';
import '@ton-community/test-utils';
import {StorageProvider} from "../wrappers/StorageProvider";
import {compile} from '@ton-community/blueprint';

describe('TonDriveUserCollection', () => {
    let blockchain: Blockchain;
    let tonDriveUserCollection: SandboxContract<TonDriveUserCollection>;
    let deployer: SandboxContract<TreasuryContract>;
    let storageProvider: SandboxContract<StorageProvider>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');

        let storageProviderCode = await compile('StorageProvider');

        // storageProvider = blockchain.openContract(
        //     await StorageProviderMock.fromInit()
        // )
        storageProvider = blockchain.openContract(
            StorageProvider.createFromConfig({
                ratePerMbPerDay: toNano("0.01"),
                maxSpan: 10n,
                minimalFileSize: 0n,
                maximalFileSize: 10000000n
            }, storageProviderCode)
        )
        await storageProvider.sendDeploy(deployer.getSender(), toNano("0.5"))
    });

    it('should create item', async () => {
        //Given
        tonDriveUserCollection = blockchain.openContract(
            await TonDriveUserCollection.fromInit(deployer.getSender().address)
        );
        //When
        const tonsToSend = toNano("10")
        const torrentInfo = beginCell()
            .storeUint(0, 32)
            //file size
            .storeUint(123, 64)
            .endCell()
        const torrentHash = BigInt(`0x${torrentInfo.hash().toString('hex')}`);

        const storageOffer = beginCell()
            //op=offer storage contract
            .storeUint(BigInt("0x107c49ef"), 32)
            //query id
            .storeUint(0, 64)
            //torrent info
            .storeRef(torrentInfo)
            //merkle hash
            .storeUint(12345, 256)
            //expected rate
            .storeCoins(toNano("0.01"))
            //expected max span
            .storeUint(10, 32)
            .endCell()

        const res = await tonDriveUserCollection.send(
            deployer.getSender(),
            {
                value: tonsToSend
            },
            {
                $$type: 'Create',
                payload: storageOffer,
                storageProviderAddress: storageProvider.address,
                fileSize: 1024n,
                name: 'file.txt'
            }
        )
        const allItems: Dictionary<bigint, FileInfo> = await tonDriveUserCollection.getAllItems()
        const item = allItems.get(torrentHash);

        const storageContractAddress = item?.storageContractAddress!!;
        const storageContract = await blockchain.getContract(storageContractAddress)
        expect(parseFloat(fromNano(tonsToSend - storageContract.balance)))
            .toBeCloseTo(0, 0)

        expect(item?.name).toBe("file.txt");
        expect(item?.fileSize).toBe(1024n);
    });

    it('should close contract', async () => {
        //Given
        tonDriveUserCollection = blockchain.openContract(
            await TonDriveUserCollection.fromInit(deployer.getSender().address)
        );
        //Store Item
        const tonsToSend = toNano("10")
        const torrentInfo = beginCell()
            .storeUint(0, 32)
            //file size
            .storeUint(12311, 64)
            .endCell()
        const torrentHash = BigInt(`0x${torrentInfo.hash().toString('hex')}`);

        const storageOffer = beginCell()
            //op=offer storage contract
            .storeUint(BigInt("0x107c49ef"), 32)
            //query id
            .storeUint(0, 64)
            //torrent info
            .storeRef(torrentInfo)
            //merkle hash
            .storeUint(12345, 256)
            //expected rate
            .storeCoins(toNano("0.01"))
            //expected max span
            .storeUint(10, 32)
            .endCell()

        await tonDriveUserCollection.send(
            deployer.getSender(),
            {
                value: tonsToSend
            },
            {
                $$type: 'Create',
                payload: storageOffer,
                storageProviderAddress: storageProvider.address,
                fileSize: 1025n,
                name: 'file2.txt'
            }
        )

        //When
        await tonDriveUserCollection.send(
            deployer.getSender(),
            {
                value: toNano("2")
            },
            {
                $$type: 'CloseItem',
                torrentHash: torrentHash
            }
        )

        //Then
        const allItems: Dictionary<bigint, FileInfo> = await tonDriveUserCollection.getAllItems()
        const item = allItems.get(torrentHash);
        const storageContractAddress = item?.storageContractAddress;

        expect(storageContractAddress)
            .toBeNull();
    });

    it('should not allow to create item from other user', async () => {
        //Given
        tonDriveUserCollection = blockchain.openContract(
            await TonDriveUserCollection.fromInit(deployer.getSender().address)
        );
        //When
        const tonsToSend = toNano("10")
        const torrentInfo = beginCell()
            .storeUint(0, 32)
            //file size
            .storeUint(123, 64)
            .endCell()
        const torrentHash = BigInt(`0x${torrentInfo.hash().toString('hex')}`);

        const storageOffer = beginCell()
            //op=offer storage contract
            .storeUint(BigInt("0x107c49ef"), 32)
            //query id
            .storeUint(0, 64)
            //torrent info
            .storeRef(torrentInfo)
            //merkle hash
            .storeUint(12345, 256)
            //expected rate
            .storeCoins(toNano("0.01"))
            //expected max span
            .storeUint(10, 32)
            .endCell()

        const otherUser = await blockchain.treasury("user")
        const res = await tonDriveUserCollection.send(
            otherUser.getSender(),
            {
                value: tonsToSend
            },
            {
                $$type: 'Create',
                payload: storageOffer,
                storageProviderAddress: storageProvider.address,
                fileSize: 1024n,
                name: 'file.txt'
            }
        )
        const allItems: Dictionary<bigint, FileInfo> = await tonDriveUserCollection.getAllItems()
        const item = allItems.get(torrentHash);

        expect(item).toBeUndefined();
    });

    it('should not allow close contract by other user', async () => {
        //Given
        tonDriveUserCollection = blockchain.openContract(
            await TonDriveUserCollection.fromInit(deployer.getSender().address)
        );
        //Store Item
        const tonsToSend = toNano("10")
        const torrentInfo = beginCell()
            .storeUint(0, 32)
            //file size
            .storeUint(12311, 64)
            .endCell()
        const torrentHash = BigInt(`0x${torrentInfo.hash().toString('hex')}`);

        const storageOffer = beginCell()
            //op=offer storage contract
            .storeUint(BigInt("0x107c49ef"), 32)
            //query id
            .storeUint(0, 64)
            //torrent info
            .storeRef(torrentInfo)
            //merkle hash
            .storeUint(12345, 256)
            //expected rate
            .storeCoins(toNano("0.01"))
            //expected max span
            .storeUint(10, 32)
            .endCell()

        await tonDriveUserCollection.send(
            deployer.getSender(),
            {
                value: tonsToSend
            },
            {
                $$type: 'Create',
                payload: storageOffer,
                storageProviderAddress: storageProvider.address,
                fileSize: 1025n,
                name: 'file2.txt'
            }
        )

        const otherUser = await blockchain.treasury("user")
        //When
        await tonDriveUserCollection.send(
            otherUser.getSender(),
            {
                value: toNano("2")
            },
            {
                $$type: 'CloseItem',
                torrentHash: torrentHash
            }
        )

        //Then
        const allItems: Dictionary<bigint, FileInfo> = await tonDriveUserCollection.getAllItems()
        const item = allItems.get(torrentHash);
        const storageContractAddress = item?.storageContractAddress;

        expect(storageContractAddress)
            .not.toBeNull();
    });

    it('should withdraw', async () => {
        //Given
        tonDriveUserCollection = blockchain.openContract(
            await TonDriveUserCollection.fromInit(deployer.getSender().address)
        );
        //When
        const tonsToSend = toNano("10")
        const torrentInfo = beginCell()
            .storeUint(0, 32)
            //file size
            .storeUint(123, 64)
            .endCell()
        const torrentHash = BigInt(`0x${torrentInfo.hash().toString('hex')}`);

        const storageOffer = beginCell()
            //op=offer storage contract
            .storeUint(BigInt("0x107c49ef"), 32)
            //query id
            .storeUint(0, 64)
            //torrent info
            .storeRef(torrentInfo)
            //merkle hash
            .storeUint(12345, 256)
            //expected rate
            .storeCoins(toNano("0.01"))
            //expected max span
            .storeUint(10, 32)
            .endCell()

        const res = await tonDriveUserCollection.send(
            deployer.getSender(),
            {
                value: tonsToSend
            },
            {
                $$type: 'Create',
                payload: storageOffer,
                storageProviderAddress: storageProvider.address,
                fileSize: 1024n,
                name: 'file.txt'
            }
        )
        await tonDriveUserCollection.send(
            deployer.getSender(),
            {
                value: toNano("0.1")
            },
            "withdraw_all"
        )

        const collectionBalance = (await blockchain.getContract(tonDriveUserCollection.address)).balance
        expect(collectionBalance).toBe(0n);
    });

    it('should not allow withdrawal by non-owner', async () => {
        //Given
        tonDriveUserCollection = blockchain.openContract(
            await TonDriveUserCollection.fromInit(deployer.getSender().address)
        );
        //When
        const tonsToSend = toNano("10")
        const torrentInfo = beginCell()
            .storeUint(0, 32)
            //file size
            .storeUint(123, 64)
            .endCell()
        const torrentHash = BigInt(`0x${torrentInfo.hash().toString('hex')}`);

        const storageOffer = beginCell()
            //op=offer storage contract
            .storeUint(BigInt("0x107c49ef"), 32)
            //query id
            .storeUint(0, 64)
            //torrent info
            .storeRef(torrentInfo)
            //merkle hash
            .storeUint(12345, 256)
            //expected rate
            .storeCoins(toNano("0.01"))
            //expected max span
            .storeUint(10, 32)
            .endCell()

        const res = await tonDriveUserCollection.send(
            deployer.getSender(),
            {
                value: tonsToSend
            },
            {
                $$type: 'Create',
                payload: storageOffer,
                storageProviderAddress: storageProvider.address,
                fileSize: 1024n,
                name: 'file.txt'
            }
        )

        const collectionBalanceBeforeWithdrawal = (await blockchain.getContract(tonDriveUserCollection.address)).balance
        const user = await blockchain.treasury("user")
        await tonDriveUserCollection.send(
            user.getSender(),
            {
                value: toNano("0.1")
            },
            "withdraw_all"
        )

        const collectionBalance = (await blockchain.getContract(tonDriveUserCollection.address)).balance
        expect(collectionBalance)
            .toBe(collectionBalanceBeforeWithdrawal)
    });
});
