import { persistNSync } from "persist-and-sync";
import { create } from "zustand";

import { MeshContentOwnershipContract } from "@meshsdk/contract";
import {
  BrowserWallet,
  KoiosSupportedNetworks,
  MeshTxBuilder,
  UTxO,
} from "@meshsdk/core";

import { demoAddresses } from "~/data/cardano";
import { getProvider } from "../../../components/cardano/mesh-wallet";

export function getContract(
  wallet: BrowserWallet,
  operationAddress,
  paramUtxo?: UTxO["input"],
) {
  const blockchainProvider = getProvider();

  const meshTxBuilder = new MeshTxBuilder({
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
    verbose: true,
  });

  const contract = new MeshContentOwnershipContract(
    {
      mesh: meshTxBuilder,
      fetcher: blockchainProvider,
      wallet: wallet,
      networkId: 0,
    },
    {
      operationAddress: operationAddress,
      paramUtxo: paramUtxo,
    },
  );

  return contract;
}

export const sampleParamUtxo = {
  outputIndex: 0,
  txHash: "e781a02ed4159b47b144e960c4b155918f50b4841eafc443c66fec40616b6df2",
};

interface State {
  operationAddress: string;
  setOperationAddress: (address: string) => void;
  paramUtxo: string;
  setParamUtxo: (paramUtxo: string) => void;
}

export const useContentOwnership = create<State>(
  persistNSync(
    (set) => ({
      operationAddress: demoAddresses.testnet,
      setOperationAddress: (address: string) =>
        set({ operationAddress: address }),
      paramUtxo: JSON.stringify(sampleParamUtxo),
      setParamUtxo: (paramUtxo: string) => set({ paramUtxo }),
    }),
    { name: "mesh-providers" },
  ),
);

export default function Placeholder() {
  return <></>;
}
