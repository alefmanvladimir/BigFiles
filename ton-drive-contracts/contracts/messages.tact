message Create {
  payload: Cell;
  storageProviderAddress: Address?;
  name: String;
}

message CloseItem {
  torrentHash: Int;
}
