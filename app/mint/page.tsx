import React, { useEffect, useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { createPublicClient, http, parseAbi, formatUnits } from "viem";
import { baseSepolia } from "viem/chains";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Layout from "@/components/Layout"
import { CompanyData } from "@/components/CompanyData"
import CompanyContainer from "@/components/CompanyContainer"
import { useRouter } from "next/navigation"
import Providers from "@/app/providers"

// -------------------------------------------------------------------
// 1) ENV: The test USDC address from your .env file
// -------------------------------------------------------------------
const TEST_USDC_ADDRESS = process.env.NEXT_PUBLIC_TEST_USDC as `0x${string}`;
if (!TEST_USDC_ADDRESS) {
  throw new Error("Missing NEXT_PUBLIC_TEST_USDC in .env (e.g. 0xaE46...)");
}
const TEST_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TEST_TOKEN;

// -------------------------------------------------------------------
// 2) Minimal ERC20 ABI for reading balanceOf & decimals
// -------------------------------------------------------------------
const ERC20_ABI = parseAbi([
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function approve(address spender, uint256 amount) returns (bool)"
]);
