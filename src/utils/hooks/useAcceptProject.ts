import { parseEther } from 'ethers'
import { useContractWrite } from 'wagmi'

import { abi as freeAbi } from '../../../foundry/out/Free.sol/Free.json'
import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../constants'

const useAcceptProject = (
  quote: number,
  id?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => {
  const quoteBigInt = BigInt(quote)
  const multiplier = BigInt(1e18)
  const quoteInWei = BigInt(quoteBigInt * multiplier)

  console.log('quote', quote)
  console.log('quoteInWei', quoteInWei)

  const {
    data: contractAcceptedLogs,
    isSuccess: contractAccepted,
    write: acceptContract,
  } = useContractWrite({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    functionName: FREE_METHODS.ACCEPT_AND_START_PROJECT,
    args: [id],
    value: quoteInWei,
  })

  return {
    contractAcceptedLogs,
    contractAccepted,
    acceptContract,
  }
}

export default useAcceptProject
