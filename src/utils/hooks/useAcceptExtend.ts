import { useContractWrite } from 'wagmi'

import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../constants'
import { abi as freeAbi } from '../Free.json'

const useAcceptExtend = (newQuote: number, id?: number) => {
  const {
    data: acceptExtendLogs,
    isSuccess: acceptExtendSuccess,
    write: acceptExtension,
  } = useContractWrite({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    functionName: FREE_METHODS.ACCEPT_NEW_DEADLINE,
    args: [id],
    value: BigInt(newQuote || 0),
  })

  return {
    acceptExtendLogs,
    acceptExtendSuccess,
    acceptExtension,
  }
}

export default useAcceptExtend
