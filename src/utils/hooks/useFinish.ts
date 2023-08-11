import { useContractWrite } from 'wagmi'

import { abi as freeAbi } from '../../../foundry/out/Free.sol/Free.json'
import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../constants'

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
