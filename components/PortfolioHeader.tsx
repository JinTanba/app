import type React from "react"

const PortfolioHeader: React.FC = () => {
  return (
    <div className="w-[89.5vw] mb-6">
      <h1 className="text-4xl font-light text-white mb-8">Portfolio</h1>
      <div className="flex gap-32">
        <div>
          <h2 className="text-gray-400 mb-2">14 Day Volume</h2>
          <div className="text-4xl font-light text-white mb-1">$0</div>
          <a href="#" className="text-[#4FD1C5] hover:text-[#4FD1C5]/90">
            View volume
          </a>
        </div>
        <div>
          <h2 className="text-gray-400 mb-2">Fees (Taker / Maker)</h2>
          <div className="text-4xl font-light text-white mb-1">0.0350% / 0.0100%</div>
          <a href="#" className="text-[#4FD1C5] hover:text-[#4FD1C5]/90">
            View fee schedule
          </a>
        </div>
      </div>
    </div>
  )
}

export default PortfolioHeader

