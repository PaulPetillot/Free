/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContractRead } from 'wagmi'

import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../constants'
import { abi as freeAbi } from '../Free.json'

type argTypes = [number] | [string]

const useReadFree = (
  method: FREE_METHODS,
  args: argTypes
): {
  data: any
  isLoading: boolean
  refetch: any
  isRefetching: boolean
  isSuccess: boolean
} => {
  const { data, isLoading, refetch, isRefetching, isSuccess } = useContractRead(
    {
      address: FREE_CONTRACT_ADDRESS,
      abi: freeAbi,
      functionName: method,
      args,
    }
  )

  return {
    data,
    isLoading,
    refetch,
    isRefetching,
    isSuccess,
  }
}

export default useReadFree
