import { ethers, formatEther } from 'ethers'
import { Link } from 'react-router-dom'
import { useAccount, useEnsName } from 'wagmi'

import { Box, Button, Progress, Text } from '@chakra-ui/react'

import { isClientOrFreelancer } from '../../utils/general'
import ROUTES from '../../utils/routes'
import { PROFILES, Project } from '../../utils/types'

import { RowContainer } from './ProjectRow.style'

interface IProjectRow extends Project {
  progress: number
}

function ProjectRow({
  id,
  quote,
  client,
  freelancer,
  progress,
  started,
}: IProjectRow) {
  const { address } = useAccount()
  const clientAddress = ethers.getAddress(client)
  const freelancerAddress = ethers.getAddress(freelancer)

  const userStatus =
    address && isClientOrFreelancer(address.toString(), client, freelancer)

  const { data: ensName } = useEnsName({
    address:
      userStatus === PROFILES.CLIENT
        ? (freelancerAddress as `0x${string}`)
        : (clientAddress as `0x${string}`),
  })

  return (
    <Link to={`${ROUTES.PROJECT}/${id}`}>
      <RowContainer>
        <Box>
          <Text color="black" fontWeight="bold">
            ID: {id}
          </Text>
          <Text color="black">Quote: {formatEther(quote)} ETH</Text>
          {userStatus === PROFILES.CLIENT && (
            <Text color="black">Freelancer: {ensName || freelancer}</Text>
          )}
          {userStatus === PROFILES.FREELANCER && (
            <Text color="black">Client: {ensName || client}</Text>
          )}
        </Box>
        <Box>
          {started ? (
            <>
              <Text color="black" fontWeight="bold">
                Progress: {progress}%
              </Text>
              <Progress
                marginTop={3}
                value={progress}
                backgroundColor="#e0e0e0"
                size="sm"
                colorScheme="green"
              />
            </>
          ) : (
            userStatus === PROFILES.CLIENT && (
              <Box display="flex" flexDirection="column" gap={2}>
                <Button colorScheme="green" size="sm">
                  Accept
                </Button>
                <Button colorScheme="red" size="sm">
                  Reject
                </Button>
              </Box>
            )
          )}
        </Box>
      </RowContainer>
    </Link>
  )
}

export default ProjectRow
