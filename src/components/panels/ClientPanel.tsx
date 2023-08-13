/* eslint-disable no-nested-ternary */
import { formatEther } from 'ethers'

import { Box, Button, Flex, Text } from '@chakra-ui/react'

interface ClientPanelProps {
  started: boolean
  startedAt: number | undefined
  quote: string | undefined
  deadline: number | undefined
  clientBalance: string | undefined
  freelancer: string
  finished: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loading: any
  handleReject: () => void
  handleAcceptContract: () => void
  handleAcceptExtension: () => void
  newDeadline: number | undefined
  handleCancel: () => void
  handleFinish: () => void
  isDeadlinePassed: boolean
  newQuote: string | undefined
}

function ClientPanel({
  startedAt,
  started,
  quote,
  deadline,
  finished,
  loading,
  freelancer,
  newQuote,
  clientBalance,
  isDeadlinePassed,
  newDeadline,
  handleCancel,
  handleReject,
  handleAcceptExtension,
  handleFinish,
  handleAcceptContract,
}: ClientPanelProps) {
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
                Balance left: {formatEther(clientBalance)} ETH
              </Text>
            )}
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Text color="gray.600" fontSize="lg">
              Freelancer: {freelancer}
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

        {newDeadline && (
          <Box
            justifyContent="center"
            alignContent="center"
            backgroundColor="gray.100"
            p={3}
            borderRadius={5}
            display="flex"
            gap={1}
            boxShadow="md"
          >
            <Text fontWeight="semibold " color="gray.600" fontSize="lg">
              New Deadline for the{' '}
              {new Date(Number(newDeadline) * 1000).toLocaleString()} proposed!
              It requires an additional payment of{' '}
              {newQuote && formatEther(newQuote)} ETH.
            </Text>
          </Box>
        )}

        <Box paddingTop={5} display="flex" gap={10}>
          {!started && (
            <Box display="flex" gap={2}>
              <Button
                isLoading={loading.acceptContract}
                colorScheme="blue"
                onClick={handleAcceptContract}
              >
                Accept
              </Button>

              <Button
                isLoading={loading.reject}
                colorScheme="red"
                onClick={handleReject}
              >
                Reject
              </Button>
            </Box>
          )}

          <Box display="flex" gap={2}>
            {started && !finished && isDeadlinePassed && (
              <Button
                isLoading={loading.finish}
                colorScheme="red"
                onClick={handleFinish}
              >
                Finish
              </Button>
            )}
            {started && !finished && (
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
            {newDeadline && (
              <Button
                isLoading={loading.acceptExtension}
                colorScheme="green"
                onClick={handleAcceptExtension}
              >
                Accept Extension
              </Button>
            )}
          </Box>
        </Box>
      </Flex>
    </>
  )
}

export default ClientPanel
