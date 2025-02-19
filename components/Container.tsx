import type React from "react"
import MyAsset from "./MyAsset"
import AssetTable from "./AssetTable"

const Container: React.FC = () => {
  return (
    <div className="w-full h-[74.3vh] max-h-[700px] flex gap-4 p-4">
      <MyAsset />
      <AssetTable />
    </div>
  )
}

export default Container

