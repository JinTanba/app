// lib/assetfyMarketClient.ts
import {
    createPublicClient,
    createWalletClient,
    custom,
    http,
    parseAbi
  } from "viem";
  
  import { baseSepolia } from "viem/chains";
  import { ConnectedWallet } from "@privy-io/react-auth";
  // import { erc20ABI } from ''; 
  /**
   * Import your full AssetfyMarket ABI from an external file.
   * E.g.:
   *   import AssetfyMarketABI from "./AssetfyMarketABI";
   *
   * Make sure that `AssetfyMarketABI` is a valid ABI array or
   * something that viem can accept. For instance:
   *   export default [
   *     {
   *       "type": "function",
   *       "name": "createProject",
   *       ...
   *     },
   *     ...
   *   ];
   */
  import {AssetfyMarketABI,AssetfyFactry} from "./AssetfyMarketABI"; // Adjust the path as needed.
  
  /**
   * 1) The deployed contract address from .env
   */
  const assetfyMarketAddress = process.env
    .NEXT_PUBLIC_ASSETFY_MARKET_ADDRESS as `0x${string}`;
  
  if (!assetfyMarketAddress) {
    throw new Error("Missing NEXT_PUBLIC_ASSETFY_MARKET_ADDRESS in .env");
  }

  const ERC20_ABI = parseAbi([
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function approve(address spender, uint256 amount) returns (bool)"
  ]);
  
  
  /**
   * 2) Shared public client (for reading & simulations).
   *    Adjust chain & transport to your environment.
   */
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });
  
  /**
   * 3) Helper: create EIP-1193 provider from Privy `ConnectedWallet`.
   */
  async function createProvider(wallet: ConnectedWallet) {
    // Prompt the user to switch to the correct chain if necessary
    const chainId = Number(baseSepolia.id);
    await wallet.switchChain(chainId);
  
    // Retrieve EIP-1193 provider from Privy
    return wallet.getEthereumProvider();
  }
  
  /**
   * 4) ============== READ-ONLY FUNCTIONS ==============
   *
   *    For read calls, we can use `publicClient.readContract` directly
   *    and do not need a user wallet (i.e., no simulation or signature).
   */
  
  /** Get the contract owner() address */
  export async function getOwner(): Promise<`0x${string}`> {
    return publicClient.readContract({
      address: assetfyMarketAddress,
      abi: AssetfyMarketABI,
      functionName: "owner",
    }) as Promise<`0x${string}`>;
  }
  
  /** Check if a token is whitelisted (tokenWhitelist(address) => bool) */
  export async function isTokenWhitelisted(
    token: `0x${string}`
  ): Promise<boolean> {
    return publicClient.readContract({
      address: assetfyMarketAddress,
      abi: AssetfyMarketABI,
      functionName: "tokenWhitelist",
      args: [token],
    }) as Promise<boolean>;
  }
  
  /** Get the uniswapRouter() address */
  export async function getUniswapRouter(): Promise<`0x${string}`> {
    return publicClient.readContract({
      address: assetfyMarketAddress,
      abi: AssetfyMarketABI,
      functionName: "uniswapRouter",
    }) as Promise<`0x${string}`>;
  }
  
  /** Get the USDC contract address (usdc() => address) */
  export async function getUsdcAddress(): Promise<`0x${string}`> {
    return publicClient.readContract({
      address: assetfyMarketAddress,
      abi: AssetfyMarketABI,
      functionName: "usdc",
    }) as Promise<`0x${string}`>;
  }
  
  /** Get the latestProjectId() => uint256 */
  export async function getLatestProjectId(): Promise<bigint> {
    return publicClient.readContract({
      address: assetfyMarketAddress,
      abi: AssetfyMarketABI,
      functionName: "latestProjectId",
    }) as Promise<bigint>;
  }
  
  /** Get config() => (protocolFeeBps, earlyRedemptionRate) struct */
  export async function getConfig(): Promise<[bigint, bigint]> {
    return publicClient.readContract({
      address: assetfyMarketAddress,
      abi: AssetfyMarketABI,
      functionName: "config",
    }) as Promise<[bigint, bigint]>;
  }
  
  /** 
   * `projects(uint256)` => 
   *   (uint256 id,
   *    address company,
   *    string name,
   *    string description,
   *    uint256 targetAmount,
   *    uint256 interestRate,
   *    uint256 maturityTime,
   *    uint256 totalInvested,
   *    address ARCSToken,
   *    uint256 totalRepaid,
   *    uint8 status)
   *
   * Return type is raw from the contract. 
   * You can define a TypeScript interface if you like.
   */
  export async function getProject(
    projectId: bigint
  ): Promise<{
    id: bigint;
    company: `0x${string}`;
    name: string;
    description: string;
    targetAmount: bigint;
    interestRate: bigint;
    maturityTime: bigint;
    totalInvested: bigint;
    ARCSToken: `0x${string}`;
    totalRepaid: bigint;
    status: number;
  }> {
    const result: any = await publicClient.readContract({
      address: assetfyMarketAddress,
      abi: AssetfyMarketABI,
      functionName: "projects",
      args: [projectId],
    });
  
    // Cast to your chosen TypeScript structure

    return {
      id: result[0],
      company: result[1],
      name: result[2],
      description: result[3],
      targetAmount: result[4],
      interestRate: result[5],
      maturityTime: result[6],
      totalInvested: result[7],
      ARCSToken: result[8],
      totalRepaid: result[9],
      status: Number(result[10]),
    };
  }
  
  /**
   * 5) ============== WRITE FUNCTIONS ==============
   *
   *    For each write function, we:
   *      (a) Create a wallet client from the Privy provider
   *      (b) Get the user's address for simulation
   *      (c) Use `publicClient.simulateContract` to produce a `request`
   *      (d) Use `walletClient.writeContract(request)` to send the tx
   */
  
  /** createProject(string, string, uint256, uint256, uint256) => returns projectId */
  export async function createProject(
    wallet: ConnectedWallet,
    params: {
      name: string;
      description: string;
      targetAmount: bigint;
      interestRate: bigint;
      maturityTime: bigint;
    }
  ): Promise<`0x${string}`> {
    const provider = await createProvider(wallet);
    const walletClient = createWalletClient({
      chain: baseSepolia,
      transport: custom(provider),
    });
  
    // For simulation, we need an account
    const addresses = await walletClient.getAddresses();
    const account = addresses[0] as `0x${string}`;
  
    // Simulate
    const { request } = await publicClient.simulateContract({
      address: assetfyMarketAddress,
      abi: AssetfyMarketABI,
      functionName: "createProject",
      account,
      args: [
        params.name,
        params.description,
        params.targetAmount,
        params.interestRate,
        params.maturityTime,
      ],
    });
  
    // Send transaction
    return walletClient.writeContract(request);
  }
  
  /** issueToken(uint256 _projectId) */
  export async function issueToken(
    wallet: ConnectedWallet,
    projectId: bigint
  ): Promise<`0x${string}`> {
    const provider = await createProvider(wallet);
    const walletClient = createWalletClient({
      chain: baseSepolia,
      transport: custom(provider),
    });
    const addresses = await walletClient.getAddresses();
    const account = addresses[0] as `0x${string}`;
  
    const { request } = await publicClient.simulateContract({
      address: assetfyMarketAddress,
      abi: AssetfyMarketABI,
      functionName: "issueToken",
      account,
      args: [projectId],
    });
  
    return walletClient.writeContract(request);
  }
  
