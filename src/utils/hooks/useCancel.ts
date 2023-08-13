import { useContractWrite } from 'wagmi'

import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../constants'
import { abi as freeAbi } from '../Free.json'

const useCancel = (id?: number) => {
  const {
    data: cancelLogs,
    isSuccess: cancelAccepted,
    write: cancel,
  } = useContractWrite({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    functionName: FREE_METHODS.CANCEL_PROJECT,
    args: [id],
  })

  return {
    cancelLogs,
    cancelAccepted,
    cancel,
  }
}

export default useCancel
