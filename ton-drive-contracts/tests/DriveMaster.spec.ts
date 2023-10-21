import {Blockchain, printTransactionFees, SandboxContract, TreasuryContract} from '@ton-community/sandbox';
import {Address, beginCell, Cell, contractAddress, toNano} from 'ton-core';
import {TonDriveMaster} from '../wrappers/TonDriveMaster';
import '@ton-community/test-utils';
import {TonDriveUserCollection} from "../build/TonDriveMaster/tact_TonDriveUserCollection";
import {StorageProviderMock} from "../build/StorageProviderMock/tact_StorageProviderMock";
import {TonDriveCollectionItem} from "../build/TonDriveMaster/tact_TonDriveCollectionItem";
import {StorageProvider} from "../wrappers/StorageProvider";
import {compile} from "@ton-community/blueprint";

describe('DriveMaster', () => {
  let blockchain: Blockchain;
  let driveMaster: SandboxContract<TonDriveMaster>;
  let deployer: SandboxContract<TreasuryContract>;

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    driveMaster = blockchain.openContract(await TonDriveMaster.fromInit());

    deployer = await blockchain.treasury('deployer');

    const deployResult = await driveMaster.send(
      deployer.getSender(),
      {
        value: toNano('0.05'),
      },
      {
        $$type: 'Deploy',
        queryId: 0n,
      }
    );

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: driveMaster.address,
      deploy: true,
      success: true,
    });
  });

  it('should deploy first time', async () => {
    //Prepare Storage Provider
    // const storageProviderContract = blockchain
    //   .openContract(await StorageProviderMock.fromInit())
    let code: Cell = await compile('StorageProvider');

    const storageProviderContract = blockchain
      .openContract(StorageProvider.createFromConfig({}, code))

    await storageProviderContract.sendDeploy(deployer.getSender(), toNano('50'))

    //Create item
    const res = await driveMaster.send(
      deployer.getSender(),
      {
        value: toNano('10')
      },
      {
        $$type: "Create",
        storageProviderAddress: storageProviderContract.address,
        payload: beginCell()
          .storeUint(11n, 10)
          .endCell()
      }
    )

    const userCollectionAddr = await driveMaster
      .getUserCollectionAddress(deployer.getSender().address);
    const userCollectionContract = blockchain
      .openContract(TonDriveUserCollection.fromAddress(userCollectionAddr))

    const collectionItemAddr = await userCollectionContract.getItemAddress(0n);
    const collectionItemContract = blockchain
      .openContract(TonDriveCollectionItem.fromAddress(collectionItemAddr))

    console.log("Master balance", await driveMaster.getBalance())
    console.log("Collection balance", await userCollectionContract.getBalance())
    console.log("Collection item balance", await collectionItemContract.getBalance())
    printTransactionFees(res.transactions)
    const storageContractBalance = await blockchain
      .runGetMethod(storageProviderContract.address, "get_wallet_params")
    console.log(storageContractBalance)
    expect(await userCollectionContract.getTotalItems()).toBe(1n);
    //Almost all the balance should be transferred to the storage
    //expect(Math.abs(parseFloat(storageContractBalance) - 10)).toBeLessThan(0.3);
  });

  it('should deploy second time', async () => {
    await driveMaster.send(
      deployer.getSender(),
      {
        value: toNano('1')
      },
      {
        $$type: "Create",
        storageProviderAddress: (await blockchain.treasury("storage-provider")).address,
        payload: beginCell()
          .storeUint(10n, 10)
          .endCell()
      }
    )
    await driveMaster.send(
      deployer.getSender(),
      {
        value: toNano('1')
      },
      {
        $$type: "Create",
        storageProviderAddress: (await blockchain.treasury("storage-provider")).address,
        payload: Cell.EMPTY
      }
    )

    const userCollectionAddr = await driveMaster.getUserCollectionAddress(deployer.getSender().address);

    const userCollectionContract: SandboxContract<TonDriveUserCollection> = blockchain.openContract(TonDriveUserCollection.fromAddress(userCollectionAddr))

    const totalItems = await userCollectionContract.getTotalItems()
    expect(totalItems).toBe(2n);
  });
});
