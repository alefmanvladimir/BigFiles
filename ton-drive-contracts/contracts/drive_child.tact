import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";

struct BagDetails {
  bagId: String;
}

contract DriveChild with Deployable, Ownable {
    owner: Address;
    items: map<Address, BagDetails>;

    init(owner: Address) {
      self.owner = owner;
    }

    receive(createMsg: Create) {
      self.items.set(createMsg.storageProviderAddress, BagDetails{
        bagId: "test"
      });
    }
}
