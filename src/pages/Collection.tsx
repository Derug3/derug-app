import { FC, useEffect, useMemo, useRef, useState } from "react";
import { LeftPane } from "../components/CollectionLayout/LeftPane";
import { RightPane } from "../components/CollectionLayout/RightPane";
import {
  IChainCollectionData,
  ICollectionData,
  ICollectionDerugData,
  ICollectionRecentActivities,
  ICollectionStats,
  INftListing,
  ITrait,
} from "../interface/collections.interface";

import { CollectionStats } from "../components/CollectionLayout/CollectionStats";
import { IRequest } from "../interface/collections.interface";
import { useSearchParams } from "react-router-dom";
import utc from "dayjs/plugin/utc";

import { Box } from "@primer/react";
import { CollectionContext } from "../stores/collectionContext";
import { getSingleCollection } from "../api/collections.api";
import { HeaderTabs } from "../components/CollectionLayout/HeaderTabs";
import { AddDerugRequst } from "../components/CollectionLayout/AddDerugRequest";
import { getCollectionDerugData } from "../solana/methods/derug";
import { getDummyCollectionData } from "../solana/dummy";
import { useWallet } from "@solana/wallet-adapter-react";
import { getAllDerugRequest } from "../solana/methods/derug-request";
import DerugRequest from "../components/DerugRequest/DerugRequest";
import { DerugStatus } from "../enums/collections.enums";
import dayjs from "dayjs";
import { Remint } from "../components/Remit/Remint";
import { getFloorPrice, getListings, getTraits } from "../api/tensor";
import { IGraphData, IRemintConfig } from "../interface/derug.interface";
import NoDerugRequests from "../components/DerugRequest/NoDerugRequests";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getCandyMachine, getRemintConfig } from "../solana/methods/remint";
import PublicMint from "../components/Remit/PublicMint";
import { CandyMachineV2 } from "@metaplex-foundation/js";
import { DERUG } from "../api/url.api";
import { derugProgramFactory } from "../solana/utilities";
export const Collections: FC = () => {
  dayjs.extend(utc);
  const [collectionStats, setCollectionStats] = useState<ICollectionStats>();

  const [derugRequestVisible, setDerugRequestVisible] = useState(false);
  const [loading, toggleLoading] = useState(true);
  const [traits, setTraits] = useState<ITrait[]>();
  const [selectedInfo, setSelectedInfo] = useState("description");
  const [selectedData, setSelectedData] = useState("listed");
  const [basicCollectionData, setBasicCollectionData] =
    useState<ICollectionData>();
  const [listings, setListings] = useState<INftListing[]>();
  const [chainCollectionData, setChainCollectionData] =
    useState<IChainCollectionData>();
  const [recentActivities, setRecentActivities] =
    useState<ICollectionRecentActivities[]>();
  const [collectionDerug, setCollectionDerug] =
    useState<ICollectionDerugData>();
  const [graphData, setGraphData] = useState<IGraphData>();
  const [candyMachine, setCandyMachine] = useState<CandyMachineV2>();

  const [derugRequests, setDerugRequests] = useState<IRequest[]>();
  const iframeRef = useRef(null);
  let slug = useSearchParams()[0].get("symbol");
  let derug = useSearchParams()[0].get(DERUG);
  const [remintConfig, setRemintConfig] = useState<IRemintConfig | undefined>();

  const wallet = useWallet();

  useEffect(() => {
    void getBasicCollectionData();
    if (derug) {
      setDerugRequestVisible(true);
    }
  }, []);

  const getBasicCollectionData = async () => {
    try {
      setBasicCollectionData(await getSingleCollection(slug ?? ""));
      if (slug) {
        const collectionStats = await getFloorPrice(slug);

        if (collectionStats.fp > 100 || collectionStats.marketCap > 100) {
          collectionStats.fp = collectionStats.fp / LAMPORTS_PER_SOL;
          collectionStats.marketCap =
            collectionStats.marketCap / LAMPORTS_PER_SOL;
        }

        setCollectionStats(collectionStats);
        let listingsData = await getListings(slug);
        if (listingsData.length === 0) {
          listingsData = await getListings(collectionStats.slug);
        }
        setListings(listingsData);
        let traitsData = await getTraits(slug);
        if (traitsData.length === 0) {
          traitsData = await getTraits(collectionStats.slug);
        }
        setTraits(traitsData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      toggleLoading(false);
    }
  };

  console.log(candyMachine);

  useEffect(() => {
    if (basicCollectionData) void getChainCollectionDetails();
  }, [basicCollectionData]);

  const getChainCollectionDetails = async () => {
    try {
      // const chainDetails = await getCollectionChainData(
      //   basicCollectionData!,
      //   listings?.at(0)
      // );

      const derugProgram = derugProgramFactory();

      derugProgram.addEventListener("PrivateMintStarted", async (data) => {
        if (data.derugData.toString() === collectionDerug?.address.toString()) {
          setCollectionDerug(await getCollectionDerugData(data.derugData));
          setRemintConfig(await getRemintConfig(data.derugData));
        }
      });

      const chainDetails = await getDummyCollectionData();

      chainDetails.slug = slug!;
      setChainCollectionData(chainDetails);
      if (chainDetails.hasActiveDerugData) {
        const remintConfigData = await getRemintConfig(
          chainDetails.derugDataAddress
        );

        setRemintConfig(remintConfigData);
        if (remintConfigData) {
          setCandyMachine(await getCandyMachine(remintConfigData.candyMachine));
        }

        setCollectionDerug(
          await getCollectionDerugData(chainDetails.derugDataAddress)
        );
        setDerugRequests(
          await getAllDerugRequest(chainDetails.derugDataAddress)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getWinningRequest = useMemo(() => {
    return derugRequests?.sort((a, b) => a.voteCount - b.voteCount)[
      derugRequests.length - 1
    ];
  }, [derugRequests]);

  const showDerugRequests = useMemo(() => {
    if (collectionDerug) {
      return !!!collectionDerug.winningRequest;
    } else {
      return false;
    }
  }, [collectionDerug, derugRequests]);

  const hasWinning = useMemo(() => {
    if (collectionDerug)
      return (
        dayjs(collectionDerug.periodEnd).isBefore(dayjs()) &&
        derugRequests?.find(
          (dr) =>
            dr.voteCount >=
            collectionDerug.totalSupply / collectionDerug.thresholdDenominator
        )
      );
    else return false;
  }, [collectionDerug, derugRequests]);

  return (
    <CollectionContext.Provider
      value={{
        loading,
        toggleLoading,
        chainCollectionData,
        setChainCollectionData,
        activeListings: listings,
        setActiveListings: setListings,
        collection: basicCollectionData,
        setCollection: setBasicCollectionData,
        collectionStats,
        setCollectionStats,
        traits,
        setTraits,
        recentActivities,
        setRecentActivities,
        collectionDerug,
        setCollectionDerug,
        derugRequests,
        setRequests: setDerugRequests,
        graphData,
        setGraphData,
        remintConfig,
        setRemintConfig,
        candyMachine,
        setCandyMachine,
      }}
    >
      <Box
        className="overflow-y-auto pt-5"
        style={{
          zoom: "85%",
        }}
      >
        <Box
          className="overflow-y-clip flex flex-col"
          sx={{
            "@media screen and (max-width: 768px)": {
              flexDirection: "column-reverse",
              gap: "1em",
            },
          }}
        >
          {wallet && (
            <AddDerugRequst
              isOpen={derugRequestVisible}
              setIsOpen={(val) => setDerugRequestVisible(val)}
              derugRequests={derugRequests}
              setDerugRequest={setDerugRequests}
            />
          )}
          <Box className="sticky top-0 grid">
            <HeaderTabs
              setSelectedInfo={setSelectedInfo}
              selectedData={selectedData}
              setSelectedData={setSelectedData}
              openDerugModal={setDerugRequestVisible}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "50% 50%",
              "@media screen and (max-width: 768px)": {
                gridTemplateColumns: "100%",
              },
            }}
          >
            <div
              className="flex flex-col justify-between items-start"
              style={{
                transform: "translateY(-42px)",
              }}
            >
              <div className="flex flex-col w-full justify-between h-full">
                <LeftPane selectedInfo={selectedInfo} />
                <CollectionStats
                  collection={collectionStats}
                  collectionDerug={collectionDerug}
                  wallet={wallet}
                  openDerugModal={setDerugRequestVisible}
                />
              </div>
            </div>
            <Box
              sx={{
                maxHeight: "30em",
                overflowY: "scroll",
              }}
            >
              <RightPane
                selectedData={selectedData}
                chainCollectionData={chainCollectionData}
                traits={traits}
                iframeRef={iframeRef}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      {collectionDerug ? (
        <>
          {(collectionDerug.status === DerugStatus.Initialized ||
            collectionDerug.status === DerugStatus.Voting) &&
            showDerugRequests &&
            !hasWinning ? (
            <DerugRequest />
          ) : (
            <>
              {remintConfig &&
                (dayjs(remintConfig.privateMintEnd).isBefore(dayjs()) ||
                  (remintConfig.mintPrice && !remintConfig.privateMintEnd)) &&
                candyMachine &&
                candyMachine.itemsLoaded.toNumber() > 0 ? (
                <PublicMint />
              ) : (
                collectionDerug &&
                (hasWinning ||
                  collectionDerug.addedRequests.find((ar) => ar.winning)) &&
                derugRequests && (
                  <Remint getWinningRequest={getWinningRequest} />
                )
              )}
            </>
          )}
        </>
      ) : (
        <NoDerugRequests openDerugModal={setDerugRequestVisible} />
      )}
    </CollectionContext.Provider>
  );
};

export default Collections;
