import Link from "next/link";

import {
  AssetMetadata,
  cst,
  ForgeScript,
  NativeScript,
  resolvePaymentKeyHash,
  stringToHex,
} from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";

import LiveCodeDemo from "~/components/sections/live-code-demo";
import TwoColumnsScroll from "~/components/sections/two-columns-scroll";
import Codeblock from "~/components/text/codeblock";
import { demoAddresses, demoAssetMetadata } from "~/data/cardano";
import { getTxBuilder } from "../common";

export default function TxbuilderMintingNativeScript() {
  return (
    <TwoColumnsScroll
      sidebarTo="mintingNativeScript"
      title="Minting Assets with Native Script"
      leftSection={Left()}
      rightSection={Right()}
    />
  );
}

function Left() {
  let codeSnippetNative = ``;
  codeSnippetNative += `import type { NativeScript } from '@meshsdk/core';\n`;
  codeSnippetNative += `\n`;

  codeSnippetNative += `const usedAddress = await wallet.getUsedAddresses();\n`;
  codeSnippetNative += `const address = usedAddress[0];\n`;
  codeSnippetNative += `\n`;
  codeSnippetNative += `const keyHash = resolvePaymentKeyHash(address);\n\n`;

  codeSnippetNative += `const nativeScript: NativeScript = {\n`;
  codeSnippetNative += `  type: "all",\n`;
  codeSnippetNative += `  scripts: [\n`;
  codeSnippetNative += `    {\n`;
  codeSnippetNative += `      type: "before",\n`;
  codeSnippetNative += `      slot: "99999999",\n`;
  codeSnippetNative += `    },\n`;
  codeSnippetNative += `    {\n`;
  codeSnippetNative += `      type: "sig",\n`;
  codeSnippetNative += `      keyHash: keyHash,\n`;
  codeSnippetNative += `    },\n`;
  codeSnippetNative += `  ],\n`;
  codeSnippetNative += `};\n`;

  let codeSnippet1 = `const forgingScript = ForgeScript.fromNativeScript(nativeScript);\n`;

  let codeSnippet2 = `const assetMetadata: AssetMetadata = ${JSON.stringify(
    demoAssetMetadata,
    null,
    2,
  )};\n\n`;
  codeSnippet2 += `const asset: Mint = {\n`;
  codeSnippet2 += `  assetName: 'MeshToken',\n`;
  codeSnippet2 += `  assetQuantity: '1',\n`;
  codeSnippet2 += `  metadata: assetMetadata,\n`;
  codeSnippet2 += `  label: '721',\n`;
  codeSnippet2 += `  recipient: '${demoAddresses.testnet}' \n`;
  codeSnippet2 += `};\n`;

  let codeSnippet3 = `const tx = new Transaction({ initiator: wallet });\n`;
  codeSnippet3 += `tx.mintAsset(\n`;
  codeSnippet3 += `  forgingScript,\n`;
  codeSnippet3 += `  asset,\n`;
  codeSnippet3 += `);\n\n`;
  codeSnippet3 += `const unsignedTx = await tx.build();\n`;
  codeSnippet3 += `const signedTx = await wallet.signTx(unsignedTx);\n`;
  codeSnippet3 += `const txHash = await wallet.submitTx(signedTx);\n`;

  return (
    <>
      <p>
        Additionally, you can define the forging script with{" "}
        <code>NativeScript</code>. For example if you want to have a policy
        locking script, you can create a new <code>ForgeScript</code> from{" "}
        <code>NativeScript</code>:
      </p>
      <Codeblock data={codeSnippetNative} />
      <Codeblock data={codeSnippet1} />
      <p>
        To get the <code>keyHash</code>, use the{" "}
        <code>resolvePaymentKeyHash()</code>. To get the slot, use the{" "}
        <code>resolveSlotNo()</code>. Check out{" "}
        <Link href="/apis/resolvers">Resolvers</Link> on how to use these
        functions.
      </p>
      <p>
        Important: if you are using a policy locking script, you must define{" "}
        <code>setTimeToExpire</code> before the expiry; otherwise, you will
        catch the <code>ScriptWitnessNotValidatingUTXOW</code> error. See{" "}
        <Link href="/apis/transaction#setTime">Transaction - set time</Link>.
      </p>

      <p>
        Next, we define the metadata for the asset and create the asset object:
      </p>

      <Codeblock data={codeSnippet2} />

      <p>
        Finally, we create a transaction and mint the asset with the{" "}
        <code>mintAsset</code> method:
      </p>
      <Codeblock data={codeSnippet3} />

      <p>
        You can get the policy ID for this Native Script with{" "}
        <code>resolveNativeScriptHash</code>:
      </p>
      <Codeblock
        data={`const policyId = resolveNativeScriptHash(nativeScript);`}
      />
    </>
  );
}

function Right() {
  const { wallet, connected } = useWallet();

  async function runDemo() {
    const utxos = await wallet.getUtxos();
    const changeAddress = await wallet.getChangeAddress();

    const keyHash = resolvePaymentKeyHash(changeAddress);

    const nativeScript: NativeScript = {
      type: "all",
      scripts: [
        {
          type: "before",
          slot: "99999999",
        },
        {
          type: "sig",
          keyHash: keyHash,
        },
      ],
    };
    const forgingScript = ForgeScript.fromNativeScript(nativeScript);

    const policyId = cst
      .deserializeNativeScript(forgingScript)
      .hash()
      .toString();
    const tokenName = "MeshToken";
    const tokenNameHex = stringToHex(tokenName);
    const metadata = { [policyId]: { [tokenName]: { ...demoAssetMetadata } } };

    const txBuilder = getTxBuilder();

    const unsignedTx = await txBuilder
      .mint("1", policyId, tokenNameHex)
      .mintingScript(forgingScript)
      .metadataValue("721", metadata)
      .changeAddress(changeAddress)
      .invalidHereafter(99999999)
      .selectUtxosFrom(utxos)
      .complete();

    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);

    return txHash;
  }

  return (
    <LiveCodeDemo
      title="Mint Assets with Native Script"
      subtitle="Mint native assets with Native Script"
      runCodeFunction={runDemo}
      disabled={!connected}
      runDemoButtonTooltip={
        !connected ? "Connect wallet to run this demo" : undefined
      }
      runDemoShowBrowseWalletConnect={true}
    ></LiveCodeDemo>
  );
}
