import { Box, Button, Heading } from "@primer/react";
import {
  ICollectionDerugData,
  ICollectionStats,
} from "../../interface/collections.interface";
import HeadingItem from "./HeadingItem";
import { FC, useContext, useState } from "react";
import { DerugStatus } from "../../enums/collections.enums";
import { useSearchParams } from "react-router-dom";
import { WalletContextState } from "@solana/wallet-adapter-react";
import dayjs from "dayjs";
import { CollectionContext } from "../../stores/collectionContext";

export const CollectionStats: FC<{
  collection?: ICollectionStats;
  wallet: WalletContextState;
  openDerugModal: (value: boolean) => void;
  collectionDerug?: ICollectionDerugData;
}> = ({ collection, collectionDerug }) => {
  const { remintConfig } = useContext(CollectionContext);

  const remintConfigTime =
    remintConfig &&
    dayjs(remintConfig.privateMintEnd).isAfter(dayjs()) &&
    collectionDerug?.status === DerugStatus.Reminting
      ? remintConfig.privateMintEnd
      : undefined;

  return (
    <Box className="flex flex-row items-start justify-between w-full px-10 mt-5">
      <Box className="flex flex-col gap-5 border-1 w-1/2">
        <HeadingItem
          amount={collection?.fp}
          descColor="#2dd4bf"
          title="FLOOR PRICE"
          desc="SOL"
        />
        <HeadingItem
          title="LISTED"
          descColor="#2dd4bf"
          desc="NFTs"
          amount={collection?.numListed}
        />
        <HeadingItem
          descColor="#2dd4bf"
          title="MARKET CAP"
          amount={collection?.marketCap}
          desc="SOL"
        />
        {collectionDerug && (
          <HeadingItem
            descColor="#2dd4bf"
            title={remintConfigTime ? "PRIVATE MINT END" : "REMAINING TIME"}
            date={remintConfigTime ?? collectionDerug.periodEnd}
            isCounter
            desc=""
          />
        )}
      </Box>

      <Box className="flex flex-col gap-5 w-1/2">
        <HeadingItem
          descColor="#2dd4bf"
          title="TOTAL SUPPLY"
          desc="NFTs"
          amount={collection?.numMints}
        />
        {collectionDerug && (
          <HeadingItem
            descColor="#2dd4bf"
            title="TOTAL REQUESTS"
            amount={collectionDerug.totalSuggestionCount}
            desc=""
          />
        )}

        {collectionDerug && (
          <HeadingItem
            descColor="#2dd4bf"
            title="STATUS"
            amount={
              collectionDerug.status[0].toUpperCase() +
              collectionDerug.status.slice(1)
            }
            desc=""
          />
        )}
        {collectionDerug &&
          collectionDerug.status === DerugStatus.Reminting && (
            <HeadingItem
              descColor="#2dd4bf"
              title="TOTAL REMINTED"
              amount={collectionDerug.totalReminted}
              desc=""
            />
          )}
      </Box>
    </Box>
  );
};
