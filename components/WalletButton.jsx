import React from 'react';
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react';
import tw from 'tailwind-styled-components';
function WalletButton() {
    const address = useAddress();
    const connectWithMetamask = useMetamask();
    const disconnectWallet = useDisconnect();
    return (
        <div>
            {address ? (
                <>
                    <ButtonContainer type="button" onClick={disconnectWallet}> Disconnect Wallet</ButtonContainer>
                    <p>Your address: {address}</p>
                </>
            ) : (
                <ButtonContainer type="button" onClick={connectWithMetamask}>Connect with Metamask</ButtonContainer>
            )}
        </div>
    );
}

const ButtonContainer = tw.div`
text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-bold rounded-lg text-2xl px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2`;

export default WalletButton;