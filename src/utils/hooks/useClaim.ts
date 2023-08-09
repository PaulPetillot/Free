import { useContractWrite } from 'wagmi'

import { abi as freeAbi } from '../../../foundry/out/Free.sol/Free.json'
import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../constants'

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
