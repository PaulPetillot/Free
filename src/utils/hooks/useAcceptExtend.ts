import { useContractWrite } from 'wagmi'

import { abi as freeAbi } from '../../../foundry/out/Free.sol/Free.json'
import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../constants'

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
