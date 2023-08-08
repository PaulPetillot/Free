import { isAddress, parseEther } from 'ethers'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount, useContractEvent, useContractWrite } from 'wagmi'

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'

import { abi as freeAbi } from '../../../foundry/out/Free.sol/Free.json'
import Layout from '../../components/layout/Layout'
import { FREE_CONTRACT_ADDRESS, FREE_METHODS } from '../../utils/constants'
import ROUTES from '../../utils/routes'

interface FormData {
  quote: number
  deadline: string
  client: string
}

interface FormErrors {
  quote?: string
  deadline?: string
  client?: string
}

function CreateProject() {
  const navigate = useNavigate()
  const { isConnected } = useAccount()
  const toast = useToast()
  const { isLoading, write } = useContractWrite({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    functionName: FREE_METHODS.CREATE_PROJECT,
  })

  const [formData, setFormData] = useState<FormData>({
    quote: 0,
    deadline: '',
    client: '',
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleQuoteChange = (value: string) => {
    setFormData((prevState) => ({ ...prevState, quote: parseFloat(value) }))
  }

  const handleDeadlineChange = (date: string) => {
    setFormData((prevState) => ({ ...prevState, deadline: date }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const errors: FormErrors = {}

    if (!formData.quote) {
      errors.quote = 'Quote is required'
    }

    if (!formData.deadline) {
      errors.deadline = 'Deadline is required'
    }

    if (!formData.client) {
      errors.client = 'Client address is required'
    }

    if (formData.client && !isAddress(formData.client)) {
      errors.client = 'Client address is invalid'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    setFormErrors({})

    const formattedQuote = parseEther(formData.quote.toString())
    const deadlineToUnix = Math.floor(
      new Date(formData.deadline).getTime() / 1000
    )

    write({
      args: [formattedQuote, deadlineToUnix, formData.client],
    })
  }

  useContractEvent({
    address: FREE_CONTRACT_ADDRESS,
    abi: freeAbi,
    eventName: 'ProjectCreated',
    listener() {
      toast({
        title: 'Project created',
        description: 'A new project has been created!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setTimeout(() => {
        navigate(ROUTES.PROJECTS)
      }, 3000)
    },
  })

  return (
    <Layout title="Create a Project">
      {isConnected ? (
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl id="quote" isInvalid={!!formErrors.quote}>
              <FormLabel color="black">Quote (in ether)</FormLabel>
              <Input
                type="number"
                borderColor="black"
                color="black"
                name="quote"
                value={formData.quote}
                onChange={(e) => handleQuoteChange(e.target.value)}
                isRequired
              />
              {formErrors.quote && (
                <FormErrorMessage>{formErrors.quote}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl id="deadline" isInvalid={!!formErrors.deadline}>
              <FormLabel color="black">Deadline</FormLabel>
              <Input
                type="date"
                borderColor="black"
                color="black"
                value={formData.deadline || ''}
                onChange={(e) => handleDeadlineChange(e.target.value)}
                isRequired
              />
              {formErrors.deadline && (
                <FormErrorMessage>{formErrors.deadline}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl id="client" isInvalid={!!formErrors.client}>
              <FormLabel color="black">Client Address</FormLabel>
              <Input
                type="text"
                borderColor="black"
                name="client"
                color="black"
                value={formData.client || ''}
                onChange={handleInputChange}
                isRequired
              />
              {formErrors.client && (
                <FormErrorMessage>{formErrors.client}</FormErrorMessage>
              )}
            </FormControl>

            <Button
              marginTop={4}
              type="submit"
              colorScheme="pink"
              size="lg"
              color="white"
              fontSize="md"
              fontWeight="bold"
              letterSpacing="wide"
              boxShadow="md"
              _hover={{ boxShadow: 'lg' }}
              loadingText="Submitting"
              isLoading={isLoading}
            >
              Submit
            </Button>
          </VStack>
        </form>
      ) : (
        <Text color="black">Connect your wallet to create a project</Text>
      )}
    </Layout>
  )
}

export default CreateProject
