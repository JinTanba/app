// AssetfyMarket.ts

import { walletClient, publicClient } from './viemClient'
import { AssetfyMarketABI } from './AssetfyMarketABI'
import { Address } from 'viem'

// The deployed contract address (provided in your data)
export const MARKET_ADDRESS = '0xe14d49ebb52b5b607daf8cf67b0e9745f131f7ab' as const

/**
 * Read call example:
 * Read the `projects(projectId)` view function.
 */
export async function getProject(projectId: bigint) {
  return await publicClient.readContract({
    address: MARKET_ADDRESS,
    abi: AssetfyMarketABI,
    functionName: 'projects',
    args: [projectId],
  })
}

/**
 * 1) updateWhitelist(_token, _isAllowed)
 */
export async function updateWhitelist(token: Address, isAllowed: boolean) {
  return await walletClient.writeContract({
    address: MARKET_ADDRESS,
    abi: AssetfyMarketABI,
    functionName: 'updateWhitelist',
    args: [token, isAllowed],
  })
}

/**
 * 2) createProject(_name, _description, _targetAmount, _interestRate, _maturityTime)
 */
export async function createProject(
  name: string,
  description: string,
  targetAmount: bigint,
  interestRate: bigint,
  maturityTime: bigint
) {
  return await walletClient.writeContract({
    address: MARKET_ADDRESS,
    abi: AssetfyMarketABI,
    functionName: 'createProject',
    args: [name, description, targetAmount, interestRate, maturityTime],
  })
}

/**
 * 3) issueToken(_projectId)
 */
export async function issueToken(projectId: bigint) {
  return await walletClient.writeContract({
    address: MARKET_ADDRESS,
    abi: AssetfyMarketABI,
    functionName: 'issueToken',
    args: [projectId],
  })
}

/**
 * 4) investETH(_projectId) -> pay ETH
 *
 *  In viem, pass `value` in `writeContract` for ETH.
 */
export async function investETH(projectId: bigint, ethAmountWei: bigint) {
  return await walletClient.writeContract({
    address: MARKET_ADDRESS,
    abi: AssetfyMarketABI,
    functionName: 'investETH',
    args: [projectId],
    // Send the desired amount of ETH in Wei
    value: ethAmountWei,
  })
}

/**
 * 5) investERC20(_projectId, _token, _amount)
 * 
 *  Make sure you have already approved the contract (AssetfyMarket) to spend your ERC20 tokens
 *  if the token follows the usual "transferFrom" flow (the contract calls transferFrom).
 */
export async function investERC20(projectId: bigint, token: Address, amount: bigint) {
  // 1. (Optional) call `approve` on the token contract if needed, 
  //    so that the contract can pull tokens via transferFrom.
  //    For example, using an ERC20 ABI with viem:
  //    await walletClient.writeContract({
  //      address: token,
  //      abi: ERC20_ABI,
  //      functionName: 'approve',
  //      args: [MARKET_ADDRESS, amount],
  //    })

  // 2. Call investERC20
  return await walletClient.writeContract({
    address: MARKET_ADDRESS,
    abi: AssetfyMarketABI,
    functionName: 'investERC20',
    args: [projectId, token, amount],
  })
}

/**
 * 6) earlyRedeem(_projectId, _ARCSAmount)
 */
export async function earlyRedeem(projectId: bigint, arcsAmount: bigint) {
  return await walletClient.writeContract({
    address: MARKET_ADDRESS,
    abi: AssetfyMarketABI,
    functionName: 'earlyRedeem',
    args: [projectId, arcsAmount],
  })
}

/**
 * 7) redeem(_projectId, _ARCSAmount)
 */
export async function redeem(projectId: bigint, arcsAmount: bigint) {
  return await walletClient.writeContract({
    address: MARKET_ADDRESS,
    abi: AssetfyMarketABI,
    functionName: 'redeem',
    args: [projectId, arcsAmount],
  })
}

/**
 * 8) repayment(_projectId, _amount)
 */
export async function repayment(projectId: bigint, amount: bigint) {
  return await walletClient.writeContract({
    address: MARKET_ADDRESS,
    abi: AssetfyMarketABI,
    functionName: 'repayment',
    args: [projectId, amount],
  })
}

/**
 * 9) releaseFunds(_projectId)
 */
export async function releaseFunds(projectId: bigint) {
  return await walletClient.writeContract({
    address: MARKET_ADDRESS,
    abi: AssetfyMarketABI,
    functionName: 'releaseFunds',
    args: [projectId],
  })
}
