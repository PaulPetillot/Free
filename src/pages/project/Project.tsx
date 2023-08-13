/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAccount, useContractEvent } from 'wagmi'

import {
  Box,
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
import ClientPanel from '../../components/panels/ClientPanel'
import FreelancerPanel from '../../components/panels/FreelancerPanel'
import {
  FREE_CONTRACT_ADDRESS,
  FREE_EVENTS,
  FREE_METHODS,
} from '../../utils/constants'
import { formatToAddress, isClientOrFreelancer } from '../../utils/general'
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
  const [targetRerender, setTargetRerender] = useState(0)
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
  const [data, setData] = useState({
    projectId: 0,
    quote: '',
    deadline: 0,
    newDeadline: 0,
    newQuote: '',
    started: false,
    finished: false,
    client: '',
    freelancer: '',
    startedAt: 0,
    freelancerBalance: 0,
    clientBalance: 0,
  })

  const { address } = useAccount()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { id } = useParams<ProjectProps>()

  const setDataFromResponse = (
    newData: [
      number,
      number,
      number,
      number,
      number,
      number,
      boolean,
      boolean,
      string,
      string,
      number
    ]
  ) => {
    setData({
      ...data,
      projectId: newData[0],
      quote: String(newData[1]),
      deadline: newData[2],
      newDeadline: newData[4],
      newQuote: String(newData[5]),
      started: newData[6],
      finished: newData[7],
      client: newData[8],
      freelancer: newData[9],
      startedAt: newData[10],
    })
  }

  const {
    data: projectData,
    isLoading,
    refetch: refetchProject,
  } = useReadFree(FREE_METHODS.PROJECT_BY_ID, [Number(id)])

  const { data: freelancerBalance, refetch: refetchFreelancerBalance } =
    useReadFree(FREE_METHODS.GET_FREELANCER_BALANCE, [Number(id)])
  const { data: clientBalance, refetch: refetchClientBalance } = useReadFree(
    FREE_METHODS.GET_CLIENT_BALANCE,
    [Number(id)]
  )

  const { claim } = useClaim(Number(id))
  const { withdraw } = useWithdraw(Number(id))
  const { cancel } = useCancel(Number(id))
  const { finish } = useFinish(Number(id))
  const { reject } = useReject(Number(id))

  const { acceptContract } = useAcceptProject(Number(data?.quote), Number(id))
  const { acceptExtension } = useAcceptExtend(
    Number(data?.newQuote),
    Number(id)
  )

  const isDeadlinePassed = data?.deadline && data?.deadline < Date.now() / 1000

  const profile =
    address &&
    isClientOrFreelancer(
      address,
      String(data?.client),
      String(data?.freelancer)
    )

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
    listener(logs) {
      if (formatToAddress(logs[0].topics[1]) !== address?.toLowerCase()) return

      toast({
        title: 'Funds claimed!',
        description: 'The funds have been claimed successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setLoading((prevState) => ({ ...prevState, claim: false }))
      refetchProject().then((res: any) => {
        setDataFromResponse(res.data)
        setTargetRerender((prevState) => prevState + 1)
      })
      refetchFreelancerBalance().then((res: any) => {
        setData((prevState) => ({ ...prevState, freelancerBalance: res.data }))
      })
      refetchClientBalance().then((res: any) => {
        setData((prevState) => ({ ...prevState, clientBalance: res.data }))
      })
      unwatchClaim?.()
    },
  })

  const unwatchWithdraw = useContractEvent({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    eventName: FREE_EVENTS.FUNDS_WITHDRAWN,
    listener(logs) {
      if (formatToAddress(logs[0].topics[1]) !== address?.toLowerCase()) return

      toast({
        title: 'Funds withdrawn!',
        description: 'The funds have been withdrawn successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setLoading((prevState) => ({ ...prevState, withdraw: false }))
      refetchProject().then((res: any) => {
        setDataFromResponse(res.data)
        setTargetRerender((prevState) => prevState + 1)
      })
      refetchFreelancerBalance().then((res: any) => {
        setData((prevState) => ({
          ...prevState,
          freelancerBalance: res.data,
        }))
      })
      refetchClientBalance().then((res: any) => {
        setData((prevState) => ({ ...prevState, clientBalance: res.data }))
      })
      unwatchWithdraw?.()
    },
  })

  const unwatchCancel = useContractEvent({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    eventName: FREE_EVENTS.PROJECT_CANCELLED,
    listener(logs) {
      if (formatToAddress(logs[0].topics[1]) !== address?.toLowerCase()) return

      toast({
        title: 'Project cancelled!',
        description: 'The funds have been sent to both parties successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setLoading((prevState) => ({ ...prevState, cancel: false }))
      refetchProject().then((res: any) => {
        setDataFromResponse(res.data)
        setTargetRerender((prevState) => prevState + 1)
      })
      refetchFreelancerBalance().then((res: any) => {
        setData((prevState) => ({
          ...prevState,
          freelancerBalance: res.data,
        }))
      })
      refetchClientBalance().then((res: any) => {
        setData((prevState) => ({ ...prevState, clientBalance: res.data }))
      })
      unwatchCancel?.()
    },
  })

  const unwatchFinish = useContractEvent({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    eventName: FREE_EVENTS.PROJECT_FINISHED,
    listener(logs) {
      if (
        formatToAddress(logs[0].topics[1]) !== address?.toLowerCase() ||
        formatToAddress(logs[0].topics[2]) !== address?.toLowerCase()
      )
        return

      toast({
        title: 'Project ended!',
        description: 'The funds have been sent to the freelancer successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setLoading((prevState) => ({ ...prevState, finish: false }))
      refetchProject().then((res: any) => {
        setDataFromResponse(res.data)
        setTargetRerender((prevState) => prevState + 1)
      })
      refetchFreelancerBalance().then((res: any) => {
        setData((prevState) => ({
          ...prevState,
          freelancerBalance: res.data,
        }))
      })
      refetchClientBalance().then((res: any) => {
        setData((prevState) => ({ ...prevState, clientBalance: res.data }))
      })
      unwatchFinish?.()
    },
  })

  const unwatchReject = useContractEvent({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    eventName: FREE_EVENTS.PROJECT_REJECTED,
    listener(logs) {
      if (formatToAddress(logs[0].topics[1]) !== address?.toLowerCase()) return

      toast({
        title: 'Project rejected!',
        description: 'The project has been rejected successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setLoading((prevState) => ({ ...prevState, reject: false }))
      refetchProject().then((res: any) => {
        setDataFromResponse(res.data)
        setTargetRerender((prevState) => prevState + 1)
      })
      refetchFreelancerBalance().then((res: any) => {
        setData((prevState) => ({
          ...prevState,
          freelancerBalance: res.data,
        }))
      })
      refetchClientBalance().then((res: any) => {
        setData((prevState) => ({ ...prevState, clientBalance: res.data }))
      })
      unwatchReject?.()
    },
  })

  const unwatchAcceptContract = useContractEvent({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    eventName: FREE_EVENTS.PROJECT_STARTED,
    listener(logs) {
      if (
        formatToAddress(logs[0].topics[1]) !== address?.toLowerCase() ||
        formatToAddress(logs[0].topics[2]) !== address?.toLowerCase()
      )
        return

      toast({
        title: 'Project started!',
        description:
          "The funds have been sent to the project's balance successfully.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setLoading((prevState) => ({ ...prevState, acceptContract: false }))
      refetchProject().then((res: any) => {
        setDataFromResponse(res.data)
        setTargetRerender((prevState) => prevState + 1)
      })
      refetchFreelancerBalance().then((res: any) => {
        setData((prevState) => ({
          ...prevState,
          freelancerBalance: res.data,
        }))
      })
      refetchClientBalance().then((res: any) => {
        setData((prevState) => ({ ...prevState, clientBalance: res.data }))
      })
      unwatchAcceptContract?.()
    },
  })

  const unwatchAcceptExtension = useContractEvent({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    eventName: FREE_EVENTS.DEADLINE_EXTENDED,
    listener(logs) {
      if (formatToAddress(logs[0].topics[1]) !== address?.toLowerCase()) return
      toast({
        title: 'Project extended!',
        description: "The project's deadline has been extended successfully.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setLoading((prevState) => ({ ...prevState, acceptExtension: false }))
      refetchProject().then((res: any) => {
        setDataFromResponse(res.data)
        setTargetRerender((prevState) => prevState + 1)
      })
      refetchFreelancerBalance().then((res: any) => {
        setData((prevState) => ({
          ...prevState,
          freelancerBalance: res.data,
        }))
      })
      refetchClientBalance().then((res: any) => {
        setData((prevState) => ({ ...prevState, clientBalance: res.data }))
      })
      unwatchAcceptExtension?.()
    },
  })

  const unwatchProposeExtension = useContractEvent({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    eventName: FREE_EVENTS.NEW_DEADLINE_PROPOSED,
    listener(logs) {
      if (formatToAddress(logs[0].topics[1]) !== address?.toLowerCase()) return

      toast({
        title: 'Extension proposed!',
        description: "It's waiting for the client's approval.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setLoading((prevState) => ({ ...prevState, proposeExtension: false }))
      refetchProject().then((res: any) => {
        setDataFromResponse(res.data)
        setTargetRerender((prevState) => prevState + 1)
      })
      refetchFreelancerBalance().then((res: any) => {
        setData((prevState) => ({
          ...prevState,
          freelancerBalance: res.data,
        }))
      })
      refetchClientBalance().then((res: any) => {
        setData((prevState) => ({ ...prevState, clientBalance: res.data }))
      })
      unwatchProposeExtension?.()
    },
  })

  useEffect(() => {
    if (projectData) {
      setDataFromResponse(projectData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectData])

  let content
  if (isLoading) {
    content = (
      <Flex alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Flex>
    )
  } else if (data) {
    content =
      profile === PROFILES.FREELANCER ? (
        <FreelancerPanel
          quote={data?.quote}
          deadline={data?.deadline}
          freelancerBalance={freelancerBalance}
          client={String(data?.client)}
          started={Boolean(data?.started)}
          finished={Boolean(data?.finished)}
          loading={loading}
          isDeadlinePassed={Boolean(isDeadlinePassed)}
          handleClaim={handleClaim}
          handleWithdraw={handleWithdraw}
          handleCancel={handleCancel}
          handleFinish={handleFinish}
          handleOpenModal={handleOpenModal}
          startedAt={data?.startedAt}
          newDeadline={data?.newDeadline}
          key={targetRerender}
        />
      ) : (
        <ClientPanel
          quote={data?.quote}
          deadline={data?.deadline}
          clientBalance={clientBalance}
          freelancer={String(data?.freelancer)}
          started={Boolean(data?.started)}
          finished={Boolean(data?.finished)}
          loading={loading}
          isDeadlinePassed={Boolean(isDeadlinePassed)}
          handleAcceptContract={handleAcceptContract}
          handleReject={handleReject}
          handleCancel={handleCancel}
          handleFinish={handleFinish}
          handleAcceptExtension={handleAcceptExtension}
          startedAt={data?.startedAt}
          newDeadline={data?.newDeadline}
          newQuote={data?.newQuote}
        />
      )
  } else {
    content = (
      <Text color="gray.600" fontSize="lg">
        No project found with ID {id}
      </Text>
    )
  }

  return (
    <Layout title="">
      <Box p={4}>
        <Heading color="black">Project {id}</Heading>
        {content}
      </Box>
      <ExtensionModal
        currentDeadline={Number(data?.deadline)}
        isOpen={isOpen}
        onClose={handleCloseModal}
        id={Number(data?.projectId)}
      />
    </Layout>
  )
}

export default Project
