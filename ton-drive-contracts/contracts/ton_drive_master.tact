import "@stdlib/deploy";
import "./ton_drive_user_collection";
import "./messages";

contract TonDriveMaster with Deployable {
    init() {

    }

    receive("create_collection") {
        let userCollectionInit: StateInit = self.getUserCollection(sender());
        send(SendParameters{
            to: contractAddress(userCollectionInit),
            value: 0,
            mode: SendIgnoreErrors + SendRemainingValue,
            code: userCollectionInit.code,
            data: userCollectionInit.data,
            body: "create_collection".asComment()
        });
    }

    get fun user_collection_address(userAddr: Address): Address {
      return contractAddress(self.getUserCollection(userAddr));
    }

    fun getUserCollection(owner: Address): StateInit {
      return initOf TonDriveUserCollection(owner);
    }
}
