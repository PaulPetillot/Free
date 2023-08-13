import { useContractWrite } from 'wagmi'

import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../constants'
import { abi as freeAbi } from '../Free.json'

const useReject = (id?: number) => {
  const {
    data: rejectLogs,
    isSuccess: rejectSuccessfull,
    write: reject,
  } = useContractWrite({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    functionName: FREE_METHODS.REJECT_PROJECT,
    args: [id],
  })

  return {
    rejectLogs,
    rejectSuccessfull,
    reject,
  }
}

export default useReject
