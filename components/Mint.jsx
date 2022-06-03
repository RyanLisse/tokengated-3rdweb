import {
    useAddress,
    useMetamask,
    useNetworkMismatch,
    ChainId,
    useNetwork,
    useEditionDrop,
} from "@thirdweb-dev/react";

import { useState, useEffect } from "react";

import tw from "tailwind-styled-components";
// truncates the address so it displays in a nice format
function truncateAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function App() {
    // allow user to connect to app with metamask, and obtain address
    const address = useAddress();
    const connectWithMetamask = useMetamask();
    const networkMismatched = useNetworkMismatch();
    const [, switchNetwork] = useNetwork(); // Switch network

    // Replace this address with your NFT Drop address!
    const editionDrop = useEditionDrop(
        "0x0649fdB91C7ff557EA7Ee4dd0C86Bcd65A610577"
    );
    const [checking, setChecking] = useState(true);
    const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);

    useEffect(() => {
        // If they don't have an connected wallet, return
        if (!address) {
            return;
        }

        const checkBalance = async () => {
            try {
                const nfts = await editionDrop?.getOwned(address);
                setHasClaimedNFT(nfts?.length > 0);
                setChecking(false);
                setIsClaiming(false);
            } catch (error) {
                setHasClaimedNFT(false);
                setChecking(false);
                console.error("Failed to get NFTs", error);
            }
        };
        checkBalance();
    }, [
        address,
        connectWithMetamask,
        networkMismatched,
        editionDrop,
        switchNetwork,
    ]);

    const mintNft = async () => {
        try {
            // If they don't have an connected wallet, ask them to connect!
            if (!address) {
                connectWithMetamask();
                return;
            }

            // Ensure they're on the right network (mumbai)
            if (networkMismatched) {
                switchNetwork(ChainId.Mumbai);
                return;
            }

            setIsClaiming(true);
            await editionDrop.claim(0, 1);
            setHasClaimedNFT(true);
        } catch (error) {
            setHasClaimedNFT(false);
            console.error("Failed to mint NFT", error);
        } finally {
            setIsClaiming(false);
        }
    };

    //if there isn't a wallet connected, display our connect MetaMask button
    if (!address) {
        return (
            <div className="text-3xl font-black">
                <h1>Welcome to the LuffyDAO </h1>
                <ButtonContainer onClick={connectWithMetamask}>
                    Connect MetaMask
                </ButtonContainer>
            </div>
        );
    }

    if (checking) {
        return (
            <div className="container">
                <h1>Checking your wallet...</h1>
            </div>
        );
    }

    // if the user is connected and has an NFT from the drop, display text
    if (hasClaimedNFT) {
        return (
            <div>
                <h2>☠️ Congratulations! ☠️ <br />
                    Minted LuffyDAO O.G.PASS NFT! </h2>
            </div>
        );
    }

    // if there are no NFTs from collection in wallet, display button to mint
    return (
        <div className="flex flex-col items-center justify-center">

            <p className="text-3xl font-black">
                ☠️  There are no LuffyDAO O.G.PASS NFTs held by:{" "}
                <span className="value">{truncateAddress(address)} ☠️</span>
            </p>
            <ButtonContainer disabled={isClaiming} onClick={mintNft}>
                {isClaiming ? "Claiming..." : "Mint NFT"}
            </ButtonContainer>
        </div>
    );
}
const ButtonContainer = tw.div`
 flex-col w-1/3 mt-4 justify centertext-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-bold rounded-lg text-2xl px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2`;
