import { useContractWrite } from 'wagmi'

import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../constants'
import { abi as freeAbi } from '../Free.json'

const useAcceptProject = (quote?: number, id?: number) => {
  const {
    data: contractAcceptedLogs,
    isSuccess: contractAccepted,
    write: acceptContract,
  } = useContractWrite({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    functionName: FREE_METHODS.ACCEPT_AND_START_PROJECT,
    args: [id],
    value: BigInt(quote || 0),
  })

  return {
    contractAcceptedLogs,
    contractAccepted,
    acceptContract,
  }
}

export default useAcceptProject
