"use client"

import React, { useState, useCallback, useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"
import Link from "next/link"
import { Button } from "./ui/button"
import { CreateMarketModal } from "./create-market-modal"

const Header: React.FC = () => {
  const [isCreateMarketOpen, setIsCreateMarketOpen] = useState(false)
  const [address, setAddress] = useState("")

  const { login, ready, authenticated, user, logout } = usePrivy()

  useEffect(() => {
    if (ready && authenticated && user?.wallet?.address) {
      setAddress(user.wallet.address)
    }
  }, [ready, authenticated, user])

  const connectWallet = async () => {
    try {
      await login()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const generateGradientIcon = useCallback((address: string) => {
    const hash = address.slice(2, 10)
    const hue1 = Number.parseInt(hash.slice(0, 4), 16) % 360
    const hue2 = (hue1 + 180) % 360

    return (
      <div
        className="w-6 h-6 rounded-full mr-2"
        style={{
          background: `linear-gradient(135deg, hsl(${hue1}, 100%, 50%), hsl(${hue2}, 100%, 50%))`,
        }}
      />
    )
  }, [])

  const handleCreateMarketOpen = useCallback(() => {
    setIsCreateMarketOpen(true)
  }, [])

  const handleCreateMarketClose = useCallback(() => {
    setIsCreateMarketOpen(false)
  }, [])

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-10 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* タイトルとナビゲーションをまとめて横並びに */}
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold text-white">
              Assetfy
            </div>
            {/*  */}
          </div>

          {/* 右側: Create Market ボタンや Connect Wallet ボタンなど */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300"
              onClick={handleCreateMarketOpen}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Create Market
              </span>
            </Button>

            <Button
              variant="outline"
              className="bg-white text-black hover:bg-white/90 transition-all duration-300"
              onClick={ready && authenticated ? logout : connectWallet}
            >
              {!ready ? (
                "Initializing..."
              ) : authenticated ? (
                <div className="flex items-center">
                  {generateGradientIcon(address)}
                  <span>{address.slice(0, 9)}</span>
                </div>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Create Market 用のモーダル */}
      <CreateMarketModal
        isOpen={isCreateMarketOpen}
        onClose={handleCreateMarketClose}
      />
    </>
  )
}

export default Header
