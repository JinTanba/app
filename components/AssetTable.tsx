"use client"

import { TableHeader } from "@/components/ui/table"
import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableRow } from "./ui/table"
import { Button } from "./ui/button"
import Image from "next/image"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { useRouter } from "next/navigation"

const formatAmount = (amount: number) => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(2)}M`
  }
  return amount.toLocaleString()
}

const AssetTable: React.FC = () => {
  const router = useRouter()
  const assets = [
    {
      id: 1,
      logo: "https://www.renatus-robotics.com/jp/wp-content/uploads/2022/11/renatus_logo_1120.png",
      name: "Renatus Robotics",
      maturityDate: "2025-12-31",
      currentDate: "2023-06-15",
      daysRemaining: 930,
      targetAmount: 240000000,
      currentAmount: 176770000,
      interestRate: "3.5%",
    },
    {
      id: 2,
      logo: "https://www.industryalpha.net/wp-content/uploads/2023/07/Industry-Alpha%E9%BB%92%E3%83%AD%E3%82%B4.png",
      name: "Industry Alpha",
      maturityDate: "2026-06-30",
      currentDate: "2023-06-15",
      daysRemaining: 1111,
      targetAmount: 180000000,
      currentAmount: 120000000,
      interestRate: "4.2%",
    },
    {
      id: 3,
      logo: "https://1000logos.net/wp-content/uploads/2022/08/Palantir-Symbol.png",
      name: "SCOOP.fun",
      maturityDate: "2026-03-31",
      currentDate: "2023-06-15",
      daysRemaining: 1020,
      targetAmount: 150000000,
      currentAmount: 98000000,
      interestRate: "3.8%",
    },
  ]

  const handleDetailClick = (id: number) => {
    router.push(`/asset/${id}`)
  }

  return (
    <div className="w-[80%] bg-black/40 backdrop-blur-2xl rounded-[20px] shadow-lg p-8 border border-white/10">
      <h2 className="mb-6 text-2xl text-white font-serif">Available Assets</h2>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-700">
            <TableHead className="text-gray-400 w-2/5">Company</TableHead>
            <TableHead className="text-gray-400 w-1/6">Maturity</TableHead>
            <TableHead className="text-gray-400 w-1/3">Funding Progress</TableHead>
            <TableHead className="text-gray-400 w-1/12">Interest Rate</TableHead>
            <TableHead className="text-gray-400 w-1/12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id} className="border-b border-gray-700/50 hover:bg-transparent">
              <TableCell className="font-medium text-white">
                <div className="flex items-center gap-4">
                  <Image
                    src={asset.logo || "/placeholder.svg"}
                    alt={`${asset.name} logo`}
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                  <span className="text-sm font-medium">{asset.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-white">
                <div className="flex flex-col">
                  <span className="text-sm">{asset.maturityDate}</span>
                  <span className="text-xs text-gray-400">{asset.daysRemaining} days remaining</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex-shrink-0">
                    <CircularProgressbar
                      value={(asset.currentAmount / asset.targetAmount) * 100}
                      text={`${((asset.currentAmount / asset.targetAmount) * 100).toFixed(2)}%`}
                      styles={buildStyles({
                        pathColor: "#4FD1C5",
                        textColor: "#ffffff",
                        textSize: "20px",
                        trailColor: "#2D3748",
                      })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-white text-base">
                      ${formatAmount(asset.currentAmount)} of ${formatAmount(asset.targetAmount)}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-2xl font-bold text-[#4FD1C5]">{asset.interestRate}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="bg-white text-black hover:bg-gray-200"
                  onClick={() => handleDetailClick(asset.id)}
                >
                  Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AssetTable

