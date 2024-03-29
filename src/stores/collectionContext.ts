import { CandyMachineV2 } from "@metaplex-foundation/js";
import React from "react";
import {
  IChainCollectionData,
  ICollectionData,
  ICollectionDerugData,
  ICollectionRecentActivities,
  ICollectionStats,
  INftListing,
  IRequest,
  ITrait,
} from "../interface/collections.interface";
import { IGraphData, IRemintConfig } from "../interface/derug.interface";

export interface CollectionContext {
  loading: boolean;
  collection: ICollectionData | undefined;
  traits: ITrait[] | undefined;
  activeListings: INftListing[] | undefined;
  collectionStats: ICollectionStats | undefined;
  chainCollectionData: IChainCollectionData | undefined;
  recentActivities: ICollectionRecentActivities[] | undefined;
  collectionDerug: ICollectionDerugData | undefined;
  derugRequests: IRequest[] | undefined;
  graphData: IGraphData | undefined;
  remintConfig: IRemintConfig | undefined;
  candyMachine: CandyMachineV2 | undefined;
  toggleLoading(loading: boolean): void;
  setGraphData: (data: IGraphData) => void;
  setRequests: (requests: IRequest[]) => void;
  setCollectionDerug: (derug: ICollectionDerugData) => void;
  setRecentActivities: (activities: ICollectionRecentActivities[]) => void;
  setCollection: (collection: ICollectionData) => void;
  setChainCollectionData: (data: IChainCollectionData) => void;
  setTraits: (traits: ITrait[]) => void;
  setActiveListings: (activeListings: INftListing[]) => void;
  setCollectionStats: (stats: ICollectionStats) => void;
  setRemintConfig: (config: IRemintConfig) => void;
  setCandyMachine: (candyMachine: CandyMachineV2 | undefined) => void;
}

export const CollectionContext = React.createContext({} as CollectionContext);
