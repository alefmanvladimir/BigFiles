import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";
import "./ton_drive_collection_item";

contract TonDriveUserCollection with Deployable, Ownable {
    const minForStorage: Int = ton("0.02");
    const gasConsumption: Int = ton("0.03");

    owner: Address;
    totalItems: Int as uint32;

    init(owner: Address) {
        self.owner = owner;
        self.totalItems = 0;
    }

    receive(createMsg: Create) {
      let itemInit: StateInit = self.itemInit(self.totalItems);
      let msgValue: Int = context().value;
      let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
      let storageFee: Int = self.minForStorage - min(tonBalanceBeforeMsg, self.minForStorage);
      msgValue = msgValue - (storageFee + self.gasConsumption);

      send(SendParameters{
        value: msgValue,
        to: contractAddress(itemInit),
        code: itemInit.code,
        data: itemInit.data,
        mode: SendIgnoreErrors,
        body: createMsg.toCell()
      });
      self.totalItems = self.totalItems + 1;
    }

    fun itemInit(idx: Int): StateInit {
      return initOf TonDriveCollectionItem(myAddress(), idx);
    }

    get fun itemAddress(idx: Int): Address {
      return contractAddress(self.itemInit(idx));
    }

    get fun totalItems(): Int {
      return self.totalItems;
    }

    get fun balance(): String {
      return myBalance().toCoinsString();
    }
}
