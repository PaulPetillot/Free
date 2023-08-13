export const FREE_CONTRACT_ADDRESS =
  '0x3203F5caDb5672a95aDbB6eCC287f890E9b569a9'

export enum FREE_METHODS {
  // READ
  BALANCE_BY_PROJECT = 'balanceByProject',
  GET_CLIENT_BALANCE = 'getClientBalance',
  GET_FREELANCER_BALANCE = 'getFreelancerBalance',
  GET_PROJECTS_BY_ADDRESS = 'getProjectsByAddress',
  PROJECT_BY_ID = 'projectById',
  // WRITE
  ACCEPT_AND_START_PROJECT = 'acceptAndStartProject',
  ACCEPT_NEW_DEADLINE = 'acceptNewDeadline',
  CANCEL_PROJECT = 'cancelProject',
  CLAIM = 'claim',
  CREATE_PROJECT = 'createProject',
  FINISH_PROJECT = 'finishProject',
  REJECT_PROJECT = 'rejectProject',
  REQUEST_EXTEND_DEADLINE = 'requestExtendDeadline',
  WITHDRAW = 'withdraw',
}

export enum FREE_EVENTS {
  PROJECT_CREATED = 'ProjectCreated',
  PROJECT_STARTED = 'ProjectStarted',
  PROJECT_FINISHED = 'ProjectFinished',
  FUNDS_CLAIMED = 'FundsClaimed',
  FUNDS_WITHDRAWN = 'FundsWithdrawn',
  NEW_DEADLINE_PROPOSED = 'NewDeadlineProposed',
  DEADLINE_EXTENDED = 'DeadlineExtended',
  PROJECT_CANCELLED = 'ProjectCancelled',
  PROJECT_REJECTED = 'ProjectRejected',
}
