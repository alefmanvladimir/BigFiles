import "@stdlib/deploy";
import "./ton_drive_user_collection";
import "./messages";

contract TonDriveMaster with Deployable {
    init() {

    }

    get fun user_collection_address(userAddr: Address): Address {
      return contractAddress(self.getUserCollection(userAddr));
    }

    fun getUserCollection(owner: Address): StateInit {
      return initOf TonDriveUserCollection(owner);
    }
}
