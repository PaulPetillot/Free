import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'

import Layout from '../../components/layout/Layout'
import ProjectsList from '../../components/Projects-list/ProjectsList'
import { FREE_METHODS } from '../../utils/constants'
import useReadFree from '../../utils/hooks/useReadFree'
import ROUTES from '../../utils/routes'

function Projects() {
  const { address } = useAccount()
  const navigate = useNavigate()
  const { data: projects, isLoading } = useReadFree(
    FREE_METHODS.GET_PROJECTS_BY_ADDRESS,
    [address || '']
  )

  const renderContent = () => {
    if (isLoading) {
      return <Text>Loading...</Text>
    }
    if (projects.length === 0) {
      return (
        <VStack spacing={4}>
          <Heading color="black" fontSize="4xl">
            You haven&apos;t created any projects yet.
          </Heading>
          <Button
            mt={8}
            colorScheme="blue"
            padding={6}
            onClick={() => {
              navigate(ROUTES.CREATE_PROJECT)
            }}
          >
            Create Your First Project
          </Button>
        </VStack>
      )
    }
    return (
      <VStack spacing={4} align="stretch">
        <ProjectsList projects={projects} />
      </VStack>
    )
  }

  return (
    <Layout
      cta={projects && projects.length > 0}
      transparent
      title="My Projects"
    >
      <Box>{renderContent()}</Box>
    </Layout>
  )
}

export default Projects
