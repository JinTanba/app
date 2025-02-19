"use client";

import React, { useEffect, useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { createPublicClient, http, parseAbi, formatUnits } from "viem";
import { baseSepolia } from "viem/chains";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

// -------------------------------------------------------------------
// 1) ENV: The test USDC address from your .env file
// -------------------------------------------------------------------
const TEST_USDC_ADDRESS = process.env.NEXT_PUBLIC_TEST_USDC as `0x${string}`;
if (!TEST_USDC_ADDRESS) {
  throw new Error("Missing NEXT_PUBLIC_TEST_USDC in .env (e.g. 0xaE46...)");
}

// -------------------------------------------------------------------
// 2) Minimal ERC20 ABI for reading balanceOf & decimals
// -------------------------------------------------------------------
const ERC20_ABI = parseAbi([
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function approve(address spender, uint256 amount) returns (bool)"
]);

// -------------------------------------------------------------------
// 3) Create a Viem public client for reading data (baseSepolia or any chain)
// -------------------------------------------------------------------
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// -------------------------------------------------------------------
// 4) Utility Functions (taken from your snippet)
// -------------------------------------------------------------------
function formatLargeNumber(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toFixed(2);
}

function calculateFinalBalance(
  currentFunding: string,
  interestRate: string
): { finalBalance: string; increase: string } {
  const fundingAmount = Number.parseFloat(currentFunding.replace(/[^0-9.-]+/g, ""));
  const rate = Number.parseFloat(interestRate.replace("%", "")) / 100;
  const increase = fundingAmount * rate;
  const finalBalance = fundingAmount + increase;
  return {
    finalBalance: "$" + formatLargeNumber(finalBalance),
    increase: "+$" + formatLargeNumber(increase),
  };
}

// -------------------------------------------------------------------
// 5) CompanyData props & component
// -------------------------------------------------------------------
interface CompanyDataProps {
  name: string;
  totalFunding: string;
  currentFunding: string;
  interestRate: string;
  logo: string;
}

/**
 * CompanyData:
 *  - Renders your "details" UI
 *  - Also references the user's USDC on-chain balance
 */
export const CompanyData: React.FC<CompanyDataProps> = ({
  name,
  totalFunding,
  currentFunding,
  interestRate,
  logo,
}) => {
  // A) from your snippet: finalBalance & increase
  const { finalBalance, increase } = calculateFinalBalance(currentFunding, interestRate);

  // B) from useWallets: get the 0th wallet, then read test USDC balance
  const { wallets } = useWallets();
  const [usdcBalance, setUsdcBalance] = useState<string>("...");

  useEffect(() => {
    if (!wallets || wallets.length === 0) return;
    const mainWallet = wallets[0]; // The user's primary EVM wallet

    async function fetchUsdcBalance() {
      try {
        // 1) get addresses from the wallet
        const addresses = wallets
        if (addresses.length === 0) return;

        const userAddress = addresses[0].address as `0x${string}`;

        // 2) read decimals
        const decimals = (await publicClient.readContract({
          address: TEST_USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: "decimals",
        })) as number;

        // 3) read balance
        const rawBalance = (await publicClient.readContract({
          address: TEST_USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [userAddress],
        })) as bigint;

        // 4) format it
        const formatted = formatUnits(rawBalance, decimals);
        setUsdcBalance(formatted);
      } catch (error) {
        console.error("Error reading USDC balance:", error);
      }
    }

    fetchUsdcBalance();
  }, [wallets]);

  return (
    <div className="w-full mt-8 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-4xl font-normal text-white flex items-center gap-3 font-serif">
          <Image
            src={logo || "/placeholder.svg"}
            alt={name}
            width={48}
            height={48}
            className="rounded-full"
          />
          {name}
          <span className="px-2 py-1 text-sm bg-[#6366F1]/20 text-[#A5B4FC] rounded-md">
            Details
          </span>
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </h1>
      </div>

      {/* Display user's test USDC balance */}
      <div className="text-white mb-4">
        <strong>Your Test USDC Balance:</strong> {usdcBalance} USDC
      </div>

      <div className="flex justify-between items-end">
        <div className="flex gap-16">
          <div>
            <h2 className="text-gray-400 text-sm mb-1">Total Funding Target</h2>
            <div className="text-3xl font-light text-white mb-1">{totalFunding}</div>
          </div>
          <div>
            <h2 className="text-gray-400 text-sm mb-1">Current Funding</h2>
            <div className="text-3xl font-light text-white mb-1">{currentFunding}</div>
          </div>
          <div>
            <h2 className="text-gray-400 text-sm mb-1">Interest Rate</h2>
            <div className="text-3xl font-light text-white mb-1">{interestRate}</div>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-gray-400 text-sm mb-1">Estimated Final Balance</h2>
          <div className="flex items-center justify-end">
            <div className="text-3xl font-light text-white mr-2">
              {finalBalance}
            </div>
            <div className="text-3xl font-light text-green-400">
              ({increase})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// 6) A page component that uses CompanyData
//     You can rename or move this as you see fit
// -------------------------------------------------------------------
export default function CompanyPage() {
  return (
    <main className="p-8">
      <CompanyData
        name="My Company"
        logo="https://placekitten.com/200/200"
        totalFunding="$500K"
        currentFunding="$320K"
        interestRate="5%"
      />
    </main>
  );
}
