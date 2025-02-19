"use client"

import type React from "react"
import { CardContent, CardHeader } from "./ui/card"
import TabNav from "./TabNav"
import { useState } from "react"
import Image from "next/image"
// import { Button } from "./ui/button" // Buttonコンポーネントを使わないならコメントアウトしてください

interface Asset {
  id: number
  name: string
  icon: string
  amount: number
}

const AssetsArea: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 1,
      name: "Renatus Robotics",
      icon: "https://www.renatus-robotics.com/jp/wp-content/uploads/2022/11/renatus_logo_1120.png",
      amount: 100,
    },
    {
      id: 2,
      name: "Industry Alpha",
      icon: "https://www.industryalpha.net/wp-content/uploads/2023/07/Industry-Alpha%E9%BB%92%E3%83%AD%E3%82%B4.png",
      amount: 50,
    },
    {
      id: 3,
      name: "SCOOP.fun",
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Palantir%20Logo%20Vector-2Xnf1QwhJUGIIVDfB2HY0iqJMuTJqz.png",
      amount: 75,
    },
  ])

  switch (activeTab) {
    case "Assets":
      return (
        <div className="space-y-4">
          {assets.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No assets</div>
          ) : (
            assets.map((asset) => (
              <div key={asset.id} className="flex items-center space-x-3">
                <div className="relative w-8 h-8 flex-shrink-0">
                  <Image
                    src={asset.icon || "/placeholder.svg"}
                    alt={`${asset.name} icon`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <div className="flex-grow">
                  <div className="text-xs font-medium text-white">{asset.name}</div>
                  <div className="text-xs text-gray-400">{asset.amount} tokens</div>
                </div>
                <div className="text-xs font-medium text-white">{asset.amount}</div>
                {/* 白い枠線をなくし、緑色のテキストだけを表示する例 */}
                <button className="text-xs py-0.5 px-2 h-6 text-green-500 bg-transparent border-none cursor-pointer">
                  +$100
                </button>
              </div>
            ))
          )}
        </div>
      )
    case "Order":
      return <div className="text-white">Order content here</div>
    case "History":
      return <div className="text-white">History content here</div>
    default:
      return null
  }
}

const WalletArea: React.FC = () => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-white mb-2">Wallet Balance</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative w-6 h-6">
            <Image
              src="https://www.iconarchive.com/download/i109534/cjdowner/cryptocurrency-flat/Ethereum-ETH.1024.png"
              alt="ETH icon"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <span className="text-gray-400">ETH:</span>
        </div>
        <span className="font-semibold text-white">2.5 ETH</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative w-6 h-6">
            <Image
              src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
              alt="USDC icon"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <span className="text-gray-400">USDC:</span>
        </div>
        <span className="font-semibold text-white">5,000 USDC</span>
      </div>
    </div>
  )
}

const MyAsset: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Assets")

  return (
    <div className="w-[30%] bg-black/40 backdrop-blur-2xl rounded-[20px] shadow-lg border border-white/10">
      <CardHeader>
        <h2 className="text-2xl font-normal text-white font-serif mb-4">Portfolio</h2>
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-88px)]">
        <div className="flex-grow overflow-y-auto" style={{ height: "60%" }}>
          <AssetsArea activeTab={activeTab} />
        </div>
        <div className="border-t border-gray-700 pt-4 mt-4" style={{ height: "40%" }}>
          <WalletArea />
        </div>
      </CardContent>
    </div>
  )
}

export default MyAsset
