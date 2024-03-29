import { Keypair } from "@solana/web3.js";
import {
  CandyMachineDto,
  INonMinted,
  StoreCandyMachineData,
} from "../interface/derug.interface";
import { get, post } from "./request.api";
import { COLLECTION, METADATA, NON_MINTED, PUBLIC_REMINT } from "./url.api";

export const saveCandyMachineData = async (
  candyMachineDto: CandyMachineDto
) => {
  return await post(PUBLIC_REMINT + "/save", candyMachineDto);
};

export const getCandyMachine = async (derugData: string) => {
  return await get(`${PUBLIC_REMINT}/${derugData}`);
};

export const getNonMinted = async (
  derugData: string
): Promise<INonMinted[]> => {
  return get(`${PUBLIC_REMINT}${NON_MINTED}/${derugData}`);
};

export const storeAllNfts = async (
  storeCandyMachine: StoreCandyMachineData
) => {
  return post(`${PUBLIC_REMINT}${COLLECTION}`, storeCandyMachine);
};

export const getPrivateMintNft = (metadata: string): Promise<INonMinted> => {
  return get(`${PUBLIC_REMINT}${METADATA}/${metadata}`);
};
