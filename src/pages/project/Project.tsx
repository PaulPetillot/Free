/* eslint-disable no-nested-ternary */
import { formatEther } from 'ethers'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAccount, useContractEvent } from 'wagmi'

import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'

import { abi as freeAbi } from '../../../foundry/out/Free.sol/Free.json'
import ExtensionModal from '../../components/extension-modal/ExtensionModal'
import Layout from '../../components/layout/Layout'
import {
  FREE_CONTRACT_ADDRESS,
  FREE_EVENTS,
  FREE_METHODS,
} from '../../utils/constants'
import { isClientOrFreelancer } from '../../utils/general'
import useAcceptExtend from '../../utils/hooks/useAcceptExtend'
import useAcceptProject from '../../utils/hooks/useAcceptProject'
import useCancel from '../../utils/hooks/useCancel'
import useClaim from '../../utils/hooks/useClaim'
import useFinish from '../../utils/hooks/useFinish'
import useReadFree from '../../utils/hooks/useReadFree'
import useReject from '../../utils/hooks/useReject'
import useWithdraw from '../../utils/hooks/useWithdraw'
import { PROFILES } from '../../utils/types'

type ProjectProps = {
  id: string
}

function Project() {
  const [loading, setLoading] = useState({
    claim: false,
    withdraw: false,
    cancel: false,
    finish: false,
    reject: false,
    acceptContract: false,
    acceptExtension: false,
    proposeExtension: false,
  })
  const { address } = useAccount()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
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
  const { cancel } = useCancel(Number(id))
  const { finish } = useFinish(Number(id))
  const { reject } = useReject(Number(id))

  const [
    projectId,
    quote,
    deadline,
    ,
    newDeadline,
    newQuote,
    started,
    finished,
    client,
    freelancer,
    startedAt,
  ] = data || []

  const { acceptContract } = useAcceptProject(quote, Number(id))
  const { acceptExtension } = useAcceptExtend(newQuote, Number(id))

  const isDeadlinePassed = deadline && deadline < Date.now() / 1000

  const profile = address && isClientOrFreelancer(address, client, freelancer)

  // handle interactions

  const handleClaim = () => {
    setLoading((prevState) => ({ ...prevState, claim: true }))
    claim()
  }

  const handleWithdraw = () => {
    setLoading((prevState) => ({ ...prevState, withdraw: true }))
    withdraw()
  }

  const handleCancel = () => {
    setLoading((prevState) => ({ ...prevState, cancel: true }))
    cancel()
  }

  const handleFinish = () => {
    setLoading((prevState) => ({ ...prevState, finish: true }))
    finish()
  }

  const handleReject = () => {
    setLoading((prevState) => ({ ...prevState, reject: true }))
    reject()
  }

  const handleAcceptContract = () => {
    setLoading((prevState) => ({ ...prevState, acceptContract: true }))
    acceptContract()
  }

  const handleAcceptExtension = () => {
    setLoading((prevState) => ({ ...prevState, acceptExtension: true }))
    acceptExtension()
  }

  const handleOpenModal = () => {
    setLoading((prevState) => ({ ...prevState, proposeExtension: true }))
    onOpen()
  }

  const handleCloseModal = () => {
    setLoading((prevState) => ({ ...prevState, proposeExtension: false }))
    onClose()
  }
  // Events listeners

  const unwatchClaim = useContractEvent({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    eventName: FREE_EVENTS.FUNDS_CLAIMED,
    listener() {
      toast({
        title: 'Funds claimed!',
        description: 'The funds have been claimed successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setLoading((prevState) => ({ ...prevState, claim: false }))
      unwatchClaim?.()
    },
  })

  const unwatchWithdraw = useContractEvent({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    eventName: FREE_EVENTS.FUNDS_WITHDRAWN,
    listener() {
      toast({
        title: 'Funds withdrawn!',
        description: 'The funds have been withdrawn successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setLoading((prevState) => ({ ...prevState, withdraw: false }))
      unwatchWithdraw?.()
    },
  })

  const unwatchCancel = useContractEvent({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    eventName: FREE_EVENTS.PROJECT_CANCELLED,
    listener() {
      toast({
        title: 'Project cancelled!',
        description: 'The funds have been sent to both parties successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setLoading((prevState) => ({ ...prevState, cancel: false }))
      unwatchCancel?.()
    },
  })

  const unwatchFinish = useContractEvent({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    eventName: FREE_EVENTS.PROJECT_FINISHED,
    listener() {
      toast({
        title: 'Project ended!',
        description: 'The funds have been sent to the freelancer successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setLoading((prevState) => ({ ...prevState, finish: false }))
      unwatchFinish?.()
    },
  })

  const unwatchReject = useContractEvent({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    eventName: FREE_EVENTS.PROJECT_REJECTED,
    listener() {
      toast({
        title: 'Project rejected!',
        description: 'The project has been rejected successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setLoading((prevState) => ({ ...prevState, reject: false }))
      unwatchReject?.()
    },
  })

  const unwatchAcceptContract = useContractEvent({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    eventName: FREE_EVENTS.PROJECT_STARTED,
    listener() {
      toast({
        title: 'Project started!',
        description:
          "The funds have been sent to the project's balance successfully.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setLoading((prevState) => ({ ...prevState, acceptContract: false }))
      unwatchAcceptContract?.()
    },
  })

  const unwatchAcceptExtension = useContractEvent({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    eventName: FREE_EVENTS.DEADLINE_EXTENDED,
    listener() {
      toast({
        title: 'Project extended!',
        description: "The project's deadline has been extended successfully.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setLoading((prevState) => ({ ...prevState, acceptExtension: false }))
      unwatchAcceptExtension?.()
    },
  })

  const unwatchProposeExtension = useContractEvent({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    eventName: FREE_EVENTS.NEW_DEADLINE_PROPOSED,
    listener() {
      toast({
        title: 'Extension proposed!',
        description: "It's waiting for the client's approval.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setLoading((prevState) => ({ ...prevState, proposeExtension: false }))
      unwatchProposeExtension?.()
    },
  })
  // The panel shown to the user depends on the profile
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
              <Button colorScheme="blue" onClick={handleAcceptContract}>
                Accept
              </Button>

              <Button colorScheme="red" onClick={handleReject}>
                Reject
              </Button>
            </Box>
          )}

          <Box display="flex" gap={2}>
            {started && !finished && isDeadlinePassed && (
              <Button colorScheme="red" onClick={handleFinish}>
                Finish
              </Button>
            )}
            {started && !finished && (
              <Button colorScheme="red" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </Box>
          <Box display="flex" gap={2}>
            {newDeadline && (
              <Button colorScheme="green" onClick={handleAcceptExtension}>
                Accept Extension
              </Button>
            )}
          </Box>
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
      <ExtensionModal
        currentDeadline={deadline}
        isOpen={isOpen}
        onClose={handleCloseModal}
        id={projectId}
      />
    </Layout>
  )
}

export default Project
