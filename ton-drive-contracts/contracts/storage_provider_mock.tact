import "@stdlib/deploy";

contract StorageProviderMock with Deployable {
    msg: Slice?;

    init() {
      self.msg = null;
    }

    receive(msg: Slice) {
      self.msg = msg;
    }

    get fun msg(): Slice?{
      return self.msg;
    }

    get fun balance(): String {
      return myBalance().toCoinsString();
    }
}
