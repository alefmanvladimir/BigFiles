import "@stdlib/deploy";
import "./ton_drive_user_collection";
import "./messages";

contract TonDriveMaster with Deployable {
    init() {

    }

    receive(createMsg: Create){
      let childInit: StateInit = self.getUserCollection(sender());

      send(SendParameters{
        value: 0,
        to: contractAddress(childInit),
        mode: SendIgnoreErrors + SendRemainingValue,
        body: createMsg.toCell(),
        code: childInit.code,
        data: childInit.data
      });
    }

    get fun user_collection_address(userAddr: Address): Address {
      return contractAddress(self.getUserCollection(userAddr));
    }

    fun getUserCollection(owner: Address): StateInit {
      return initOf TonDriveUserCollection(owner);
    }

    get fun user_collection(owner: Address): StateInit {
      return initOf TonDriveUserCollection(owner);
    }

    get fun balance(): String {
      return myBalance().toCoinsString();
    }
}
