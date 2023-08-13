// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import '../src/Free.sol';
import 'forge-std/Test.sol';

contract FreeTest is Test {
  Free public free;
  address freelancer;
  address client;

  event ProjectCreated(
    uint32 id,
    address indexed client,
    address indexed freelancer
  );

  function setUp() public {
    free = new Free();
    freelancer = vm.addr(1);
    client = vm.addr(2);
    vm.deal(freelancer, 2 ether);
    vm.deal(client, 2 ether);
  }

  function createProject(uint256 end) public returns (uint32 projectId) {
    vm.prank(freelancer);

    projectId = free.createProject(
      1 ether,
      block.timestamp + end,
      payable(client),
      'test'
    );
  }

  // Create project
  function test_CreateProject() public {
    uint32 projectId = createProject(1 days);

    (
      uint32 id,
      uint256 quote,
      uint256 deadline,
      uint256 lastClaimed,
      uint256 newProposedDeadline,
      uint256 newFreelancerQuote,
      bool started,
      bool finished,
      address payable clientAddress,
      address payable freelancerAddress,
      uint256 startedAt,
      string memory title
    ) = free.projectById(projectId);

    assertEq(projectId, 1);
    assertEq(id, 1);
    assertEq(quote, 1 ether);
    assertEq(deadline, block.timestamp + 1 days);
    assertEq(lastClaimed, block.timestamp);
    assertEq(newProposedDeadline, 0);
    assertEq(newFreelancerQuote, 0);
    assertEq(started, false);
    assertEq(finished, false);
    assertEq(clientAddress, client);
    assertEq(freelancerAddress, freelancer);
    assertEq(startedAt, block.timestamp);
    assertEq(title, 'test');
  }

  // Fail create project
  function testFail_CannotAddNoQuote() public {
    free.createProject(
      0,
      block.timestamp + 1 days,
      payable(freelancer),
      'test'
    );
    vm.expectRevert('Quote must be greater than 0');
  }

  function testFail_CannotAddNoDeadline() public {
    free.createProject(1 ether, 0, payable(freelancer), 'test');
    vm.expectRevert('Deadline must be in the future');
  }

  function testFail_CannotAddNoFreelancer() public {
    free.createProject(
      1 ether,
      block.timestamp + 1 days,
      payable(address(0)),
      'test'
    );
    vm.expectRevert('Client address must be a valid address');
  }

  // Accept and start project
  function test_acceptAndStartProject() public {
    uint32 projectId = createProject(1 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);

    (, , , uint256 lastClaimed, , , bool started, , , , , ) = free.projectById(
      projectId
    );

    uint256 freelancerBalance = free.getFreelancerBalance(projectId);
    uint256 clientBalance = free.getClientBalance(projectId);

    assertEq(lastClaimed, block.timestamp);
    assertEq(started, true);
    assertEq(freelancerBalance, 0);
    assertEq(clientBalance, 1 ether);
  }

  // Fail accept and start project
  function testFail_cannotSendDifferentQuote() public {
    uint32 projectId = createProject(1 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 2 ether}(projectId);
    vm.expectRevert('The amount sent must be equal to the quote');
  }

  function testFail_cannotStartTwice() public {
    uint32 projectId = createProject(1 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);
    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);
    vm.expectRevert('The project has already been started');
  }

  //Reject a project
  function test_rejectProject() public {
    uint32 projectId = createProject(1 days);

    vm.prank(client);
    free.rejectProject(projectId);

    (, , , , , , , bool finished, , , , ) = free.projectById(projectId);

    assertEq(finished, true);
  }

  // Fail reject project
  function testFail_cannotRejectTwice() public {
    uint32 projectId = createProject(1 days);

    vm.prank(client);
    free.rejectProject(projectId);
    vm.prank(client);
    free.rejectProject(projectId);
    vm.expectRevert('The project has already been finished');
  }

  function testFail_cannotRejectAfterStarting() public {
    uint32 projectId = createProject(1 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);
    vm.prank(client);
    free.rejectProject(projectId);
    vm.expectRevert('The project has already been started');
  }

  function testFail_cannotRejectAsFreelancer() public {
    uint32 projectId = createProject(1 days);
    vm.prank(freelancer);
    free.rejectProject(projectId);
    vm.expectRevert('Only the client can reject a project');
  }

  // Claim allowance as freelancer
  function test_claimAllowanceAsFreelancer() public {
    uint32 projectId = createProject(10 days);
    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);

    vm.warp(block.timestamp + 1 days);
    vm.prank(freelancer);
    free.claim(projectId);

    (, , , uint256 lastClaimed, , , , , , , , ) = free.projectById(projectId);

    uint256 freelancerBalance = free.getFreelancerBalance(projectId);
    uint256 clientBalance = free.getClientBalance(projectId);

    uint expectedClaimAmount = (1 ether * 1 days) / 10 days; // Calculate expected claim amount based on elapsed time

    assertEq(lastClaimed, block.timestamp);
    assertEq(freelancerBalance, expectedClaimAmount); // Change this assertion
    assertEq(clientBalance, 1 ether - expectedClaimAmount); // Change this assertion
  }

  function test_claimAllowanceAfterDeadline() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);

    vm.warp(block.timestamp + 11 days);
    vm.prank(freelancer);
    free.claim(projectId);

    (, , , uint256 lastClaimed, , , , , , , , ) = free.projectById(projectId);

    uint256 freelancerBalance = free.getFreelancerBalance(projectId);
    uint256 clientBalance = free.getClientBalance(projectId);

    assertEq(lastClaimed, block.timestamp);
    assertEq(freelancerBalance, 1 ether);
    assertEq(clientBalance, 0 ether);
  }

  function test_claimMultipleTimes() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);

    vm.warp(block.timestamp + 2 days);
    vm.prank(freelancer);
    free.claim(projectId);
    (, , , uint256 lastClaimed, , , , bool finished, , , , ) = free.projectById(
      projectId
    );

    uint256 freelancerBalance = free.getFreelancerBalance(projectId);
    uint256 clientBalance = free.getClientBalance(projectId);

    assertEq(lastClaimed, block.timestamp);
    assertEq(freelancerBalance, 0.2 ether);
    assertEq(clientBalance, 0.8 ether);

    vm.warp(block.timestamp + 5 days);
    vm.prank(freelancer);
    free.claim(projectId);
    (, , , lastClaimed, , , , finished, , , , ) = free.projectById(projectId);

    freelancerBalance = free.getFreelancerBalance(projectId);
    clientBalance = free.getClientBalance(projectId);

    assertEq(lastClaimed, block.timestamp);
    assertEq(finished, false);
    assertEq(freelancerBalance, 0.7 ether);
    assertEq(clientBalance, 0.3 ether);

    vm.warp(block.timestamp + 5 days);
    vm.prank(freelancer);
    free.claim(projectId);
    (, , , lastClaimed, , , , finished, , , , ) = free.projectById(projectId);

    freelancerBalance = free.getFreelancerBalance(projectId);
    clientBalance = free.getClientBalance(projectId);

    assertEq(lastClaimed, block.timestamp);
    assertEq(finished, true);
    assertEq(freelancerBalance, 1 ether);
    assertEq(clientBalance, 0 ether);
  }

  function test_claimAfterExpendingDeadline() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);

    // Wait five days, amount claimable should be 0.5 ether
    vm.warp(block.timestamp + 5 days);
    vm.prank(freelancer);
    free.claim(projectId);

    (
      ,
      uint quote,
      uint deadline,
      uint256 lastClaimed,
      ,
      ,
      ,
      bool finished,
      ,
      ,
      ,

    ) = free.projectById(projectId);

    uint256 freelancerBalance = free.getFreelancerBalance(projectId);
    uint256 clientBalance = free.getClientBalance(projectId);

    assertEq(lastClaimed, block.timestamp);
    assertEq(finished, false);
    assertEq(freelancerBalance, 0.5 ether);
    assertEq(clientBalance, 0.5 ether);
    console.log('quote', quote);
    console.log('deadline', deadline);

    // Extend deadline by 5 days
    vm.prank(freelancer);
    free.requestExtendDeadline(projectId, block.timestamp + 10 days, 1 ether);
    vm.prank(client);
    free.acceptNewDeadline{value: 1 ether}(projectId);

    // Wait 5 more days, amount claimable should be 0.75 ether
    vm.warp(block.timestamp + 5 days);
    vm.prank(freelancer);
    free.claim(projectId);

    (, quote, deadline, lastClaimed, , , , finished, , , , ) = free.projectById(
      projectId
    );

    freelancerBalance = free.getFreelancerBalance(projectId);
    clientBalance = free.getClientBalance(projectId);

    assertEq(lastClaimed, block.timestamp);
    assertEq(finished, false);
    assertEq(freelancerBalance, 1.25 ether);
    assertEq(clientBalance, 0.75 ether);

    // Wait 6 more days, should finish the project and claim the remaining 0.75 ether
    vm.warp(block.timestamp + 6 days);
    vm.prank(freelancer);
    free.claim(projectId);

    (, quote, deadline, lastClaimed, , , , finished, , , , ) = free.projectById(
      projectId
    );

    freelancerBalance = free.getFreelancerBalance(projectId);
    clientBalance = free.getClientBalance(projectId);

    assertEq(lastClaimed, block.timestamp);
    assertEq(finished, true);
    assertEq(freelancerBalance, 2 ether);
    assertEq(clientBalance, 0 ether);
  }

  // Fail claim allowance

  function testFail_CannotClaimIfNotStarted() public {
    uint32 projectId = createProject(10 days);
    vm.prank(freelancer);
    free.claim(projectId);
    vm.expectRevert('The project has not been started yet');
  }

  function testFail_CannotClaimIfFinished() public {
    uint32 projectId = createProject(10 days);
    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);

    vm.warp(block.timestamp + 11 days);
    vm.prank(freelancer);
    free.claim(projectId);
    vm.expectRevert('The project has already been finished');
  }

  // Withdraw funds as freelancer

  function test_withdrawFundsAsFreelancer() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);

    vm.warp(block.timestamp + 11 days);

    vm.prank(freelancer);
    free.claim(projectId);

    assertEq(free.getFreelancerBalance(projectId), 1 ether);

    vm.prank(freelancer);
    free.withdraw(projectId);

    assertEq(free.getFreelancerBalance(projectId), 0 ether);
    assertEq(address(freelancer).balance, 3 ether);
    assertEq(address(client).balance, 1 ether);
    assert(free.getClientBalance(projectId) == 0 ether);
  }

  // Withdraw funds as client

  function testFail_cannotWithdrawAsNotFreelancer() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);

    vm.warp(block.timestamp + 11 days);

    vm.prank(freelancer);
    free.claim(projectId);

    assertEq(free.getFreelancerBalance(projectId), 1 ether);

    vm.prank(client);
    free.withdraw(projectId);
    vm.expectRevert('Only the freelancer can withdraw funds');
  }

  function testFail_cannotWithdrawNoFunds() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);

    vm.warp(block.timestamp + 11 days);

    vm.prank(freelancer);
    free.claim(projectId);

    assertEq(free.getFreelancerBalance(projectId), 1 ether);

    vm.prank(freelancer);
    free.withdraw(projectId);
    vm.prank(freelancer);
    free.withdraw(projectId);

    vm.expectRevert('You have no funds to withdraw');
  }

  // Cancel project

  function test_cancelProjectAsClient() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);

    vm.warp(block.timestamp + 5 days);

    vm.prank(freelancer);
    free.claim(projectId);

    assertEq(free.getFreelancerBalance(projectId), 0.5 ether);
    assertEq(free.getClientBalance(projectId), 0.5 ether);

    vm.prank(client);
    free.cancelProject(projectId);
    (, , , , , , , bool finished, , , , ) = free.projectById(projectId);

    assertEq(finished, true);
    assertEq(address(freelancer).balance, 2.5 ether);
    assertEq(address(client).balance, 1.5 ether);
    assertEq(free.getFreelancerBalance(projectId), 0 ether);
    assertEq(free.getClientBalance(projectId), 0 ether);
  }

  function test_cancelProjectAsFreelancer() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);

    vm.warp(block.timestamp + 5 days);

    vm.prank(freelancer);
    free.claim(projectId);

    assertEq(free.getFreelancerBalance(projectId), 0.5 ether);
    assertEq(free.getClientBalance(projectId), 0.5 ether);

    vm.prank(freelancer);
    free.cancelProject(projectId);
    (, , , , , , , bool finished, , , , ) = free.projectById(projectId);

    assertEq(finished, true);
    assertEq(address(freelancer).balance, 2.5 ether);
    assertEq(address(client).balance, 1.5 ether);
    assertEq(free.getFreelancerBalance(projectId), 0 ether);
    assertEq(free.getClientBalance(projectId), 0 ether);
  }

  // cancel project fail

  function testFail_cannotCancelProjectAsNotClientOrFreelancer() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);

    vm.prank(vm.addr(3));
    free.cancelProject(projectId);
    vm.expectRevert('Only the client or freelancer can cancel the project');
  }

  function testFail_cannotCancelProjectIfNotStarted() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.cancelProject(projectId);
    vm.expectRevert('The project has not been started yet');
  }

  function testFail_cannotCancelProjectIfFinished() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);

    vm.warp(block.timestamp + 11 days);

    vm.prank(freelancer);
    free.claim(projectId);

    vm.prank(client);
    free.cancelProject(projectId);
    vm.expectRevert('The project has already been finished');
  }

  // Request project deadline extension

  function test_requestExtensionAsFreelancer() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);

    vm.warp(block.timestamp + 5 days);

    vm.prank(freelancer);
    free.requestExtendDeadline(projectId, block.timestamp + 15 days, 2 ether);

    (, , , , uint256 newProposedDeadline, uint256 newQuote, , , , , , ) = free
      .projectById(projectId);

    assertEq(newProposedDeadline, block.timestamp + 15 days);
    assertEq(newQuote, 2 ether);
  }

  // Request project deadline extension fail

  function testFail_cannotRequestExtensionAsNotFreelancer() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);

    vm.prank(client);
    free.requestExtendDeadline(projectId, block.timestamp + 15 days, 2 ether);
    vm.expectRevert('Only the freelancer can request a deadline extension');
  }

  function testFail_cannotRequestExtensionIfNotStarted() public {
    uint32 projectId = createProject(10 days);

    vm.prank(freelancer);
    free.requestExtendDeadline(projectId, block.timestamp + 15 days, 2 ether);
    vm.expectRevert('The project has not been started yet');
  }

  function testFail_cannotRequestExtensionIfFinished() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);
    vm.warp(block.timestamp + 11 days);

    vm.prank(freelancer);
    free.claim(projectId);

    vm.prank(freelancer);
    free.requestExtendDeadline(projectId, block.timestamp + 15 days, 2 ether);
    vm.expectRevert('The project has already been finished');
  }

  // Accept project deadline extension

  function test_acceptNewDeadlineAsClient() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);

    vm.prank(freelancer);
    free.requestExtendDeadline(projectId, block.timestamp + 15 days, 1 ether);
    (
      ,
      uint256 quote,
      uint256 deadline,
      ,
      uint256 newProposedDeadline,
      uint256 newQuote,
      ,
      ,
      ,
      ,
      ,

    ) = free.projectById(projectId);

    assertEq(newProposedDeadline, block.timestamp + 15 days);
    assertEq(newQuote, 1 ether);

    vm.prank(client);
    free.acceptNewDeadline{value: 1 ether}(projectId);
    (, quote, deadline, , newProposedDeadline, newQuote, , , , , , ) = free
      .projectById(projectId);

    assertEq(deadline, block.timestamp + 15 days);
    assertEq(quote, 2 ether);
    assertEq(newProposedDeadline, 0);
    assertEq(newQuote, 0);
  }

  // Accept project deadline extension fail

  function testFail_cannotAcceptNewDeadlineAsNotClient() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);

    vm.prank(freelancer);
    free.requestExtendDeadline(projectId, block.timestamp + 15 days, 1 ether);

    vm.prank(freelancer);
    free.acceptNewDeadline{value: 1 ether}(projectId);
    vm.expectRevert('Only the client can accept a deadline extension');
  }

  function testFail_cannotAcceptNewDeadlineIfNotStarted() public {
    uint32 projectId = createProject(10 days);

    vm.prank(freelancer);
    free.requestExtendDeadline(projectId, block.timestamp + 15 days, 1 ether);

    vm.prank(client);
    free.acceptNewDeadline{value: 1 ether}(projectId);
    vm.expectRevert('The project has not been started yet');
  }

  function testFail_cannotAcceptNewDeadlineIfFinished() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);
    vm.warp(block.timestamp + 11 days);

    vm.prank(freelancer);
    free.claim(projectId);

    vm.prank(client);
    free.requestExtendDeadline(projectId, block.timestamp + 15 days, 1 ether);

    vm.prank(client);
    free.acceptNewDeadline{value: 1 ether}(projectId);
    vm.expectRevert('The project has already been finished');
  }

  // Finish project

  function test_finishProjectAsFreelancer() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);
    vm.warp(block.timestamp + 5 days);

    vm.prank(freelancer);
    free.claim(projectId);

    (, , , , , , , bool finished, , , , ) = free.projectById(projectId);

    assertEq(finished, false);
    assertEq(free.getClientBalance(projectId), 0.5 ether);
    assertEq(free.getFreelancerBalance(projectId), 0.5 ether);

    vm.warp(block.timestamp + 6 days);
    vm.prank(freelancer);
    free.finishProject(projectId);

    (, , , , , , , finished, , , , ) = free.projectById(projectId);

    assertEq(free.getClientBalance(projectId), 0);
    assertEq(free.getFreelancerBalance(projectId), 1 ether);

    assertEq(finished, true);
  }

  function test_finishProjectAsClient() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);
    vm.warp(block.timestamp + 5 days);

    vm.prank(freelancer);
    free.claim(projectId);

    (, , , , , , , bool finished, , , , ) = free.projectById(projectId);

    assertEq(finished, false);
    assertEq(free.getClientBalance(projectId), 0.5 ether);
    assertEq(free.getFreelancerBalance(projectId), 0.5 ether);

    vm.warp(block.timestamp + 6 days);
    vm.prank(client);
    free.finishProject(projectId);

    (, , , , , , , finished, , , , ) = free.projectById(projectId);

    assertEq(free.getClientBalance(projectId), 0 ether);
    assertEq(free.getFreelancerBalance(projectId), 1 ether);

    assertEq(finished, true);
  }

  // Finish project fail

  function testFail_cannotFinishProjectAsNotClientOrFreelancer() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);
    vm.warp(block.timestamp + 5 days);

    vm.prank(freelancer);
    free.claim(projectId);

    vm.addr(3);
    free.finishProject(projectId);
    vm.expectRevert('Only the client or the freelancer can finish a project');
  }

  function testFail_cannotFinishProjectIfNotStarted() public {
    uint32 projectId = createProject(10 days);

    vm.prank(freelancer);
    free.finishProject(projectId);
    vm.expectRevert('The project has not been started yet');
  }

  function testFail_cannotFinishProjectIfFinishedAlready() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);
    vm.warp(block.timestamp + 11 days);

    vm.prank(freelancer);
    free.claim(projectId);

    vm.prank(freelancer);
    free.finishProject(projectId);
    vm.expectRevert('The project has already been finished');
  }

  function testFail_cannotFinishProjectIfDeadlineNotPassedYet() public {
    uint32 projectId = createProject(10 days);

    vm.prank(client);
    free.acceptAndStartProject{value: 1 ether}(projectId);

    vm.prank(freelancer);
    free.finishProject(projectId);
    vm.expectRevert('The project deadline has not passed yet');
  }
}
