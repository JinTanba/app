// viemClient.ts

import { createPublicClient, createWalletClient, http } from 'viem'
import { mainnet } from 'viem/chains' // If Base Mainnet is not yet in viem, define a custom chain below
import { privateKeyToAccount } from 'viem/accounts'

// If viem doesn't have Base Mainnet by default, you can define your own chain:
import { defineChain } from 'viem'

export const baseMainnet = defineChain({
  id: 8453,
  name: 'Base Mainnet',
  network: 'base',
  nativeCurrency: { name: 'Base Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://base-mainnet.g.alchemy.com/v2/k3Dvibh6qSOCk1KkssKyZub9r6AuK1qy']
    },
  },
  blockExplorers: {
    default: { name: 'basescan', url: 'https://basescan.org' },
  },
})

// Replace with your actual private key
const DEPLOYER_KEY = '0x68bf6ec02461aecaa2d401ff255a39dc1f97a23f4755837b0a06391513101846'

// Create an Account object from private key
const account = privateKeyToAccount(DEPLOYER_KEY)

// Public client for read calls
export const publicClient = createPublicClient({
  chain: baseMainnet, // or mainnet if you prefer to test
  transport: http(),
})

// Wallet client for write calls
export const walletClient = createWalletClient({
  chain: baseMainnet,
  transport: http(),
  account,
})
