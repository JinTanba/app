import type React from "react"
import { ChevronDown } from "lucide-react"

export const TopData: React.FC = () => {
  return (
    <div className="w-full mt-8 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-4xl font-normal text-white flex items-center gap-3 font-serif">
          Core Market
          <span className="px-2 py-1 text-sm bg-[#6366F1]/20 text-[#A5B4FC] rounded-md">V3</span>
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </h1>
      </div>
      <div className="flex gap-16">
        <div>
          <h2 className="text-gray-400 text-sm mb-1">Total Trading Volume</h2>
          <div className="text-3xl font-light text-white mb-1">$1,234,567,890</div>
          <a href="#" className="text-[#4FD1C5] text-sm hover:text-[#4FD1C5]/90">
            View details
          </a>
        </div>
        <div>
          <h2 className="text-gray-400 text-sm mb-1">Total Value Locked (TVL)</h2>
          <div className="text-3xl font-light text-white mb-1">$890,123,456</div>
          <a href="#" className="text-[#4FD1C5] text-sm hover:text-[#4FD1C5]/90">
            View analytics
          </a>
        </div>
        <div>
          <h2 className="text-gray-400 text-sm mb-1">Platform Fee</h2>
          <div className="text-3xl font-light text-white mb-1">0.2%</div>
          <a href="#" className="text-[#4FD1C5] text-sm hover:text-[#4FD1C5]/90">
            View fee details
          </a>
        </div>
      </div>
    </div>
  )
}

