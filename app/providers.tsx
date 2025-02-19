'use client';

import {PrivyProvider} from '@privy-io/react-auth';
import {base,baseSepolia} from "viem/chains"
export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId="cm7ca38hj01dgca01no5r391u"
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/16620/production/_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg',
        },
        supportedChains: [base,baseSepolia],
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}