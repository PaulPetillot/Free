import { parseEther } from 'ethers'
import { useContractWrite } from 'wagmi'

import { abi as freeAbi } from '../../../foundry/out/Free.sol/Free.json'
import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../constants'

const useExtend = (newDeadline: Date, amountToAdd: number, id?: number) => {
  const newDeadlineUnix = newDeadline.getTime() / 1000
  const amountToAddInWei = parseEther(amountToAdd.toString())

  const {
    data: extendLogs,
    isSuccess: extendSuccess,
    write: extend,
  } = useContractWrite({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    functionName: FREE_METHODS.REQUEST_EXTEND_DEADLINE,
    args: [id, newDeadlineUnix, amountToAddInWei],
  })

  return {
    extendLogs,
    extendSuccess,
    extend,
  }
}

export default useExtend
