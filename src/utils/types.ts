export interface Project {
  id: number
  quote: number
  deadline: number
  lastClaimed: number
  newProposedDeadline: number
  newFreelancerQuote: number
  started: boolean
  finished: boolean
  client: string
  freelancer: string
  startedAt: number
  title: string
}

export enum PROFILES {
  CLIENT = 'client',
  FREELANCER = 'freelancer',
}
