import { useContractWrite } from 'wagmi'

import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../constants'
import { abi as freeAbi } from '../Free.json'

const useFinish = (id?: number) => {
  const {
    data: finishLogs,
    isSuccess: finishAccepted,
    write: finish,
  } = useContractWrite({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    functionName: FREE_METHODS.FINISH_PROJECT,
    args: [id],
  })

  return {
    finishLogs,
    finishAccepted,
    finish,
  }
}

export default useFinish
