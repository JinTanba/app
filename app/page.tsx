import type { NextPage } from "next"
import Layout from "../components/Layout"
import Container from "../components/Container"
import { TopData } from "../components/TopData"
import Providers from "./providers"
const Home: NextPage = () => {
  return (
      <Providers>
        <Layout>
          <TopData />
          <Container />
        </Layout>
      </Providers>
  )
}

export default Home

