"use client"

import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Order {
  price: number
  amount: number
  total: number
}

export const OrderBook: React.FC = () => {
  const buyOrders: Order[] = [
    { price: 100.5, amount: 1000, total: 100500 },
    { price: 100.25, amount: 1500, total: 150375 },
    { price: 100.0, amount: 2000, total: 200000 },
    { price: 99.75, amount: 1800, total: 179550 },
    { price: 99.5, amount: 2200, total: 218900 },
  ]

  const sellOrders: Order[] = [
    { price: 101.5, amount: 900, total: 91350 },
    { price: 101.25, amount: 1200, total: 121500 },
    { price: 101.0, amount: 1800, total: 181800 },
    { price: 100.75, amount: 1600, total: 161200 },
    { price: 100.6, amount: 2100, total: 211260 },
  ]

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Sell Orders */}
      <div className="bg-black/20 rounded-xl p-4">
        <h3 className="text-xl font-semibold text-white mb-4">Sell Orders</h3>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-800">
              <TableHead className="text-gray-400">Price</TableHead>
              <TableHead className="text-gray-400 text-right">Amount</TableHead>
              <TableHead className="text-gray-400 text-right">Total</TableHead>
              <TableHead className="text-gray-400 w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellOrders.map((order, index) => (
              <TableRow key={index} className="border-b border-gray-800/50">
                <TableCell className="text-red-400 font-medium">${formatNumber(order.price)}</TableCell>
                <TableCell className="text-white text-right">{formatNumber(order.amount)}</TableCell>
                <TableCell className="text-gray-400 text-right">${formatNumber(order.total)}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50"
                  >
                    Sell
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Buy Orders */}
      <div className="bg-black/20 rounded-xl p-4">
        <h3 className="text-xl font-semibold text-white mb-4">Buy Orders</h3>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-800">
              <TableHead className="text-gray-400">Price</TableHead>
              <TableHead className="text-gray-400 text-right">Amount</TableHead>
              <TableHead className="text-gray-400 text-right">Total</TableHead>
              <TableHead className="text-gray-400 w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buyOrders.map((order, index) => (
              <TableRow key={index} className="border-b border-gray-800/50">
                <TableCell className="text-[#4FD1C5] font-medium">${formatNumber(order.price)}</TableCell>
                <TableCell className="text-white text-right">{formatNumber(order.amount)}</TableCell>
                <TableCell className="text-gray-400 text-right">${formatNumber(order.total)}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    className="w-full bg-[#4FD1C5]/20 hover:bg-[#4FD1C5]/30 text-[#4FD1C5] border border-[#4FD1C5]/50"
                  >
                    Buy
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

