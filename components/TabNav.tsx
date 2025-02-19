import type React from "react"
import { cn } from "@/lib/utils"

interface TabNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = ["Assets", "Order", "History"]

  return (
    <div className="flex gap-6 border-b border-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            "pb-3 px-1 text-sm text-gray-400 hover:text-gray-200 transition-colors relative",
            activeTab === tab && [
              "text-white",
              "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#4FD1C5]",
            ],
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export default TabNav

