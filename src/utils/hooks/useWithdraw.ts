import { useContractWrite } from 'wagmi'

import { abi as freeAbi } from '../../../foundry/out/Free.sol/Free.json'
import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../constants'

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
