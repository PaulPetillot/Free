import { useContractWrite } from 'wagmi'

import { abi as freeAbi } from '../../../foundry/out/Free.sol/Free.json'
import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../constants'

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
