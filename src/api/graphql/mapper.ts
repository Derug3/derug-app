import dayjs from "dayjs";
import { divide, multiply, round } from "mathjs";
import {
  ICollectionData,
  ICollectionStats,
  ITrait,
  ITraitInfo,
} from "../../interface/collections.interface";

export const mapTraitsQuery = (
  data: any
  //   collection: ICollectionData
): ITrait[] => {
  const numTraits = data?.traits?.numMints ?? 0;
  const traitData: ITraitInfo[] = [];
  if (!data || !data.traits) {
    return [];
  }
  //   collection.numMints = numTraits;
  const trait: ITrait[] = [];

  Object.keys(data.traits.traitMeta).forEach((traitMeta) => {
    trait.push({
      name: traitMeta,
      values: Object.keys(data.traits.traitMeta[traitMeta]).map(
        (singleTrait: any) => {
          return {
            name: singleTrait,
            percentage: round(
              multiply(
                (data.traits.traitMeta[traitMeta][singleTrait]["n"] as any) /
                  numTraits,
                100
              ),
              2
            ),
            fp: data.traits.traitActive[traitMeta]?.singleTrait
              ? data.traits.traitActive[traitMeta][singleTrait].p
              : 0,
            image: data.traits.traitMeta[traitMeta][singleTrait]["img"],
            listedCount: data.traits.traitActive[traitMeta]?.singleTrait
              ? data.traits.traitActive[traitMeta][singleTrait].n
              : 0,
          };
        }
      ),
    });
  });

  return trait;
};

export const mapCollectionStats = (data: any): ICollectionStats => {
  const dataInfo = data.instrumentTV2;
  return {
    firstListed: dayjs.unix(dataInfo.firstListDate).toDate(),
    marketCap: dataInfo.statsOverall.marketCap,
    numListed: dataInfo.statsOverall.numListed,
    numMints: dataInfo.statsOverall.numMints,
    fp: dataInfo.statsOverall.floorPrice,
    volume24H: dataInfo.statsOverall.floor24h,
    royalty: dataInfo.sellRoyaltyFeeBPS / 100,
  };
};