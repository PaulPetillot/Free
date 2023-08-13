import { useContractWrite } from 'wagmi'

import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../constants'
import { abi as freeAbi } from '../Free.json'

const useWithdraw = (id?: number) => {
  const {
    data: withdrawLogs,
    isSuccess: withdrawAccepted,
    write: withdraw,
  } = useContractWrite({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    functionName: FREE_METHODS.WITHDRAW,
    args: [id],
  })

  return {
    withdrawLogs,
    withdrawAccepted,
    withdraw,
  }
}

export default useWithdraw
