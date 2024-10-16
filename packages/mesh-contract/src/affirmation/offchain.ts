import {
  Asset,
  BuiltinByteString,
  ConStr0,
  deserializeAddress,
  Integer,
  resolveScriptHash,
  mConStr0,
  mConStr1,
  Mint,
  serializePlutusScript,
  stringToHex,
  
  UTxO,
  Transaction
} from "@meshsdk/core";
import type { Data,Action } from '@meshsdk/core';
import { applyParamsToScript , applyCborEncoding} from "@meshsdk/core-csl";
import { Address,Credential,AddressType } from "@meshsdk/core-cst"

import { MeshTxInitiator, MeshTxInitiatorInput } from "../common";
import blueprint from "./plutus.json";

export type AffirmationDatum = ConStr0<
  [Integer, BuiltinByteString]
>;

export const MeshAffirmationBlueprint = blueprint;
type scriptInfo ={ 
  code?: string, version?: string, address: string, policyId?: string, scriptCbor?: string
}
export class MeshAffirmationContract extends MeshTxInitiator {
  

  constructor(inputs: MeshTxInitiatorInput) {
    super(inputs);
    this.languageVersion = 'V3';
  }


  getScript = (type: 'Mint' | 'Spend', beneficiaryKeyHash: string ) => {
    const scriptCbor:string=applyCborEncoding(blueprint?.validators[type=='Mint'?0:1]?.compiledCode || '');
    const policyId:string = resolveScriptHash(scriptCbor, "V3");
    let script:scriptInfo = serializePlutusScript(
      { code: scriptCbor, version: "V3" },
      beneficiaryKeyHash,
      this.networkId,
    );
    script.policyId = policyId;
    script.code = scriptCbor;
    script.version = "V3";
    return script;
  };
  affirm = async (beneficiary: Credential): Promise<string> => {
    console.log('Started affirm');
    if (!this.wallet) return '';
    const { utxos, walletAddress, collateral } = await this.getWalletInfoForTx();
    const rewardAddress = (await this.wallet.getRewardAddresses())[0];
    if (!rewardAddress) return '';
    const stakeAddrBech = walletAddress || "";
    const stakeAddr = Address.fromBech32(stakeAddrBech);
    const stakeAddrProps = stakeAddr.getProps();
    const stakeHash = stakeAddrProps.delegationPart?.hash || "";
    const walletHash = stakeAddrProps.paymentPart?.hash || "";
    const mintingScript = this.getScript("Mint", stakeHash);
    if (!mintingScript.scriptCbor) return '';
    const spendingScript = this.getScript("Spend", stakeHash);
    const targetAddress = mintingScript.address;
    

    
    
    
    const redeemer = {
      data: { alternative: 0, fields: [] },
    };
    const myDatum:Data = { alternative: 0, fields: [stakeHash] };
    
    
    
    

    const asset: Mint = {
      assetName: stakeHash,
      assetQuantity: '1',
      metadata: {},
      label: '721',
      recipient: {address: targetAddress, datum:{inline: true, value: myDatum}}
    };
    
    const assets:Asset[] = [];
    
    assets.push({unit: mintingScript.policyId+stakeHash, quantity:'1'})
    console.log(mintingScript.scriptCbor);
    console.log('Beginning transaction');
    const tx = new Transaction({ initiator: this.wallet }).mintAsset(mintingScript.scriptCbor,asset,redeemer).setRequiredSigners([rewardAddress,walletAddress])
    console.log(tx);
    const result = await tx.build();
    console.log(result);
    
    /*
    console.log(mintingScript.policyId);
    console.log(stakeHash);
    await this.mesh
    .mintPlutusScript(this.languageVersion)
    .mint("1", mintingScript.policyId || '', stakeHash)
    .txOutInlineDatumValue(mConStr0([stakeHash]))
    .txOut(targetAddress, assets).txOutDatumHashValue(mConStr0([stakeHash]))
    
    .mintingScript(mintingScript.scriptCbor || '')
    .mintRedeemerValue(mConStr1([]))
    
    .txInCollateral(
      collateral.input.txHash,
      collateral.input.outputIndex,
      collateral.output.amount,
      collateral.output.address,
    )
    .changeAddress(walletAddress)
    .selectUtxosFrom(utxos) 
    .requiredSignerHash(stakeHash)
    .requiredSignerHash(walletHash)
    .complete();
    ///*/
    return this.mesh.txHex;
    //const spendingScript:string = applyCborEncoding(blueprint?.validators[1]?.compiledCode || '');
    //const targetAddress = new Address({type:AddressType.BasePaymentScriptStakeKey,networkId: this.networkId, paymentPart: Credential})
    /*
    export declare type AddressProps = {
      type: AddressType;
      networkId?: NetworkId;
      pointer?: Pointer;
      paymentPart?: Credential;
      delegationPart?: Credential;
      byronAddressContent?: ByronAddressContent;
  };
  */
    console.log(stakeAddrProps);

    return 'foo';
    /*
    const { utxos, walletAddress } = await this.getWalletInfoForTx();
    const { scriptAddr } = this.getScript();
    const signerHash = deserializeAddress(walletAddress).pubKeyHash;

    await this.mesh
      .txOut(scriptAddr, assets)
      .txOutDatumHashValue(mConStr0([signerHash]))
      .changeAddress(walletAddress)
      .selectUtxosFrom(utxos)
      .complete();
    return this.mesh.txHex;
    */
  };

  revoke = async (scriptUtxo: UTxO, message: string): Promise<string> => {
    return 'foo';
    /*
    const { utxos, walletAddress, collateral } =
      await this.getWalletInfoForTx();
    const signerHash = deserializeAddress(walletAddress).pubKeyHash;

    await this.mesh
      .spendingPlutusScriptV2()
      .txIn(
        scriptUtxo.input.txHash,
        scriptUtxo.input.outputIndex,
        scriptUtxo.output.amount,
        scriptUtxo.output.address,
      )
      .txInScript(this.scriptCbor)
      .txInRedeemerValue(mConStr0([stringToHex(message)]))
      .txInDatumValue(mConStr0([signerHash]))
      .requiredSignerHash(signerHash)
      .changeAddress(walletAddress)
      .txInCollateral(
        collateral.input.txHash,
        collateral.input.outputIndex,
        collateral.output.amount,
        collateral.output.address,
      )
      .selectUtxosFrom(utxos)
      .complete();

    return this.mesh.txHex;
    */
  };

}