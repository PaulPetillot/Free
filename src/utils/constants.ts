export const FREE_CONTRACT_ADDRESS =
  '0x275aA836f153F8839Fa0E5Abf055d2CEC4bA08eE'

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
