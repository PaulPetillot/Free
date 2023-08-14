/* eslint-disable no-nested-ternary */
import { ethers, formatEther } from 'ethers'
import { Link, useNavigate } from 'react-router-dom'
import { useAccount, useEnsName } from 'wagmi'

import { Box, Button, Progress, Text } from '@chakra-ui/react'

import { isClientOrFreelancer } from '../../utils/general'
import useAcceptProject from '../../utils/hooks/useAcceptProject'
import useReject from '../../utils/hooks/useReject'
import ROUTES from '../../utils/routes'
import { PROFILES, Project } from '../../utils/types'

import RowContainer from './ProjectRow.style'

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
  finished,
  title,
}: IProjectRow) {
  const navigate = useNavigate()
  const { address } = useAccount()
  const clientAddress = ethers.getAddress(client)
  const freelancerAddress = ethers.getAddress(freelancer)

  const { acceptContract } = useAcceptProject(quote, id)
  const { reject } = useReject(id)

  const userStatus =
    address && isClientOrFreelancer(address.toString(), client, freelancer)

  const { data: ensName } = useEnsName({
    address:
      userStatus === PROFILES.CLIENT
        ? (freelancerAddress as `0x${string}`)
        : (clientAddress as `0x${string}`),
  })

  const handleAccept = async () => {
    acceptContract()
    navigate(ROUTES.PROJECTS)
  }

  const handleReject = async () => {
    reject()
    navigate(ROUTES.PROJECTS)
  }

  return (
    <Link to={`${ROUTES.PROJECT}/${id}`}>
      <RowContainer>
        <Box>
          <Text color="black" fontWeight="bold">
            {title}
          </Text>
          <Text color="black">Quote: {formatEther(quote)} ETH</Text>
          {userStatus === PROFILES.CLIENT && (
            <Text color="black">Freelancer: {ensName || freelancer}</Text>
          )}
          {userStatus === PROFILES.FREELANCER && (
            <Text color="black">Client: {ensName || client}</Text>
          )}
        </Box>
        <Box width="22%">
          {started && !finished ? (
            <>
              <Text color="black" fontWeight="bold">
                Progress: {progress < 100 ? progress : 100}%
              </Text>
              <Progress
                marginTop={3}
                value={progress}
                backgroundColor="#e0e0e0"
                size="sm"
                colorScheme="green"
              />
            </>
          ) : finished ? (
            <Text textAlign="center" color="black" fontWeight="bold">
              Finished
            </Text>
          ) : (
            userStatus === PROFILES.CLIENT && (
              <Box display="flex" flexDirection="column" gap={2}>
                <Button onClick={handleAccept} colorScheme="green" size="sm">
                  Accept
                </Button>
                <Button onClick={handleReject} colorScheme="red" size="sm">
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
