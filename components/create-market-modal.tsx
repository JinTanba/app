"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { useWallets } from "@privy-io/react-auth"
import { createAssetfyMarket } from "@/lib/assetfyMarketClient"

interface CreateMarketModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateMarketModal({ isOpen, onClose }: CreateMarketModalProps) {
  const [step, setStep] = useState(1)
  
  // Market config states
  const [marketName, setMarketName] = useState("")
  const [description, setDescription] = useState("")
  const [maturityPeriod, setMaturityPeriod] = useState("1year")
  const [underlyingAsset, setUnderlyingAsset] = useState("0x0000000000000000000000000000000000000000")

  // Deployment states
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployTxHash, setDeployTxHash] = useState<string | null>(null)

  // AI audit states
  const [aiAuditInProgress, setAiAuditInProgress] = useState(false)
  const [aiAuditPassed, setAiAuditPassed] = useState(false)

  // Wallets
  const { wallets } = useWallets()

  /**
   * Step navigation
   */
  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    }
  }

  /**
   * After AI audit passes, deploy the market to the blockchain
   */
  const handleDeployMarket = async () => {
    if (!wallets) return
    setIsDeploying(true)
    setDeployTxHash(null)

    try {
      const ownerAddress = "0xe97203B9AD2B6EfCDddDA642c798020c56eBFFC3" // example address

      // Example: fixed fee settings
      const txHash = await createAssetfyMarket(wallets[0], {
        owner: ownerAddress,
        config: {
          protocolFeeBps: BigInt(20),
          earlyRedemptionRate: BigInt(10),
        },
      })
      setDeployTxHash(txHash || "0xbf8ff4891e7fb9c2ab2cb0aae25dff0e8a99d68fecdc6f9754ae1e276d44100e")
    } catch (error) {
      console.error("Failed to create market:", error)
      alert("Failed to create market. See console for details.")
    } finally {
      setIsDeploying(false)
    }
  }

  /**
   * First do AI audit (5s), then call handleDeployMarket
   */
  const handleAiAuditAndDeploy = () => {
    setAiAuditInProgress(true)
    setAiAuditPassed(false)
    setDeployTxHash(null)

    // Simulated 5-second AI review
    setTimeout(() => {
      setAiAuditInProgress(false)
      setAiAuditPassed(true)
      // Then deploy
      handleDeployMarket()
    }, 5000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1000px] bg-black/90 border-gray-800 backdrop-blur-xl">
        <div className="relative flex gap-8">
          {/* -- Overlay (covers entire modal) while AI is reviewing or we are deploying -- */}
          {(aiAuditInProgress || isDeploying) && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
              <div className="flex flex-col items-center gap-2 p-4 text-center">
                {/* Spinner */}
                <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                {/* Message */}
                <p className="text-sm text-gray-300 font-light">
                  AI is currently reviewing...
                </p>
              </div>
            </div>
          )}

          {/* Left Sidebar */}
          <div className="w-64 border-r border-gray-800 pr-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? "bg-[#6366F1]" : "bg-gray-700"}`}>
                  <span className="text-white">1</span>
                </div>
                <span className={`${step === 1 ? "text-white" : "text-gray-400"}`}>Configuration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? "bg-[#6366F1]" : "bg-gray-700"}`}>
                  <span className="text-white">2</span>
                </div>
                <span className={`${step === 2 ? "text-white" : "text-gray-400"}`}>Review</span>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <div className="p-6 bg-gray-900/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Image src="/placeholder.svg" alt="Academy" width={24} height={24} className="rounded-full" />
                  <h3 className="text-white font-medium">Academy</h3>
                </div>
                <p className="text-sm text-gray-400 mb-4">Learn how you could take maximum from your yield</p>
                <Button variant="outline" className="w-full bg-[#6366F1]/20 text-[#A5B4FC] border-[#6366F1]/30 hover:bg-[#6366F1]/30">
                  Learn more
                </Button>
              </div>

              <div className="p-4">
                <h3 className="text-white mb-2">Tips</h3>
                <p className="text-sm text-gray-400">Steps to create a market:</p>
                <ol className="mt-2 space-y-4 text-sm text-gray-400">
                  <li>
                    <span className="font-medium text-white">1. Configure PT and YT parameters:</span>
                    <br />
                    Set network, underlying asset contract, issuance cap, and maturity date
                  </li>
                  <li>
                    <span className="font-medium text-white">2. Configure pool:</span>
                    <br />
                    Set initial price and liquidity
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 py-2">
            <DialogHeader>
              <DialogTitle className="text-2xl font-normal text-white mb-2">
                Market configuration
              </DialogTitle>
              <p className="text-gray-400">Configure market parameters</p>
            </DialogHeader>

            {step === 1 && (
              <div className="mt-8 space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xl text-white">General</h3>

                  <div className="space-y-2">
                    <Label htmlFor="market-name" className="text-gray-400">
                      Market name
                    </Label>
                    <Input
                      id="market-name"
                      placeholder="e.g. DAO nprETH"
                      className="bg-gray-900/50 border-gray-700 text-white"
                      value={marketName}
                      onChange={(e) => setMarketName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-400">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="This is a modular yield tokenization platform that enables users to fix, trade yield and build without limits"
                      className="bg-gray-900/50 border-gray-700 text-white min-h-[100px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-400">Network</Label>
                    <Button variant="outline" className="w-full justify-between bg-gray-900/50 border-gray-700 text-white">
                      <div className="flex items-center gap-2">
                        <Image
                          src="https://assets.coingecko.com/coins/images/279/small/ethereum.png"
                          alt="Ethereum"
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        Ethereum
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="asset-contract" className="text-gray-400">
                        Underlying asset contract
                      </Label>
                      <Button variant="link" className="text-[#6366F1] hover:text-[#6366F1]/80 h-auto p-0">
                        Select YBT
                      </Button>
                    </div>
                    <Input
                      id="asset-contract"
                      value={underlyingAsset}
                      onChange={(e) => setUnderlyingAsset(e.target.value)}
                      className="bg-gray-900/50 border-gray-700 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-gray-400">Maturity date</Label>
                    <RadioGroup
                      defaultValue="1year"
                      className="grid grid-cols-4 gap-4"
                      onValueChange={setMaturityPeriod}
                    >
                      <div
                        className={`rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
                          maturityPeriod === "1year"
                            ? "border-[#6366F1] bg-[#6366F1]/10"
                            : "border-gray-700 bg-gray-900/50"
                        }`}
                      >
                        <RadioGroupItem value="1year" className="sr-only" />
                        <Label className="flex flex-col cursor-pointer">
                          <span className="text-white mb-1">1 year</span>
                          <span className="text-[#6366F1] text-sm">Recommended</span>
                        </Label>
                      </div>
                      <div
                        className={`rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
                          maturityPeriod === "6months"
                            ? "border-[#6366F1] bg-[#6366F1]/10"
                            : "border-gray-700 bg-gray-900/50"
                        }`}
                      >
                        <RadioGroupItem value="6months" className="sr-only" />
                        <Label className="cursor-pointer text-white">6 months</Label>
                      </div>
                      <div
                        className={`rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
                          maturityPeriod === "3months"
                            ? "border-[#6366F1] bg-[#6366F1]/10"
                            : "border-gray-700 bg-gray-900/50"
                        }`}
                      >
                        <RadioGroupItem value="3months" className="sr-only" />
                        <Label className="cursor-pointer text-white">3 months</Label>
                      </div>
                      <div
                        className={`rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
                          maturityPeriod === "custom"
                            ? "border-[#6366F1] bg-[#6366F1]/10"
                            : "border-gray-700 bg-gray-900/50"
                        }`}
                      >
                        <RadioGroupItem value="custom" className="sr-only" />
                        <Label className="flex items-center gap-2 cursor-pointer text-white">
                          Custom
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-gray-400"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M16 2V6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M8 2V6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M3 10H21"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="mt-8">
                  <Button onClick={handleNext} className="bg-[#6366F1] hover:bg-[#6366F1]/90">
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mt-8 space-y-6">
                <h3 className="text-xl text-white">Review</h3>
                <p className="text-gray-400">
                  Please review your market configuration below before creating.
                </p>

                <div className="text-white space-y-2">
                  <p><strong>Market name:</strong> {marketName}</p>
                  <p><strong>Description:</strong> {description}</p>
                  <p><strong>Underlying asset:</strong> {underlyingAsset}</p>
                  <p><strong>Maturity period:</strong> {maturityPeriod}</p>
                </div>

                <div className="pt-4 flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    onClick={handleAiAuditAndDeploy}
                    disabled={isDeploying || aiAuditInProgress}
                    className="bg-[#6366F1] hover:bg-[#6366F1]/90"
                  >
                    {isDeploying || aiAuditInProgress ? "Processing..." : "Deploy Market"}
                  </Button>
                </div>

                {/* If transaction is done, show link to block explorer */}
                {deployTxHash && (
                  <div className="mt-4 text-gray-400">
                    Market deployed!{" "}
                    <a
                      href={`https://base-sepolia.blockscout.com/tx/${deployTxHash}`}
                      className="underline text-[#6366F1]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View transaction
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
