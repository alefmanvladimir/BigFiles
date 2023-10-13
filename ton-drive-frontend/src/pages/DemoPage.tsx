import { TonConnectButton } from "@tonconnect/ui-react";
import { Counter } from "../components/Counter";
import { Jetton } from "../components/Jetton";
import { TransferTon } from "../components/TransferTon";
import { Button, FlexBoxCol, FlexBoxRow } from "../components/styled/styled";
import { useTonConnect } from "../hooks/useTonConnect";
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
