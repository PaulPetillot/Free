import { useContractRead } from 'wagmi'

import { abi as freeAbi } from '../../../foundry/out/Free.sol/Free.json'
import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../constants'

type argTypes = [number] | [string]

const useReadFree = (
  method: FREE_METHODS,
  args: argTypes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { data: any; isLoading: boolean } => {
  const { data, isLoading } = useContractRead({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    functionName: method,
    args,
  })

  return {
    data,
    isLoading,
  }
}

export default useReadFree
