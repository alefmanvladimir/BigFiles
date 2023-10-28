import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";

const contract_deployed: Int = 0xbf7bd0c1;
const close_contract: Int = 0x79f937ea;
const storage_contract_terminated: Int = 0xb6236d63;

const contract_not_found: Int = 1101;

struct FileInfo {
    storageContractAddress: Address?;
    closed: Bool;
    //File metadata
    fileSize: Int;
    name: String;
    created: Int;
}

contract TonDriveUserCollection with Deployable, Ownable {
    const minForStorage: Int = ton("0.1");
    const gasConsumption: Int = ton("0.03");

    owner: Address;

    hash_to_info_map: map<Int as uint256, FileInfo>;

    init(owner: Address) {
        self.owner = owner;
    }

    receive(createMsg: Create) {
      self.requireOwner();
      let msgValue: Int = context().value;
      let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
      let storageFee: Int = self.minForStorage - min(tonBalanceBeforeMsg, self.minForStorage);
      msgValue = msgValue - (storageFee + self.gasConsumption);

      if(createMsg.storageProviderAddress != null) {
        send(SendParameters{
          value: msgValue,
          to: createMsg.storageProviderAddress!!,
          mode: SendIgnoreErrors,
          body: createMsg.payload
        });
      }

      let payloadSlice: Slice = createMsg.payload.beginParse();
      //op + query_id
      payloadSlice.loadBits(32 + 64);
      let torrentInfo: Cell = payloadSlice.loadRef();
      let torrentHash: Int = torrentInfo.hash();
      let torrentInfoSlice: Slice = torrentInfo.beginParse();
      torrentInfoSlice.loadBits(32);
      let fileSize: Int = torrentInfoSlice.loadUint(64);

      self.hash_to_info_map.set(torrentHash, FileInfo{
        storageContractAddress: null,
        fileSize: fileSize,
        name: createMsg.name,
        closed: false,
        created: now()
      });
    }

    receive(msg: CloseItem) {
        self.requireOwner();
        let storedItem: FileInfo? = self.hash_to_info_map.get(msg.torrentHash);
        if (storedItem == null) {
            throw(contract_not_found);
        } else {
            send(SendParameters{
                to: (storedItem!!).storageContractAddress!!,
                body: beginCell()
                    .storeUint(close_contract, 32)
                    //query id
                    .storeUint(0, 64).endCell(),
                value: 0,
                mode: SendRemainingValue
            });
        }
    }

    receive("create_collection"){}

    receive("withdraw_all"){
        self.requireOwner();
        send(SendParameters{
            to: self.owner,
            value: 0,
            mode: SendIgnoreErrors + SendRemainingBalance,
            body: "Collection closed".asComment()
        });
    }

    //handle receipt from storage contract
    receive(msg: Slice) {
        let op: Int = msg.loadUint(32);
        if(op == contract_deployed) {
            //TODO: Temporary solution, currently there is no way to calculate storage contract address
            //query_id
            msg.loadUint(64);
            let torrentHashFromMsg: Int = msg.loadUint(256);
            let storedItem: FileInfo? = self.hash_to_info_map.get(torrentHashFromMsg);
            if (storedItem != null) {
                self.hash_to_info_map.set(torrentHashFromMsg, FileInfo{
                    storageContractAddress: sender(),
                    fileSize: (storedItem!!).fileSize,
                    name: (storedItem!!).name,
                    closed: false,
                    created: (storedItem!!).created
                });
            }
        } else if(op == storage_contract_terminated){
            msg.loadUint(64);
            let torrentHashFromMsg: Int = msg.loadUint(256);
            let storedItem: FileInfo? = self.hash_to_info_map.get(torrentHashFromMsg);
            if (storedItem != null) {
                self.hash_to_info_map.set(torrentHashFromMsg, FileInfo{
                    storageContractAddress: (storedItem!!).storageContractAddress,
                    fileSize: (storedItem!!).fileSize,
                    name: (storedItem!!).name,
                    closed: true,
                    created: (storedItem!!).created
                });
            }
        }
    }

    get fun allItems(): map<Int as uint256, FileInfo> {
      return self.hash_to_info_map;
    }
}
