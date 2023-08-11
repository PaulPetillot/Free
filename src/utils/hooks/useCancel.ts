import { useContractWrite } from 'wagmi'

import { abi as freeAbi } from '../../../foundry/out/Free.sol/Free.json'
import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../constants'

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
