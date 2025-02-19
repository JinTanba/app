"use client"

import type React from "react"
import Layout from "@/components/Layout"
import { CompanyData } from "@/components/CompanyData"
import CompanyContainer from "@/components/CompanyContainer"
import { useRouter } from "next/navigation"
import Providers from "@/app/providers"

interface AssetDetailProps {
  params: {
    id: string
  }
}

const AssetDetail: React.FC<AssetDetailProps> = ({ params }) => {
  const router = useRouter()

  // This is mock data. In a real application, you'd fetch this data based on the asset ID.
  const companyData = {
    name: "Renatus Robotics",
    logo: "https://www.renatus-robotics.com/jp/wp-content/uploads/2022/11/renatus_logo_1120.png",
    totalFunding: "$240,000,000",
    currentFunding: "$176,770,000",
    interestRate: "3.5%",
    maturityDate: "2025-12-31",
    videoUrl: "https://www.youtube.com/embed/sTPLCbUItrk", // Replace with actual video URL
    tokenName: "ARCS-RNT",
    description:
      "Renatus Robotics is pioneering the future of autonomous robotics systems. Our technology combines advanced AI with precision engineering to create robots that can adapt to complex environments and perform sophisticated tasks. With a focus on industrial applications, we're working to revolutionize manufacturing, logistics, and automation across various sectors.",
  }

  return (
    <Providers>
    <Layout>
      <CompanyData
        name={companyData.name}
        totalFunding={companyData.totalFunding}
        currentFunding={companyData.currentFunding}
        interestRate={companyData.interestRate}
        logo={companyData.logo}
      />
      <CompanyContainer
        name={companyData.name}
        logo={companyData.logo}
        videoUrl={companyData.videoUrl}
        interestRate={companyData.interestRate}
        maturityDate={companyData.maturityDate}
        currentFunding={companyData.currentFunding}
        targetFunding={companyData.totalFunding}
        tokenName={companyData.tokenName}
        description={companyData.description}
        projectId={BigInt(1)}
      />
    </Layout>
    </Providers>
  )
}

export default AssetDetail

