"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { parseUnits } from "viem"
import { useWallets } from "@privy-io/react-auth"

// Import your existing investERC20 function
import { investERC20 } from "@/lib/assetfyMarketClient"

// Reusable UI components
import { VideoPlayer } from "./VideoPlayer"
import { OrderBook } from "./OrderBook"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ArrowDownIcon, Loader2, ChevronDown, ExternalLink } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AIModalSkeletonLoader } from "./skeleton-loader"

const RLUSD_ADDRESS = process.env.NEXT_PUBLIC_TEST_USDC as `0x${string}`
const VETH_ADDRESS = process.env.NEXT_PUBLIC_TEST_TOKEN as `0x${string}`

/** Define your component props */
interface CompanyContainerProps {
  name: string
  videoUrl: string
  logo: string
  interestRate: string
  maturityDate: string
  currentFunding: string
  targetFunding: string
  tokenName: string
  description?: string
  projectId: bigint
}

/**
 * CompanyContainer component:
 *   Renders your UI and calls investERC20 from the library.
 */
export function CompanyContainer({
  name,
  videoUrl,
  logo,
  interestRate,
  maturityDate,
  currentFunding,
  targetFunding,
  tokenName,
  description,
  projectId,
}: CompanyContainerProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [usdcAmount, setUsdcAmount] = useState("100")
  const [acquiredTokens, setAcquiredTokens] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // New states for showing the transaction hash link after 3 seconds
  const [txHash, setTxHash] = useState<string | null>(null)
  const [showTxLoader, setShowTxLoader] = useState(false)

  const [selectedAsset, setSelectedAsset] = useState("USDC")
  const { wallets } = useWallets()

  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [aiResponse, setAiResponse] = useState<any>(null)
  const [isAILoading, setIsAILoading] = useState(false)

  const [isWalletConnected, setIsWalletConnected] = useState(false)

  const TOKEN_CONFIG: Record<string, { address: `0x${string}`; decimals: number }> = {
    USDC: {
      address: VETH_ADDRESS,
      decimals: 18,
    },
    RLUSD: {
      address: RLUSD_ADDRESS,
      decimals: 18,
    },
    vETH: {
      address: VETH_ADDRESS,
      decimals: 18,
    },
  }

  const handleUsdcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsdcAmount(e.target.value)
  }

  /** Invest button handler */
  const handleInvest = async () => {
    if (!wallets || wallets.length === 0) {
      alert("Please connect your wallet first!")
      return
    }

    setIsLoading(true)
    setAcquiredTokens(null)
    setShowCelebration(false)

    // Clear old txHash info
    setTxHash(null)
    setShowTxLoader(false)

    try {
      // 1) Identify which ERC20 token to use
      const config = TOKEN_CONFIG[selectedAsset]
      if (!config) throw new Error(`Unknown token: ${selectedAsset}`)

      // 2) Convert user input to base units as a bigint
      const amountBN = parseUnits(usdcAmount, config.decimals)

      // 3) Call the on-chain function
      const hash = await investERC20(wallets[0], projectId, config.address, amountBN)
      console.log("Invest transaction hash:", hash)

      // 4) Show success message
      setAcquiredTokens(usdcAmount)
      setShowCelebration(true)

      // 5) Simulate a 3-second loader before showing the explorer link
      setShowTxLoader(true)
      setTimeout(() => {
        setShowTxLoader(false)
        setTxHash(hash) // We set the actual hash here, to reveal the link
      }, 3000)
    } catch (err) {
      console.error("Error while investing:", err)
      alert(`An error occurred while investing: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAIRequest = async () => {
    setIsAILoading(true)
    setIsAIModalOpen(true)
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: name,
          description: description,
          useOpenAIImage: false, // Disable image generation
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch AI insights")
      }

      const data = await response.json()
      setAiResponse(data)
    } catch (error) {
      console.error("Error fetching AI insights:", error)
      // Handle error appropriately
    } finally {
      setIsAILoading(false)
    }
  }

  /** Hide the success message after a few seconds */
  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  useEffect(() => {
    setIsWalletConnected(wallets && wallets.length > 0)
  }, [wallets])

  return (
    <div className="w-full max-w-[1400px] mx-auto bg-black/40 backdrop-blur-2xl rounded-[20px] shadow-lg border border-white/10 p-10">
      <div className="flex items-center gap-4 mb-6">
        <Image src={logo || "/placeholder.svg"} alt={name} width={64} height={64} className="rounded-full" />
        <h2 className="text-2xl font-serif text-white">{name}</h2>
      </div>

      <div className="flex gap-6 border-b border-gray-800 mb-6">
        {["Details", "Trade"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`pb-3 px-1 text-sm text-gray-400 hover:text-gray-200 transition-colors relative ${
              activeTab === tab.toLowerCase()
                ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#4FD1C5]"
                : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "details" && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Video + Info */}
            <div className="w-full lg:w-2/3 space-y-6">
              <VideoPlayer url={videoUrl} />
              <div
                className="mt-6 h-[200px] overflow-y-auto pr-4"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#4FD1C5 #1E1E1E" }}
              >
                <h4 className="text-xl font-medium text-white mb-2">About {name}</h4>
                <p className="text-gray-300 text-sm font-light leading-relaxed">
                  {description || "No description available."}
                </p>
              </div>
              <Button
                onClick={handleAIRequest}
                disabled={isAILoading}
                className="w-full bg-gradient-to-r from-[#4FD1C5] to-[#63B3ED] hover:from-[#4FD1C5]/80 hover:to-[#63B3ED]/80 text-black text-lg py-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                {isAILoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Generate AI Analysis"}
              </Button>
            </div>

            {/* Right: Invest Section */}
            <div className="w-full lg:w-1/3 bg-black/20 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Invest {selectedAsset} for {tokenName}
              </h3>
              <div className="space-y-4">
                <div className="bg-black/40 p-4 rounded-xl border border-gray-700">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">You pay</span>
                    <span className="text-sm text-gray-400">Balance: 100 {selectedAsset}</span>
                  </div>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={usdcAmount}
                      onChange={handleUsdcChange}
                      className="w-full bg-transparent border-none text-white text-2xl placeholder-gray-500 focus:ring-0 focus:outline-none"
                    />
                    <div className="flex items-center gap-2 ml-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-2xl hover:bg-black/60 border border-white/10 text-white"
                          >
                            <Image
                              src={
                                selectedAsset === "USDC"
                                  ? "https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694"
                                  : selectedAsset === "RLUSD"
                                    ? "https://coin-images.coingecko.com/coins/images/39651/large/RLUSD_200x200_%281%29.png?1727376633"
                                    : "https://assets.coingecko.com/coins/images/29683/large/vETH_200.png?1696528617"
                              }
                              alt={selectedAsset}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            {selectedAsset}
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-[140px] bg-black/90 border border-white/10 text-white">
                          <DropdownMenuItem
                            onClick={() => setSelectedAsset("USDC")}
                            className="hover:bg-white/10 flex items-center gap-2 text-white"
                          >
                            <Image
                              src="https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694"
                              alt="USDC"
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            USDC
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedAsset("RLUSD")}
                            className="hover:bg-white/10 flex items-center gap-2 text-white"
                          >
                            <Image
                              src="https://coin-images.coingecko.com/coins/images/39651/large/RLUSD_200x200_%281%29.png?1727376633"
                              alt="RLUSD"
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            RLUSD
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedAsset("vETH")}
                            className="hover:bg-white/10 flex items-center gap-2 text-white"
                          >
                            <Image
                              src="https://assets.coingecko.com/coins/images/29683/large/vETH_200.png?1696528617"
                              alt="vETH"
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            vETH
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowDownIcon className="text-[#4FD1C5] w-6 h-6" />
                </div>

                <div className="bg-black/40 p-4 rounded-xl border border-gray-700">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">You will receive (Estimated)</span>
                    <span className="text-sm text-gray-400">Balance: 0 {tokenName}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full text-[#4FD1C5] text-2xl font-semibold">{usdcAmount}</div>
                    <div className="flex items-center gap-2 ml-2">
                      <Image
                        src={logo || "/placeholder.svg"}
                        alt={tokenName}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="text-white font-semibold">{tokenName}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleInvest}
                  disabled={isLoading || !wallets || wallets.length === 0}
                  className="w-full bg-gradient-to-r from-[#4FD1C5] to-[#63B3ED] hover:from-[#4FD1C5]/80 hover:to-[#63B3ED]/80 text-black text-lg py-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : wallets && wallets.length > 0 ? (
                    "Invest"
                  ) : (
                    "Connect Wallet to Invest"
                  )}
                </Button>

                {acquiredTokens && (
                  <div className={`mt-4 text-center ${showCelebration ? "animate-bounce" : ""}`}>
                    <p className="text-[#4FD1C5] font-semibold">
                      🎉 Congratulations! You have acquired {acquiredTokens} {tokenName} tokens! 🎉
                    </p>
                  </div>
                )}

                {/* Section to show transaction link after 3 seconds */}
                {showTxLoader && <div className="mt-4 text-center text-gray-300">Loading transaction details...</div>}
                {txHash && !showTxLoader && (
                  <div className="mt-4 text-center">
                    <a
                      href={`https://sepolia.basescan.org/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4FD1C5] underline"
                    >
                      View your transaction on Base-Sepolia Explorer
                    </a>
                  </div>
                )}

                <div className="mt-4 space-y-2 text-sm text-gray-400">
                  <p>
                    1 {tokenName} = 1 {selectedAsset}
                  </p>
                  <p>Interest Rate: {interestRate}</p>
                  <p>Maturity Date: {maturityDate}</p>
                  <p>Current Funding: {currentFunding}</p>
                  <p>Target Funding: {targetFunding}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "trade" && <OrderBook />}
      </div>
      {/* AI Response Modal */}
      <Dialog open={isAIModalOpen} onOpenChange={setIsAIModalOpen}>
        <DialogContent className="bg-black/90 border border-white/10 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold mb-4">AI Insights</DialogTitle>
          </DialogHeader>
          {isAILoading ? (
            <AIModalSkeletonLoader />
          ) : aiResponse ? (
            <div className="space-y-6">
              <div className="prose prose-invert">
                <h3 className="text-xl font-semibold mb-2">Summary</h3>
                <p className="text-gray-300 text-base leading-relaxed">{aiResponse.content}</p>
              </div>
              {aiResponse.articles && aiResponse.articles.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Related Articles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {aiResponse.articles.map((article: any, index: number) => (
                      <a
                        key={index}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black/40 border border-white/10 rounded-lg p-4 hover:bg-black/60 transition-colors flex flex-col h-full"
                      >
                        {article.image && (
                          <Image
                            src={article.image || "/placeholder.svg"}
                            alt={article.title}
                            width={300}
                            height={200}
                            className="rounded-md mb-3 object-cover w-full h-32"
                          />
                        )}
                        <h4 className="text-[#4FD1C5] text-lg font-medium mb-2 line-clamp-2">{article.title}</h4>
                        <p className="text-gray-300 text-sm mb-2 flex-grow line-clamp-3">{article.description}</p>
                        <div className="flex items-center text-xs text-gray-400 mt-auto">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {new URL(article.url).hostname}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-300">No AI response available.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CompanyContainer

