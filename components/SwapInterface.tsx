"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface Token {
  symbol: string
  name: string
  logo: string
  balance: string
}

const tokens: Token[] = [
  {
    symbol: "RLUSD",
    name: "Renatus USD",
    logo: "https://coin-images.coingecko.com/coins/images/39651/large/RLUSD_200x200_%281%29.png?1727376633",
    balance: "1,000.00",
  },
  {
    symbol: "vETH",
    name: "Vault ETH",
    logo: "https://assets.coingecko.com/coins/images/29683/large/vETH_200.png?1696528617",
    balance: "10.00",
  },
]

export default function SwapInterface() {
  const [sellAmount, setSellAmount] = useState("")
  const [buyAmount, setBuyAmount] = useState("")
  const [selectedSellToken, setSelectedSellToken] = useState(tokens[0])
  const [selectedBuyToken, setSelectedBuyToken] = useState(tokens[1])

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="rounded-3xl bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-xl shadow-2xl border border-white/5">
        {/* Sell Section */}
        <div className="p-6 pb-2">
          <div className="text-gray-400 text-lg mb-4">Sell</div>
          <div className="relative">
            <Input
              type="text"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              className="w-full text-5xl font-light bg-transparent border-none text-white placeholder-gray-600 focus:outline-none focus:ring-0 p-0"
              placeholder="0"
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button
                variant="ghost"
                className="h-8 px-3 text-sm text-[#4FD1C5] hover:text-[#4FD1C5]/80 hover:bg-[#4FD1C5]/10"
              >
                Max
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/10"
              >
                <Image
                  src={selectedSellToken.logo || "/placeholder.svg"}
                  alt={selectedSellToken.symbol}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
                <span className="text-white font-medium">{selectedSellToken.symbol}</span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </Button>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500">$0</span>
              <span className="text-gray-500">
                Balance: {selectedSellToken.balance} {selectedSellToken.symbol}
              </span>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-3 relative z-10">
          <Button
            variant="ghost"
            className="rounded-xl bg-black/60 border-4 border-black p-2 hover:bg-black/40 transition-all duration-200 hover:scale-110"
            onClick={() => {
              setSelectedSellToken(selectedBuyToken)
              setSelectedBuyToken(selectedSellToken)
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#4FD1C5]"
            >
              <path
                d="M12 4L12 20M12 20L18 14M12 20L6 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>

        {/* Buy Section */}
        <div className="p-6 pt-2">
          <div className="text-gray-400 text-lg mb-4">Buy</div>
          <div className="relative">
            <Input
              type="text"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              className="w-full text-5xl font-light bg-transparent border-none text-white placeholder-gray-600 focus:outline-none focus:ring-0 p-0"
              placeholder="0"
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/10"
              >
                <Image
                  src={selectedBuyToken.logo || "/placeholder.svg"}
                  alt={selectedBuyToken.symbol}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
                <span className="text-white font-medium">{selectedBuyToken.symbol}</span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </Button>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500">$0</span>
              <span className="text-gray-500">
                Balance: {selectedBuyToken.balance} {selectedBuyToken.symbol}
              </span>
            </div>
          </div>
        </div>

        {/* Enter Amount Button */}
        <div className="p-4">
          <Button
            disabled={!sellAmount}
            className="w-full py-6 text-lg bg-gradient-to-r from-[#4FD1C5] to-[#63B3ED] text-black font-medium
              hover:from-[#4FD1C5]/90 hover:to-[#63B3ED]/90 
              disabled:from-gray-800/50 disabled:to-gray-800/50 disabled:text-gray-400
              rounded-2xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            {!sellAmount ? "Enter an amount" : "Swap"}
          </Button>
        </div>
      </div>
    </div>
  )
}

