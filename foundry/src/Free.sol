// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct Project {
  uint32 id;
  uint256 quote;
  uint256 deadline;
  uint256 lastClaimed;
  uint256 newProposedDeadline;
  uint256 newFreelancerQuote;
  bool started;
  bool finished;
  address payable client;
  address payable freelancer;
  uint256 startedAt;
  string title;
}

struct Balances {
  uint256 client;
  uint256 freelancer;
}

contract Free {
  uint32 currentId = 0;
  mapping(uint32 => Project) public projectById;
  mapping(address => uint32[]) public projectIdsByClient;
  mapping(address => uint32[]) public projectIdsByAddress;
  mapping(uint32 => Balances) public balancesByProject;

  event ProjectCreated(
    uint32 id,
    address indexed client,
    address indexed freelancer
  );
  event ProjectStarted(
    uint32 id,
    address indexed client,
    address indexed freelancer
  );
  event ProjectFinished(
    uint32 id,
    address indexed client,
    address indexed freelancer
  );
  event FundsClaimed(uint256 amount, address indexed claimer);
  event FundsWithdrawn(uint256 amount, address indexed withdrawer);
  event NewDeadlineProposed(
    uint32 projectId,
    uint256 newProposedDeadline,
    address indexed proposer,
    uint256 newFreelancerQuote
  );
  event DeadlineExtended(
    uint32 projectId,
    uint256 newProposedDeadline,
    address indexed accepter
  );
  event ProjectCancelled(uint32 projectId, address indexed canceller);
  event ProjectRejected(uint32 projectId, address indexed rejecter);

  modifier onlyClient(uint32 projectId) {
    require(
      projectById[projectId].client == msg.sender,
      'Only the client can perform this operation'
    );
    _;
  }

  modifier onlyFreelancer(uint32 projectId) {
    require(
      projectById[projectId].freelancer == msg.sender,
      'Only the freelancer can perform this operation'
    );
    _;
  }

  modifier projectNotStarted(uint32 projectId) {
    require(
      projectById[projectId].started == false,
      'The project has already been started'
    );
    _;
  }

  modifier projectStarted(uint32 projectId) {
    require(
      projectById[projectId].started == true,
      'The project has not been started yet'
    );
    _;
  }

  modifier projectNotFinished(uint32 projectId) {
    require(
      projectById[projectId].finished == false,
      'The project has already been finished'
    );
    _;
  }

  function getProjectsByAddress(
    address addr
  ) external view returns (Project[] memory) {
    uint256 length = projectIdsByAddress[addr].length;

    Project[] memory projects = new Project[](length);

    for (uint256 i = 0; i < length; i++) {
      projects[i] = projectById[projectIdsByAddress[addr][i]];
    }

    return projects;
  }

  function getClientBalance(uint32 projectId) public view returns (uint256) {
    return balancesByProject[projectId].client;
  }

  function getFreelancerBalance(
    uint32 projectId
  ) public view returns (uint256) {
    return balancesByProject[projectId].freelancer;
  }

  function createProject(
    uint256 quote,
    uint256 deadline,
    address payable client,
    string memory title
  ) public returns (uint32 projectId) {
    require(quote > 0, 'Quote must be greater than 0');
    require(deadline > block.timestamp, 'Deadline must be in the future');
    require(client != address(0), 'Client address must be a valid address');

    currentId++;

    Project memory project = Project({
      id: currentId,
      quote: quote,
      deadline: deadline,
      client: payable(client),
      freelancer: payable(msg.sender),
      started: false,
      finished: false,
      lastClaimed: block.timestamp,
      startedAt: block.timestamp,
      newProposedDeadline: 0,
      newFreelancerQuote: 0,
      title: title
    });

    projectId = currentId;
    projectIdsByAddress[client].push(projectId);
    projectIdsByAddress[msg.sender].push(projectId);
    projectById[projectId] = project;

    emit ProjectCreated(projectId, client, msg.sender);
  }

  function acceptAndStartProject(
    uint32 projectId
  ) external payable onlyClient(projectId) {
    Project storage project = projectById[projectId];
    require(project.started == false, 'The project has already been started');
    require(
      project.quote == msg.value,
      'The amount sent must be equal to the quote'
    );

    balancesByProject[projectId].client = msg.value;
    balancesByProject[projectId].freelancer = 0;

    project.started = true;
    project.startedAt = block.timestamp;
    project.lastClaimed = block.timestamp;

    emit ProjectStarted(projectId, msg.sender, project.freelancer);
  }

  function rejectProject(
    uint32 projectId
  )
    external
    onlyClient(projectId)
    projectNotStarted(projectId)
    projectNotFinished(projectId)
  {
    Project storage project = projectById[projectId];

    project.finished = true;

    emit ProjectRejected(projectId, msg.sender);
  }

  function finishProject(
    uint32 projectId
  ) public projectNotFinished(projectId) projectStarted(projectId) {
    Project storage project = projectById[projectId];
    require(
      block.timestamp > projectById[projectId].deadline,
      'The project deadline has not been reached yet'
    );
    require(
      project.client == msg.sender || project.freelancer == msg.sender,
      'Only the client or freelancer can cancel the project'
    );

    project.finished = true;
    uint256 amountToClaim = getClientBalance(projectId);
    require(
      balancesByProject[projectId].client >= amountToClaim,
      "Claim amount exceeds client's balance"
    );

    balancesByProject[projectId].freelancer += amountToClaim;
    balancesByProject[projectId].client -= amountToClaim;
    project.lastClaimed = block.timestamp;

    emit ProjectFinished(projectId, project.client, project.freelancer);
  }

  function claim(
    uint32 projectId
  ) public projectNotFinished(projectId) projectStarted(projectId) {
    Project storage project = projectById[projectId];
    require(
      project.client == msg.sender || project.freelancer == msg.sender,
      'Only the client or freelancer can cancel the project'
    );
    uint amountToClaim = 0;

    if (block.timestamp > project.deadline) {
      finishProject(projectId);

      emit FundsClaimed(amountToClaim, project.freelancer);
    } else {
      uint256 totalTime = project.deadline - project.startedAt;
      uint256 timeElapsed = block.timestamp - project.lastClaimed;
      uint256 totalFunds = project.quote;

      amountToClaim = (timeElapsed * totalFunds) / totalTime;

      require(
        balancesByProject[projectId].client >= amountToClaim,
        "Claim amount exceeds client's balance"
      );

      balancesByProject[projectId].freelancer += amountToClaim;
      balancesByProject[projectId].client -= amountToClaim;
      project.lastClaimed = block.timestamp;

      emit FundsClaimed(amountToClaim, msg.sender);
    }
  }

  function withdraw(uint32 projectId) external onlyFreelancer(projectId) {
    require(
      getFreelancerBalance(projectId) > 0,
      'You have no funds to withdraw'
    );

    uint256 amountToWithdraw = getFreelancerBalance(projectId);
    balancesByProject[projectId].freelancer = 0;

    (bool sent, ) = msg.sender.call{value: amountToWithdraw}('');
    require(sent, 'Failed to send Ether');

    emit FundsWithdrawn(amountToWithdraw, msg.sender);
  }

  function cancelProject(
    uint32 projectId
  ) public projectStarted(projectId) projectNotFinished(projectId) {
    Project storage project = projectById[projectId];
    require(
      project.client == msg.sender || project.freelancer == msg.sender,
      'Only the client or freelancer can cancel the project'
    );

    (bool clientSent, ) = project.client.call{
      value: getClientBalance(projectId)
    }('');
    require(clientSent, 'Failed to send Ether');

    (bool freelancerSent, ) = project.freelancer.call{
      value: getFreelancerBalance(projectId)
    }('');
    require(freelancerSent, 'Failed to send Ether');

    balancesByProject[projectId].client = 0;
    balancesByProject[projectId].freelancer = 0;

    project.finished = true;
    emit ProjectCancelled(projectId, msg.sender);
  }

  function requestExtendDeadline(
    uint32 projectId,
    uint256 newDeadline,
    uint256 amountToAdd
  )
    external
    onlyFreelancer(projectId)
    projectStarted(projectId)
    projectNotFinished(projectId)
  {
    Project storage project = projectById[projectId];
    require(
      newDeadline > project.deadline,
      'The new deadline must be greater than the current deadline'
    );

    project.newProposedDeadline = newDeadline;
    project.newFreelancerQuote = amountToAdd;

    emit NewDeadlineProposed(projectId, newDeadline, msg.sender, amountToAdd);
  }

  function acceptNewDeadline(
    uint32 projectId
  )
    external
    payable
    onlyClient(projectId)
    projectStarted(projectId)
    projectNotFinished(projectId)
  {
    Project storage project = projectById[projectId];
    require(
      project.newFreelancerQuote == msg.value,
      'The amount sent must be equal to the new freelancer quote'
    );

    claim(projectId);

    uint amountClaimedByFreelancer = getFreelancerBalance(projectId);
    uint newQuote = (project.quote - amountClaimedByFreelancer) +
      project.newFreelancerQuote;

    project.deadline = project.newProposedDeadline;
    project.startedAt = block.timestamp;
    project.quote = newQuote;
    balancesByProject[projectId].client += msg.value;

    project.newProposedDeadline = 0;
    project.newFreelancerQuote = 0;

    emit DeadlineExtended(projectId, project.deadline, msg.sender);
  }
}
