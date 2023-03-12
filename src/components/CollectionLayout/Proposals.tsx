import {
  Button,
  Box,
  Dialog,
  FormControl,
  ProgressBar,
  TextInput,
  Tooltip,
} from "@primer/react";
import { WalletContextState } from "@solana/wallet-adapter-react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { FC, useContext, useRef, useState } from "react";
import Balancer from "react-wrap-balancer";
import { DerugStatus } from "../../enums/collections.enums";
import {
  ICollectionDerugData,
  IRequest,
} from "../../interface/collections.interface";
import { CollectionContext } from "../../stores/collectionContext";
import { FADE_DOWN_ANIMATION_VARIANTS } from "../../utilities/constants";

export const Proposals: FC<{
  requests?: IRequest[];
  wallet: WalletContextState;
  collectionDerug?: ICollectionDerugData;
  openDerugModal: (value: boolean) => void;
}> = ({ requests, wallet, openDerugModal, collectionDerug }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<IRequest>();
  const returnFocusRef = useRef(null);
  const { collection } = useContext(CollectionContext);

  const showVoteButton = () => {
    return (
      collectionDerug?.status === DerugStatus.Initialized ||
      collectionDerug?.status === DerugStatus.Voting
    );
  };

  function showClaimButton() {
    return collectionDerug?.status === DerugStatus.Completed;
  }

  function showRemintButton() {
    return collectionDerug?.status === DerugStatus.Reminting;
  }

  return (
    <motion.div
      className="flex w-full flex-col"
      variants={FADE_DOWN_ANIMATION_VARIANTS}
      style={{ borderTop: "2px solid  rgba(9, 194, 246)" }}
    >
      <Dialog
        returnFocusRef={returnFocusRef}
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        sx={{
          width: "600px",
          filter: "drop-shadow(rgb(246, 242, 9) 0px 0px 10px)",
        }}
        aria-labelledby="header-id"
      >
        <Dialog.Header id="header-id">Derug request</Dialog.Header>
        {currentRequest?.derugger.toString()}
      </Dialog>
      <div className="w-full">
        <div className="flex w-full flex-col gap-1 items-center justify-around p-3">
          {requests ? (
            requests.map((el, index) => (
              <div
                className="flex w-full items-center py-2"
                style={{
                  borderRadius: "4px",
                  padding: "10px",
                  background: "rgb(9, 194, 246,.15)",
                }}
              >
                <div className="flex gap-3 items-center justify-start w-1/2	ml-7">
                  <Balancer
                    className="text-lg cursor-pointer text-white font-mono"
                    onClick={() => {
                      setIsOpen(true);
                      setCurrentRequest(el);
                    }}
                  >
                    <span style={{ fontSize: "1em", opacity: 0.7 }}>
                      #{index + 1}
                    </span>{" "}
                    {""}{" "}
                  </Balancer>
                  {el.utility &&
                    el.utility.map((u, i) => (
                      <Tooltip
                        sx={{
                          "::after": {
                            fontSize: "1em",
                            backgroundColor: "#282C34",
                          },
                        }}
                        direction="e"
                        aria-label={u.description}
                        noDelay={true}
                      >
                        <div
                          className="text-sm font-mono cursor-help"
                          style={{
                            borderRightWidth:
                              i !== el.utility.length - 1 ? "1px" : "0px",
                            paddingRight:
                              i !== el.utility.length - 1 ? "1em" : "0px",
                            color: "rgb(9, 194, 246)",
                            filter: "drop-shadow(white 0px 0px 3px)",
                          }}
                        >
                          {" "}
                          {u.title}
                        </div>
                      </Tooltip>
                    ))}
                </div>
                <div className="flex items-center justify-end w-1/2">
                  {showVoteButton() && (
                    <Button
                      variant="invisible"
                      sx={{ color: "rgba(9,194,246)" }}
                    >
                      Vote
                    </Button>
                  )}

                  {showClaimButton() && (
                    <Button
                      variant="invisible"
                      sx={{ color: "rgba(9,194,246)" }}
                    >
                      Claim victory
                    </Button>
                  )}
                  {showRemintButton() && (
                    <Button
                      variant="invisible"
                      sx={{ color: "rgba(9,194,246)" }}
                    >
                      Remint
                    </Button>
                  )}

                  <ProgressBar
                    progress={el.voteCount / (collection?.numMints ?? 1)}
                    bg="rgba(9,194,246)"
                    sx={{
                      width: "280px",
                      filter: "drop-shadow(white 0px 0px 3px)",
                      height: "16px",
                      borderRadius: 0,
                      color: "rgb(179, 255, 174)",
                      marginLeft: "1em",
                    }}
                  />
                  <Balancer
                    className="text-lg cursor-pointer text-white font-mono px-5"
                    style={{ fontSize: "1em", opacity: 0.2 }}
                  >
                    <span
                      style={{
                        padding: "10px",
                        filter: "drop-shadow(#2dd4bf 0px 0px 10px)",
                      }}
                    >
                      {dayjs
                        .unix(el.createdAt)
                        .toDate()
                        .toString()
                        .slice(0, 10)}
                    </span>
                  </Balancer>
                </div>
              </div>
            ))
          ) : (
            <div className="text-base font-mono mt-3 text-white">
              There is no derug request yet.
              {wallet && (
                <Button
                  className="bg-transparent w-full font-mono font-bold text-lg mt-5"
                  style={{
                    filter: "drop-shadow(#2dd4bf 0px 0px 3px)",
                    backgroundColor: "rgba(0,183,234,15px)",
                    fontFamily: "monospace",
                    borderColor: "rgba(9,194,246)",
                  }}
                  onClick={() => openDerugModal(true)}
                >
                  Add derug request
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};