import { PROFILES } from './types'

export const calculateCompletion = (startDate: bigint, endDate: bigint) => {
  const unixToDate = (unix: bigint) => new Date(Number(unix) * 1000)
  const startDateAsDate = unixToDate(startDate)
  const endDateAsDate = unixToDate(endDate)

  const total = endDateAsDate.getTime() - startDateAsDate.getTime()
  const elapsed = Date.now() - startDateAsDate.getTime()
  const completion = Math.round((elapsed / total) * 100)
  return completion
}

export const isClientOrFreelancer = (
  address: string,
  client: string,
  freelancer: string
) => {
  if (address === client) return PROFILES.CLIENT
  if (address === freelancer) return PROFILES.FREELANCER

  return null
}

export const formatToAddress = (addressToFormat: `0x${string}` | undefined) => {
  if (!addressToFormat) return ''
  const byteAddress = `0x${addressToFormat.slice(26)}`

  return byteAddress
}
