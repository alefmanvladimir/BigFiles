import { TonConnectButton } from "@tonconnect/ui-react";
import { Counter } from "../features/demo/ui/Counter";
import { Jetton } from "../features/demo/ui/Jetton";
import { TransferTon } from "../features/demo/ui/TransferTon";
import { Button, FlexBoxCol, FlexBoxRow } from "../shared/ui/styled";
import { useTonConnect } from "../shared/hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import "@twa-dev/sdk";

export default function DemoPage() {
  const { network } = useTonConnect();

  return (
    <FlexBoxCol>
      <FlexBoxRow>
        <TonConnectButton />
        <Button>
          {network
            ? network === CHAIN.MAINNET
              ? "mainnet"
              : "testnet"
            : "N/A"}
        </Button>
      </FlexBoxRow>
      <Counter />
      <TransferTon />
      <Jetton />
    </FlexBoxCol>
  )
}
