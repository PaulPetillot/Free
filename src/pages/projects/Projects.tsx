/* eslint-disable no-nested-ternary */
import { useAccount } from 'wagmi'

import { Box, Text, VStack } from '@chakra-ui/react'

import Layout from '../../components/layout/Layout'
import ProjectsList from '../../components/Projects-list/ProjectsList'
import { FREE_METHODS } from '../../utils/constants'
import useReadFree from '../../utils/hooks/useReadFree'

function Projects() {
  const { address } = useAccount()

  const { data: projects, isLoading } = useReadFree(
    FREE_METHODS.GET_PROJECTS_BY_ADDRESS,
    [address || '']
  )

  return (
    <Layout cta transparent title="My Projects">
      <Box>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : projects.length === 0 ? (
          <Text>No projects found.</Text>
        ) : (
          <VStack spacing={4} align="stretch">
            <ProjectsList projects={projects} />
          </VStack>
        )}
      </Box>
    </Layout>
  )
}

export default Projects
