import { Box, Button, Text } from "@primer/react";
import React, { useContext, useEffect, useState } from "react";
import { CollectionContext } from "../../stores/collectionContext";
import { FaTwitter } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { getTrimmedPublicKey } from "../../solana/helpers";

const CollectionData = () => {
  const { collection, chainCollectionData } = useContext(CollectionContext);
  const [unableToLoad, setUnableToLoad] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setUnableToLoad(true);
    }, 2000);
  }, [collection]);
  return (
    <Box className="flex flex-col gap-5 pr-2 text-white">
      <Box className="flex flex-row items-start gap-5">
        {collection?.image ? (
          <img
            src={collection?.image}
            alt="collectionImg"
            className="rounded-[2em] w-32"
          />
        ) : (
          <Skeleton
            height={128}
            width={128}
            circle={true}
            baseColor="rgb(22,27,34)"
            highlightColor="rgb(29,35,44)"
            className="rounded-[50%]"
          />
        )}
        <Box className="flex flex-col gap-4 items-start">
          <Text
            className="font-bold font-monospace text-white-500 text-4xl"
            sx={{
              "@media screen and (max-width: 768px)": {
                alignItems: "flex-start",
              },
            }}
          >
            {collection?.name ?? (
              <Skeleton
                width={200}
                baseColor="rgb(22,27,34)"
                highlightColor="rgb(29,35,44)"
              />
            )}
          </Text>
          {chainCollectionData ? (
            <Text
              sx={{
                "@media screen and (max-width: 768px)": {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  width: "100%",
                },
              }}
            >
              Rugged by:
              <Text
                className="text-yellow-500 font-mon italic"
                sx={{
                  fontSize: "1em",
                  marginLeft: "0.5em",
                  color: "rgba(9,194,246)",
                  "@media screen and (max-width: 768px)": {
                    marginLeft: "0",
                  },
                }}
              >
                {getTrimmedPublicKey(chainCollectionData.rugUpdateAuthority)}
              </Text>
            </Text>
          ) : (
            <Skeleton
              width={200}
              baseColor="rgb(22,27,34)"
              highlightColor="rgb(29,35,44)"
            />
          )}
          <Box className="flex flex-row gap-5">
            {collection?.discord ? (
              <a href={collection.discord} target={"_blank"} rel="noreferrer">
                <FaDiscord
                  style={{
                    cursor: "pointer",
                    fontSize: "1.75em",
                    color: "rgb(88 101 242)",
                  }}
                />
              </a>
            ) : unableToLoad ? (
              <></>
            ) : (
              <Skeleton
                height={32}
                width={32}
                baseColor="rgb(22,27,34)"
                highlightColor="rgb(29,35,44)"
              />
            )}
            {collection?.twitter ? (
              <a href={collection.twitter} target={"_blank"} rel="noreferrer">
                <FaTwitter
                  style={{
                    cursor: "pointer",
                    fontSize: "1.75em",
                    color: "rgb(29 161 242)",
                  }}
                />
              </a>
            ) : unableToLoad ? (
              <></>
            ) : (
              <Skeleton
                height={32}
                width={32}
                baseColor="rgb(22,27,34)"
                highlightColor="rgb(29,35,44)"
              />
            )}
          </Box>
        </Box>
      </Box>
      <Text
        className="text-left text-md text-white opacity-80 font-mono max-h-24 overflow-auto"
        style={{ minHeight: "5.125em" }}
      >
        {collection?.description ?? (
          <Skeleton
            baseColor="rgb(22,27,34)"
            highlightColor="rgb(29,35,44m)"
            height={32}
          ></Skeleton>
        )}
      </Text>
    </Box>
  );
};

export default CollectionData;
