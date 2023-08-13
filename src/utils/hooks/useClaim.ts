import { useContractWrite } from 'wagmi'

import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../constants'
import { abi as freeAbi } from '../Free.json'

const useClaim = (id?: number) => {
  const {
    data: claimLogs,
    isSuccess: claimAccepted,
    write: claim,
  } = useContractWrite({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    functionName: FREE_METHODS.CLAIM,
    args: [id],
  })

  return {
    claimLogs,
    claimAccepted,
    claim,
  }
}

export default useClaim