/** investERC20(uint256 _projectId, address _token, uint256 _amount) */
export async function investERC20(
  wallet: ConnectedWallet,
  projectId: bigint,
  tokenAddress: `0x${string}`,
  amount: bigint
): Promise<`0x${string}`> {
  // 1. Privy の EIP-1193 プロバイダから walletClient を作成
  const provider = await createProvider(wallet);
  const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: custom(provider),
  });
  const addresses = await walletClient.getAddresses();
  const account = addresses[0] as `0x${string}`;

  // 2. まずはトークンコントラクト（tokenAddress）の approve を simulate してトランザクション request を生成
  //    spender は Market コントラクト (assetfyMarketAddress) です
  const { request: approveRequest } = await publicClient.simulateContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "approve",
    account,
    args: [assetfyMarketAddress, amount],
  });

  // 3. approve トランザクションを実際に送信
  const hash = await walletClient.writeContract(approveRequest);
  
  // approveトランザクション後に3秒待機
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // 4. 続けて investERC20 を simulate して request を生成
  const { request } = await publicClient.simulateContract({
    address: assetfyMarketAddress,
    abi: AssetfyMarketABI,
    functionName: "investERC20",
    account,
    args: [projectId, tokenAddress, amount],
  });

  // 5. investERC20 トランザクションを送信し、トランザクションハッシュを返す
  return walletClient.writeContract(request);
}
  /** earlyRedeem(uint256 _projectId, uint256 _ARCSAmount) */
  export async function earlyRedeem(
    wallet: ConnectedWallet,
    projectId: bigint,
    arcsAmount: bigint
  ): Promise<`0x${string}`> {
    const provider = await createProvider(wallet);
    const walletClient = createWalletClient({
      chain: baseSepolia,
      transport: custom(provider),
    });
    const addresses = await walletClient.getAddresses();
    const account = addresses[0] as `0x${string}`;
  
    const { request } = await publicClient.simulateContract({
      address: assetfyMarketAddress,
      abi: AssetfyMarketABI,
      functionName: "earlyRedeem",
      account,
      args: [projectId, arcsAmount],
    });
  
    return walletClient.writeContract(request);
  }
  
  /** redeem(uint256 _projectId, uint256 _ARCSAmount) */
  export async function redeem(
    wallet: ConnectedWallet,
    projectId: bigint,
    arcsAmount: bigint
  ): Promise<`0x${string}`> {
    const provider = await createProvider(wallet);
    const walletClient = createWalletClient({
      chain: baseSepolia,
      transport: custom(provider),
    });
    const addresses = await walletClient.getAddresses();
    const account = addresses[0] as `0x${string}`;
  
    const { request } = await publicClient.simulateContract({
      address: assetfyMarketAddress,
      abi: AssetfyMarketABI,
      functionName: "redeem",
      account,
      args: [projectId, arcsAmount],
    });
  
    return walletClient.writeContract(request);
  }
  
  /** repayment(uint256 _projectId, uint256 _amount) */
  export async function repayment(
    wallet: ConnectedWallet,
    projectId: bigint,
    usdcAmount: bigint
  ): Promise<`0x${string}`> {
    const provider = await createProvider(wallet);
    const walletClient = createWalletClient({
      chain: baseSepolia,
      transport: custom(provider),
    });
    const addresses = await walletClient.getAddresses();
    const account = addresses[0] as `0x${string}`;
  
    const { request } = await publicClient.simulateContract({
      address: assetfyMarketAddress,
      abi: AssetfyMarketABI,
      functionName: "repayment",
      account,
      args: [projectId, usdcAmount],
    });
  
    return walletClient.writeContract(request);
  }
  
  /** releaseFunds(uint256 _projectId) */
  export async function releaseFunds(
    wallet: ConnectedWallet,
    projectId: bigint
  ): Promise<`0x${string}`> {
    const provider = await createProvider(wallet);
    const walletClient = createWalletClient({
      chain: baseSepolia,
      transport: custom(provider),
    });
    const addresses = await walletClient.getAddresses();
    const account = addresses[0] as `0x${string}`;
  
    const { request } = await publicClient.simulateContract({
      address: assetfyMarketAddress,
      abi: AssetfyMarketABI,
      functionName: "releaseFunds",
      account,
      args: [projectId],
    });
  
    return walletClient.writeContract(request);
  }
  
  /** updateWhitelist(address _token, bool _isAllowed) */
  export async function updateWhitelist(
    wallet: ConnectedWallet,
    tokenAddress: `0x${string}`,
    isAllowed: boolean
  ): Promise<`0x${string}`> {
    const provider = await createProvider(wallet);
    const walletClient = createWalletClient({
      chain: baseSepolia,
      transport: custom(provider),
    });
    const addresses = await walletClient.getAddresses();
    const account = addresses[0] as `0x${string}`;
  
    const { request } = await publicClient.simulateContract({
      address: assetfyMarketAddress,
      abi: AssetfyMarketABI,
      functionName: "updateWhitelist",
      account,
      args: [tokenAddress, isAllowed],
    });
  
    return walletClient.writeContract(request);
  }
  

  export async function createAssetfyMarket(
    wallet: ConnectedWallet,
    params: {
      owner: `0x${string}`;
      config: {
        protocolFeeBps: bigint;
        earlyRedemptionRate: bigint;
      };
    }
  ): Promise<`0x${string}`> {
    // 1. Wallet Client の作成
    const provider = await createProvider(wallet);
    const walletClient = createWalletClient({
      chain: baseSepolia,
      transport: custom(provider),
    });
  
    // 2. シミュレーション用に、ウォレットのアドレス（account）を取得
    const addresses = await walletClient.getAddresses();
    const account = addresses[0] as `0x${string}`;
  
    // 3. createAssetfyMarket の呼び出しを simulate してトランザクション request を作成
    const { request } = await publicClient.simulateContract({
      address: process.env.NEXT_PUBLIC_MARKET_FACTORY as any,
      abi: AssetfyFactry,
      functionName: "createAssetfyMarket",
      account,
      args: [
        params.owner,
        "0xe60210A4c4E86126dD7194435b5427936F705157",          // .env から取得した USDC アドレス
        "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24", // .env から取得した Uniswap Router アドレス
        {
          protocolFeeBps: params.config.protocolFeeBps,
          earlyRedemptionRate: params.config.earlyRedemptionRate,
        },
      ],
    });
  
    // 4. 実際にトランザクションを送信して、Tx ハッシュを返す
    const txHash = await walletClient.writeContract(request);
    return txHash;
  }
  