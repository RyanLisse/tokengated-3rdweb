import tw from "tailwind-styled-components/dist/tailwind";
import { useAddress, useNetworkMismatch, useDisconnect, useMetamask, useEditionDrop, useNetwork, } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import ReactLoading from 'react-loading';

function truncateAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

const Minting = () => {
    const address = useAddress();
    const connectWithMetamask = useMetamask();
    const [totalSupply, setTotalSupply] = useState(0);
    const networkMismatched = useNetworkMismatch();
    const [, switchNetwork] = useNetwork(); // Sw
    const disconnectWallet = useDisconnect();
    const editionDrop = useEditionDrop("0x0649fdB91C7ff557EA7Ee4dd0C86Bcd65A610577");

    const [inProgress, setInProgress] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [checking, setChecking] = useState(true);
    const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const mint = async () => {
        if (editionDrop && address) {
            setInProgress(true);
            const tx = await editionDrop.claimTo(address, 0, 1);
            console.log(tx);
            setInProgress(false);
            setCompleted(true);
        }
    };
    const viewOpenSea = () => {
        const url = "https://testnets.opensea.io/assets/mumbai/0x0649fdb91c7ff557ea7ee4dd0c86bcd65a610577/0";
        window.open(url, "_blank");
    };
    const startOver = () => {
        setCompleted(false);
        setInProgress(false);
        disconnectWallet();
    };

    useEffect(() => {
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
    }, [address,
        connectWithMetamask,
        networkMismatched,
        editionDrop,
        switchNetwork,]);
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
            <div className="text-4xl font-black">
                <Tittle>
                    Welcome to <br />The LuffyDAO <br />
                </Tittle>
                <ButtonContainer>
                    <FilledButton onClick={connectWithMetamask}>
                        Connect Wallet</FilledButton></ButtonContainer>
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
                <h2>?????? Congratulations! ?????? <br />
                    Minted LuffyDAO O.G.PASS NFT! </h2>
                <FilledButton onClick={viewOpenSea}>
                    View Opensea
                </FilledButton>
            </div>
        );
    }


    return (
        <Container>
            <Mint>

                <TittleContainer> <div className="text-4xl font-black">
                    <Tittle>
                        Welcome to <br />The LuffyDAO <br />
                    </Tittle>

                </div>
                </TittleContainer>
                <ButtonContainer>

                    {address ? (
                        <> {
                            completed ? <FilledButton onClick={viewOpenSea}>
                                View Opensea
                            </FilledButton> : <FilledButton
                                disabled={inProgress}
                                onClick={mint}>
                                {
                                    inProgress ? <ReactLoading type="bubbles" color="#000" height={32} /> : "Mint"
                                }
                            </FilledButton>

                        }

                            <UnFilledButton
                                disabled={inProgress}
                                onClick={disconnectWallet}>Disconnect
                            </UnFilledButton>



                        </>
                    ) : (
                        <>

                            <FilledButton onClick={connectWithMetamask}>Connect Wallet</FilledButton>

                        </>
                    )}


                </ButtonContainer>

            </Mint>

        </Container>
    );
};

const Container = tw.div`
max-w-screen-lg
w-full
flex flex-col
justify-center
items-center

`;

const Mint = tw.div`
max-w-screen-sm
lg:max-w-min-content
md:w-1/2
bg-black
text-white
 flex 
 flex-col
 justify-center items-center
p-2



`;
const ButtonContainer = tw.div`
flex
flex-col
mt-4

w-full
border-b-2 border-indigo-50

`;
const FilledButton = tw.button`
 flex items-center justify-center flex-1 text-slate-50 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl
 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400
 font-extrabold uppercase rounded-lg text-xl px-5 py-2.5 text-center mr-2 mb-6 mt-8 h-14
`;
const UnFilledButton = tw.button`
bg-black py-2.5 
 flex items-center justify-center
flex-1 
text-yellow-200
 transition-all ease-in duration-75 dark:bg-black group-hover:bg-opacity-0
rounded-lg text-xl px-5 text-center mb-6 h-14
font-extrabold
uppercase 
hover:bg-yellow-300 hover:text-black
`;
const TittleContainer = tw.div`
    flex
   
`;
const Tittle = tw.h2`
    uppercase
    text-6xl
    font-black
    tracking-wide
    italic
    mt-3
   
`;
export default Minting;