import "@stdlib/deploy";
import "./messages";

contract TonDriveCollectionItem with Deployable {
    const minForStorage: Int = ton("0.02");
    const gasConsumption: Int = ton("0.03");

    collectionAddress: Address;
    storageContractAddress: Address?;
    collection_idx: Int as uint32;

    init(collectionAddress: Address, idx: Int) {
        self.collectionAddress = collectionAddress;
        self.collection_idx = idx;
        self.storageContractAddress = null;
    }

    receive(createMsg: Create) {
      let msgValue: Int = context().value;
      let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
      let storageFee: Int = self.minForStorage - min(tonBalanceBeforeMsg, self.minForStorage);
      msgValue = msgValue - (storageFee + self.gasConsumption);

      send(SendParameters{
        value: msgValue,
        to: createMsg.storageProviderAddress,
        mode: SendIgnoreErrors,
        body: createMsg.payload
      });
    }

    get fun balance(): String {
      return myBalance().toCoinsString();
    }
}
