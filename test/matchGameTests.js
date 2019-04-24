const Matchgame = artifacts.require('../contracts/Matchgame.sol')

const ORIGINAL_GAME_STATE = [1, 3, 5, 7]
let contractInstance
let accounts

// set up contract
// before(() => contract('Matchgame', (_accounts) => {
//   accounts = _accounts
//   Matchgame.deployed().then(instance => contractInstance = instance)
// }))

contract('Matchgame', accounts => {
  it('should be possible to create a new game', () =>
    Matchgame.deployed()
      .then(instance => instance.startNewGame(accounts[1]))
      .then(result =>
        // console.log(result))
        assert.isTrue(result.receipt.status, 'transaction to create account was not successful'))
  )
}
)

// it('should be possible to create a new game', () => Matchgame.deployed().then(insta => insta.startNewGame(accounts[1])
//   // assert that the transaction was successful
//   // depending on the version 0x01 or 0x1 is returned as successful, 0x0 or 0x00 as failed

// ))

// it('should be possible to get the game state. It should be the initial gamestate', () => contractInstance.getGame()
//   .then((result) => {
//     const state = result[0].map(e => e.c[0]);
//     // assert that the game state is the original state
//     assert.deepEqual(state, ORIGINAL_GAME_STATE, 'game is not roiginal gamestate after creating new game');
//     // it should be the other players turn
//     assert.isFalse(result[1], 'it is not the other players turn after initating the game');
//     // after creating a game noone should have won immediately
//     assert.equal(result[2].c[0], 0, 'someone is a winner after initalizing the game');
//   }));

// it('should be possible to make a move as player 2. Then the gamestate should have changed', () => contractInstance.makeMove(0, 1, { from: accounts[1] })
//   // assert that the transaction was successful
//   .then(result => assert.isTrue(result.receipt.status.endsWith('1'), 'transaction to create account was not successful'))
//   // assert that the game state changed to the new state of 0,3,5,7 and that it is now player 1s turn
//   .then(contractInstance.getGame().then((result) => {
//     const state = result[0].map(e => e.c[0]);
//     assert.deepEqual(state, [0, 3, 5, 7], 'game is not in the new state 0,3,5,7 after removing one in the first row');
//     assert.isTrue(result[1], 'it is not the other players turn after initating the game');
//   })));

// it('should fail when making a move as player 2 when it is player ones turn', () =>
//   // first assure that it is indee not player 2s (account[1]) turn
//   contractInstance.getGame({ from: accounts[1] })
//     .then(result => assert.isFalse(result[1], 'it is not the expected players turn'))
//   // then try to make move
//     .then(() => contractInstance.makeMove(0, 1, { from: accounts[1] }))
//     .catch(err => assert.isTrue(err.toString().startsWith('Error: VM Exception while processing transaction: revert'),
//       'not the expectes revert error was thrown')),
// );

// it('should calculate and show the correct winner', () =>
//   contractInstance.startNewGame(accounts[1], { from: accounts[0] })
//     .then(() => contractInstance.getGame({ from: accounts[1] }))
//     .then(result => assert.equal(result[1], true, 'it is not the expected players turn'))
//     // make moves so that accounts[1]/player2 wis
//     .then(() => contractInstance.makeMove(0, 1, { from: accounts[1] }))
//     .then(() => contractInstance.makeMove(1, 3, { from: accounts[0] }))
//     .then(() => contractInstance.makeMove(2, 5, { from: accounts[1] }))
//     .then(() => contractInstance.makeMove(3, 7, { from: accounts[0] }))
//     .then(() =>
//       // looser should see that he has lost
//       contractInstance.getGame({ from: accounts[0] }).then((result) => {
//         const state = result[0].map(e => e.c[0]);
//         assert.deepEqual(state, [0, 0, 0, 0], 'game is not in the expected state 0,0,0,0');
//         assert.equal(result[2].c[0], '1', 'not the right player won');
//       })
//         // winner should see that he has won
//         .then(() =>
//           contractInstance.getGame({ from: accounts[1] }).then((result) => {
//             const state = result[0].map(e => e.c[0]);
//             assert.deepEqual(state, [0, 0, 0, 0], 'game is not in the expected state 0,0,0,0');
//             assert.equal(result[2].c[0], '2', 'not the right player won');
//           }),
//         ),
//     ),
// );

// it('owner should be able to pause the game. Then creating new game or moving is blocked', () =>
//   contractInstance.pause({ from: accounts[1] })
//   // make shure another account than the owner (accounts[0]) cannot pause
//     .catch(err => assert.isTrue(err.toString().startsWith('Error: VM Exception while processing transaction: revert')))
//     .then(() => contractInstance.pause({ from: accounts[0] }))
//     // assert that the transaction was successful
//     .then(result => assert.isTrue(result.receipt.status.endsWith('1'), 'transaction to create account was not successful'))
//   // then starting new game or making a move should not work
//     .then(() => contractInstance.startNewGame(accounts[1]))
//     .catch(err => assert.isTrue(err.toString().startsWith('Error: VM Exception while processing transaction: revert'),
//       'it is still possible to create a game when paused'))
//     .then(() => contractInstance.makeMove(1, 1))
//     .catch(err => assert.isTrue(err.toString().startsWith('Error: VM Exception while processing transaction: revert'),
//       'it is still possible to make a move when paused')),
// );

// it('only the owner should be able to UNpause the game', () => contractInstance.unpause({ from: accounts[1] })
//   // make shure another account than the owner (accounts[0]) cannot unpause
//   .catch(err => assert.isTrue(err.toString().startsWith('Error: VM Exception while processing transaction: revert'),
//     'someone not the owner was able to unpause'))
//   .then(() => contractInstance.unpause())
//   .then(result => assert.isTrue(result.receipt.status.endsWith('1'), 'unpausing by the owner didn\'t work'))
//   // it shoould no be possible to create a game again
//   .then(() => contractInstance.startNewGame(accounts[1]))
//   .then(result => assert.isTrue(result.receipt.status.endsWith('1'), 'creating game after unpausing didn\'t work')),
// )
