/* eslint-disable no-nested-ternary */
import { formatEther } from 'ethers'

import { Box, Button, Flex, Text } from '@chakra-ui/react'

interface FreelancerPanelProps {
  started: boolean
  startedAt: number | undefined
  quote: string | undefined
  deadline: number | undefined
  freelancerBalance: string | undefined
  client: string
  finished: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loading: any
  handleClaim: () => void
  handleWithdraw: () => void
  handleFinish: () => void
  handleCancel: () => void
  handleOpenModal: () => void
  isDeadlinePassed: boolean
  newDeadline: number | undefined
}

function FreelancerPanel({
  startedAt,
  started,
  quote,
  deadline,
  freelancerBalance,
  client,
  finished,
  loading,
  isDeadlinePassed,
  newDeadline,
  handleCancel,
  handleClaim,
  handleWithdraw,
  handleFinish,
  handleOpenModal,
}: FreelancerPanelProps) {
  return (
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

        <Box paddingTop={10} display="flex" gap={10}>
          <Box display="flex" gap={2}>
            {started && (
              <Button
                isLoading={loading.claim}
                colorScheme="blue"
                onClick={handleClaim}
              >
                Claim
              </Button>
            )}
            {freelancerBalance && (
              <Button
                isLoading={loading.withdraw}
                colorScheme="blue"
                onClick={handleWithdraw}
              >
                Withdraw
              </Button>
            )}
          </Box>
          <Box display="flex" gap={2}>
            {isDeadlinePassed && !finished && started && (
              <Button
                isLoading={loading.finish}
                colorScheme="red"
                onClick={handleFinish}
              >
                Finish
              </Button>
            )}
            {!finished && started && (
              <Button
                isLoading={loading.cancel}
                colorScheme="red"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
          </Box>
          <Box display="flex" gap={2}>
            {started && !finished && !newDeadline && (
              <Button
                isLoading={loading.proposeExtension}
                colorScheme="green"
                onClick={handleOpenModal}
              >
                Propose Extension
              </Button>
            )}
          </Box>
        </Box>
      </Flex>
    </>
  )
}

export default FreelancerPanel
