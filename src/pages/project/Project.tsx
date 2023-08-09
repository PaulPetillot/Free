/* eslint-disable no-nested-ternary */
import { formatEther } from 'ethers'
import { useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { Box, Button, Flex, Heading, Spinner, Text } from '@chakra-ui/react'

import Layout from '../../components/layout/Layout'
import { FREE_METHODS } from '../../utils/constants'
import { isClientOrFreelancer } from '../../utils/general'
import useAcceptProject from '../../utils/hooks/useAcceptProject'
import useClaim from '../../utils/hooks/useClaim'
import useReadFree from '../../utils/hooks/useReadFree'
import useWithdraw from '../../utils/hooks/useWithdraw'
import { PROFILES } from '../../utils/types'

type ProjectProps = {
  id: string
}

function Project() {
  const { address } = useAccount()
  const { id } = useParams<ProjectProps>()

  const { data, isLoading } = useReadFree(FREE_METHODS.PROJECT_BY_ID, [
    Number(id),
  ])
  const { data: freelancerBalance } = useReadFree(
    FREE_METHODS.GET_FREELANCER_BALANCE,
    [Number(id)]
  )
  const { data: clientBalance } = useReadFree(FREE_METHODS.GET_CLIENT_BALANCE, [
    Number(id),
  ])

  const { claim } = useClaim(Number(id))
  const { withdraw } = useWithdraw(Number(id))

  const [
    ,
    quote,
    deadline,
    lastClaimed,
    newDeadline,
    newQuote,
    started,
    finished,
    client,
    freelancer,
    startedAt,
  ] = data || []

  const { acceptContract } = useAcceptProject(quote, Number(id))

  const isDeadlinePassed = deadline && deadline < Date.now() / 1000

  const profile = address && isClientOrFreelancer(address, client, freelancer)

  const handleCancel = () => {}

  const handleFinish = () => {}

  const handleExtend = () => {}

  const handleAccept = () => {}

  const freelancerPanel = (
    <>
      {started ? (
        <Text color="gray.600" fontSize="lg">
          Started at: {new Date(Number(startedAt) * 1000).toLocaleString()}
        </Text>
      ) : (
        <Text color="gray.600" fontSize="lg">
          Proposed at: {new Date(Number(startedAt) * 1000).toLocaleString()}
        </Text>
      )}
      <Flex flexDirection="column" alignItems="flex-start" gap={5} mt={4}>
        <Box
          display="flex"
          gap={10}
          alignItems="center"
          justifyContent="space-between"
          mt={4}
        >
          <Box display="flex" flexDirection="column" gap={1}>
            <Text color="gray.600" fontSize="lg">
              Quote: {quote && formatEther(quote)} ETH
            </Text>
            <Text color="gray.600" fontSize="lg">
              Deadline: {new Date(Number(deadline) * 1000).toLocaleString()}
            </Text>
            {freelancerBalance && (
              <Text color="gray.600" fontSize="lg">
                Balance: {formatEther(freelancerBalance)} ETH
              </Text>
            )}
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Text color="gray.600" fontSize="lg">
              Client: {client}
            </Text>
            <Text
              color={
                started && !finished
                  ? 'green.500'
                  : finished
                  ? 'red.500'
                  : 'gray.500'
              }
              fontSize="lg"
            >
              Status:{' '}
              {started && !finished
                ? 'Started'
                : finished
                ? 'Finished'
                : 'Not started'}
            </Text>
          </Box>
        </Box>

        <Box display="flex" gap={2}>
          {started && (
            <Button colorScheme="green" onClick={() => claim()}>
              Claim
            </Button>
          )}
          {freelancerBalance && (
            <Button colorScheme="red" onClick={() => withdraw()}>
              Withdraw
            </Button>
          )}
          {!finished && started && (
            <Button colorScheme="red" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          {started && !finished && !newDeadline && (
            <Button colorScheme="green" onClick={handleExtend}>
              Extend
            </Button>
          )}
          {newDeadline && (
            <Button colorScheme="green" onClick={handleAccept}>
              Accept Extension
            </Button>
          )}
          {isDeadlinePassed && !finished && started && (
            <Button colorScheme="green" onClick={handleFinish}>
              Finish
            </Button>
          )}
        </Box>
      </Flex>
    </>
  )

  const clientPanel = (
    <>
      {started ? (
        <Text color="gray.600" fontSize="lg">
          Started at: {new Date(Number(startedAt) * 1000).toLocaleString()}
        </Text>
      ) : (
        <Text color="gray.600" fontSize="lg">
          Proposed at: {new Date(Number(startedAt) * 1000).toLocaleString()}
        </Text>
      )}
      <Flex flexDirection="column" alignItems="flex-start" gap={8} mt={4}>
        <Box
          display="flex"
          gap={10}
          alignItems="center"
          justifyContent="space-between"
          mt={4}
        >
          <Box display="flex" flexDirection="column" gap={1}>
            <Text color="gray.600" fontSize="lg">
              Quote: {quote && formatEther(quote)} ETH
            </Text>
            <Text color="gray.600" fontSize="lg">
              Deadline: {new Date(Number(deadline) * 1000).toLocaleString()}
            </Text>
            {clientBalance && (
              <Text color="gray.600" fontSize="lg">
                Balance: {formatEther(clientBalance)} ETH
              </Text>
            )}
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Text color="gray.600" fontSize="lg">
              Freelancer: {freelancer}
            </Text>
            <Text
              color={started ? 'green.500' : finished ? 'red.500' : 'gray.500'}
              fontSize="lg"
            >
              Status:{' '}
              {started ? 'Started' : finished ? 'Finished' : 'Not started'}
            </Text>
          </Box>
        </Box>

        <Box display="flex" gap={2}>
          {!started && (
            <Button colorScheme="green" onClick={() => acceptContract()}>
              Accept
            </Button>
          )}
          {!started && (
            <Button colorScheme="red" onClick={handleCancel}>
              Reject
            </Button>
          )}
          {started && !finished && (
            <Button colorScheme="red" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          {started && !finished && isDeadlinePassed && (
            <Button colorScheme="green" onClick={handleFinish}>
              Finish
            </Button>
          )}
        </Box>
      </Flex>
    </>
  )

  let panel
  if (profile === PROFILES.FREELANCER) {
    panel = freelancerPanel
  } else if (profile === PROFILES.CLIENT) {
    panel = clientPanel
  }

  return (
    <Layout title="">
      <Box p={4}>
        <Heading color="black">Project {id}</Heading>
        {/* eslint-disable no-nested-ternary */}
        {isLoading ? (
          <Flex alignItems="center" justifyContent="center">
            <Spinner size="xl" />
          </Flex>
        ) : data ? (
          panel
        ) : (
          <Text color="gray.600" fontSize="lg">
            No project found with ID {id}
          </Text>
        )}
        {/* eslint-enable no-nested-ternary */}
      </Box>
    </Layout>
  )
}

export default Project
