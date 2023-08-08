import { Box, VStack } from '@chakra-ui/react'

import { calculateCompletion } from '../../utils/general'
import { Project as TProject } from '../../utils/types'
import Project from '../project-row/ProjectRow'

type ProjectsProps = {
  projects: TProject[]
}

function Projects({ projects }: ProjectsProps) {
  return (
    <Box width={600}>
      {projects.length === 0 ? (
        <Box>No projects found.</Box>
      ) : (
        <VStack spacing={4} align="stretch">
          {projects.map((project: TProject) => (
            <Project
              key={project.id}
              progress={calculateCompletion(
                BigInt(project.startedAt),
                BigInt(project.deadline)
              )}
              {...project}
            />
          ))}
        </VStack>
      )}
    </Box>
  )
}

export default Projects
