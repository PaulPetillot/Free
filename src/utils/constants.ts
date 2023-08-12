export const FREE_CONTRACT_ADDRESS =
  '0x4C1bbC15f27E385D0159af95A4dec303B63203B3'

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
