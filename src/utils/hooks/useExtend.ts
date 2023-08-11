import { formatEther } from 'viem'
import { useContractWrite } from 'wagmi'

import { abi as freeAbi } from '../../../foundry/out/Free.sol/Free.json'
import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../constants'

const useExtend = (timeToAdd: Date, amountToAdd: number, id?: number) => {
  const timeToAddInUnix = timeToAdd.getTime() / 1000
  const amountToAddInWei = formatEther(BigInt(amountToAdd))

  const {
    data: extendLogs,
    isSuccess: extendSuccess,
    write: extend,
  } = useContractWrite({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    functionName: FREE_METHODS.FINISH_PROJECT,
    args: [id, timeToAddInUnix, amountToAddInWei],
  })

  return {
    extendLogs,
    extendSuccess,
    extend,
  }
}

export default useExtend
