import { ToggleSwitch, Text, TextInput, Box } from "@primer/react";
import { NATIVE_MINT } from "@solana/spl-token";
import { TokenListProvider } from "@solana/spl-token-registry";
import { PublicKey } from "@solana/web3.js";
import React, { FC, useEffect, useMemo, useState } from "react";
import { FieldErrors, useForm, useFormContext } from "react-hook-form";
import Select from "react-select";
import useDebounce from "../../hooks/useDebounce";
import { DerugForm } from "../../interface/derug.interface";
import { selectStyles } from "../../utilities/styles";

export const mint: PublicKey = new PublicKey(
  "UNQtEecZ5Zb4gSSVHCAWUQEoNnSVEbWiKCi1v9kdUJJ"
);
export const usdcMint: PublicKey = new PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
);
export const usdtMint: PublicKey = new PublicKey(
  "HY6uvCfBQhKANRxBcYLBK7aUva8mT7mLP2SjrLLmipza"
);
export interface ITreasuryTokenAccInfo {
  address: PublicKey | undefined;
  chainId?: number;
  decimals: number;
  extensions?: any;
  logoURI?: string;
  name: string;
  symbol: string;
  tags?: string[];
}

const MintDetails: FC<{
  price?: number;
  setPrice?: (price: number) => void;
  duration?: number;
  setDuration?: (price: number) => void;
  handleMintChange: (mint: ITreasuryTokenAccInfo) => void;
  selectedMint?: ITreasuryTokenAccInfo;
}> = ({ price, duration, setPrice, setDuration, handleMintChange, selectedMint }) => {
  const [isPublicMint, setIsPublicMint] = useState<boolean>(true);
  const [searchLoading, toggleSearchLoading] = useState(false);
  const [searchValue, setSearchValue] = useState<string>();
  const [availableTokensList, setAvailableTokenList] =
    useState<ITreasuryTokenAccInfo[]>();

  useEffect(() => {
    void getAllMintsInfo();
  }, []);

  const { name } = useDebounce(searchValue);

  const {
    register,
    clearErrors,
    formState: { errors },
  } = useFormContext<DerugForm>();

  const getAllMintsInfo = async () => {
    const availableToken: ITreasuryTokenAccInfo[] = [];
    const tokens = await new TokenListProvider().resolve();

    const tokenList = tokens
      .getList()
      .filter((item) => item.logoURI !== undefined)
      .sort((a, b) => a.name.localeCompare(b.name));

    const solToken = tokenList.find(
      (item) => item.address === NATIVE_MINT.toString()
    );
    const usdcToken = tokenList.find(
      (item) => item.address === usdcMint.toString()
    );
    const unqToken = tokenList.find((item) => item.address === mint.toString());
    const usdtToken = tokenList.find(
      (item) => item.address === usdtMint.toString()
    );
    solToken &&
      availableToken.push({
        decimals: solToken.decimals,
        logoURI: solToken.logoURI,
        address: new PublicKey(solToken.address),
        name: "Solana",
        symbol: solToken.symbol,
        tags: solToken?.tags,
        chainId: solToken?.chainId,
        extensions: solToken?.extensions,
      });

    usdcToken &&
      availableToken.push({
        decimals: usdcToken.decimals,
        logoURI: usdcToken.logoURI,
        address: new PublicKey(usdcToken.address),
        name: usdcToken.name,
        symbol: usdcToken.symbol,
        tags: usdcToken?.tags,
        chainId: usdcToken?.chainId,
        extensions: usdcToken?.extensions,
      });

    unqToken &&
      availableToken.push({
        decimals: unqToken.decimals,
        logoURI: unqToken.logoURI,
        address: new PublicKey(unqToken.address),
        name: unqToken.name,
        symbol: unqToken.symbol,
        tags: unqToken?.tags,
        chainId: unqToken?.chainId,
        extensions: unqToken?.extensions,
      });

    usdtToken &&
      availableToken.push({
        decimals: usdtToken.decimals,
        logoURI: usdtToken.logoURI,
        address: new PublicKey(usdtToken.address),
        name: "Tether",
        symbol: usdtToken.symbol,
        tags: usdtToken?.tags,
        chainId: usdtToken?.chainId,
        extensions: usdtToken?.extensions,
      });
    setAvailableTokenList(availableToken);
    handleMintChange(availableToken[0])
  };

  useEffect(() => {
    void handleFilerCurrency();
  }, [name]);

  const handleFilerCurrency = async () => {
    toggleSearchLoading(true);
    if (name && name.length > 0) {
      const tokens = await new TokenListProvider().resolve();

      const filteredTokens = tokens
        .getList()
        .filter(
          (t) =>
            t.name.toLocaleLowerCase().startsWith(name.toLocaleLowerCase()) ||
            t.symbol.toLocaleLowerCase().startsWith(name.toLocaleLowerCase())
        );

      setAvailableTokenList(
        filteredTokens.map((t) => {
          return { ...t, address: new PublicKey(t.address) };
        })
      );
    } else {
      await getAllMintsInfo();
    }
    toggleSearchLoading(false);
  };

  const renderSelect = useMemo(() => {
    return (
      availableTokensList?.length && <div className="flex flex-col w-full gap-4">
        <Select
          className="border border-gray-700 rounded-lg shadow-lg px-2"
          placeholder="select token"
          isLoading={searchLoading}
          onInputChange={(e) => setSearchValue(e)}
          onChange={(e) => {
            console.log(e);
            handleMintChange(e!);
            clearErrors("selectedMint");
          }}
          defaultValue={availableTokensList[0]}
          styles={selectStyles}
          options={availableTokensList}
          getOptionLabel={(option: ITreasuryTokenAccInfo) => option.name}
          getOptionValue={(option: ITreasuryTokenAccInfo) => option.symbol}
          formatOptionLabel={(e: any) => (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: "0.5em",
                zIndex: 100,
                gap: "1em",
              }}
            >
              <img
                style={{ width: "1.5em", height: "1.5em" }}
                src={e.logoURI}
              />
              <Text as={"h3"} className="text-white">
                {e.name}
              </Text>
            </Box>
          )}
        />
        {errors.selectedMint?.message && (
          <p className="text-red-500">
            {errors.selectedMint.message as string}
          </p>
        )}
      </div>
    );
  }, [availableTokensList, searchLoading]);
  return (
    <div className="flex justify-evenly flex-col text-gray-400 gap-5 p-3 font-mono">
      <Box className="flex flex-row w-full justify-between items-center">
        <Box className="flex flex-col items-start text-start">
          <Text fontSize={2} color="white">
            Public mint
          </Text>
          <Text
            color="fg.subtle"
            fontSize={1}
            id="switchCaption"
            display="block"
            sx={{ width: "70%" }}
          >
            In case you want to enable minting nft by non-current holders
          </Text>
        </Box>
        <Box className="flex flex-col items-end">
          <ToggleSwitch
            aria-labelledby="switchLabel"
            size="small"
            aria-describedby="switchCaption"
            defaultChecked={true}
            onClick={(e) => {
              e.preventDefault();
            }}
            onChange={(e) => {
              setIsPublicMint(!isPublicMint);
            }}
          />
        </Box>
      </Box>
      {isPublicMint && (
        <div className="flex flex-col gap-5">
          <Box className="flex flex-row w-full justify-between items-center">
            <Box className="flex flex-col items-start text-start gap-5">
              <Text fontSize={2} color="white">
                Price & Currency
              </Text>
            </Box>
            <div className="flex flex-col w-1/2">
              <Box className="flex flex-row items-start text-start">
                <TextInput
                  {...register("price", {
                    min: {
                      value: 0,
                      message: "Minimum price is 0",
                    },
                    required: {
                      value: isPublicMint,
                      message: "Price can't be empty in public mint",
                    },
                  })}
                  type={"number"}
                  placeholder="price"
                  value={price}
                  accept="number"
                  onChange={(e) => {
                    setPrice && setPrice(+e.target.value);
                    e.target.value !== "" && clearErrors("price");
                  }}
                />
                {renderSelect}
              </Box>
              {errors.price && (
                <p className="text-red-500">{errors.price.message}</p>
              )}
            </div>
          </Box>
        </div>
      )}
      <Box className="flex flex-row w-full justify-between items-center">
        {isPublicMint && (
          <Box className="flex w-full flex-row items-center text-start gap-5">
            <div className="flex flex-col">
              <Text fontSize={2} color="white">
                Private mint duration
              </Text>
              <Text
                color="fg.subtle"
                fontSize={1}
                id="switchCaption"
                display="block"
              >
                Private mint is a period of time when holders can burn rugged
                nfts and get a new ones
              </Text>
            </div>
            <div className="flex flex-col items-start gap-4 w-1/2">
              <div className="flex justify-end items-center gap-3 w-full">
                <TextInput
                  {...register("privateMintEnd", {
                    required: {
                      value: isPublicMint,
                      message: "Private mint duration can't be empty",
                    },
                  })}
                  type={"number"}
                  placeholder="duration"
                  value={duration}
                  sx={{ width: "100%" }}
                  onChange={(e) => {
                    setDuration && setDuration(+e.target.value);
                    e.target.value !== "" && clearErrors("privateMintEnd");
                  }}
                />
                <Text fontSize={1} color="white">
                  hours
                </Text>
              </div>
              {errors.privateMintEnd && (
                <p className="text-red-500">{errors.privateMintEnd.message}</p>
              )}
            </div>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default MintDetails;
