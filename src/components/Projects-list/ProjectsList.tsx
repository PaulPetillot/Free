import { useAccount } from 'wagmi'

import { Box, VStack } from '@chakra-ui/react'

import { calculateCompletion } from '../../utils/general'
import { Project as TProject } from '../../utils/types'
import ProjectRow from '../project-row/ProjectRow'

type ProjectsProps = {
  projects: TProject[]
}

function ProjectsList({ projects }: ProjectsProps) {
  const { address } = useAccount()

  const projectAsClient = projects.filter(
    (project: TProject) => project.client === address
  )

  const projectAsFreelancer = projects.filter(
    (project: TProject) => project.freelancer === address
  )

  return (
    <Box width={600}>
      {projects.length === 0 ? (
        <Box>No projects found.</Box>
      ) : (
        <VStack spacing={4} align="stretch">
          {projectAsFreelancer.length > 0 && (
            <>
              <Box fontWeight="bold">As Freelancer</Box>
              {projectAsFreelancer.map((project: TProject) => (
                <ProjectRow
                  key={project.id}
                  progress={calculateCompletion(
                    BigInt(project.startedAt),
                    BigInt(project.deadline)
                  )}
                  {...project}
                />
              ))}
            </>
          )}
          {projectAsClient.length > 0 && (
            <>
              <Box fontWeight="bold">As Client</Box>
              {projectAsClient.map((project: TProject) => (
                <ProjectRow
                  key={project.id}
                  progress={calculateCompletion(
                    BigInt(project.startedAt),
                    BigInt(project.deadline)
                  )}
                  {...project}
                />
              ))}
            </>
          )}
        </VStack>
      )}
    </Box>
  )
}

export default ProjectsList
