message Create {
  payload: Cell;
  storageProviderAddress: Address;
  name: String;
  fileSize: Int;
}

message CloseItem {
  torrentHash: Int;
}
