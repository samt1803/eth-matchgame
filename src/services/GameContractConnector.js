import Web3 from 'web3';
import contract from 'truffle-contract';
import { Connect, SimpleSigner, MNID } from 'uport-connect';
import GameContract from '../../build/contracts/Matchgame.json';

export default class {
  contractInstance = null;
  successCallback = null;
  errorCallback = null;
  web3 = null;
  ownAccount = null;

  constructor(success, error) {
    this.successCallback = success;
    this.errorCallback = error;
  }

  connectToContract = (useuPort) => {
    const gameContract = contract(GameContract);
    this.contractInstance = gameContract.at(GameContract.networks[5777].address);
    // contract address on rinkeby
    // this.contractInstance = gameContract.at('0xc9d3b722372d7e82a3a4a131bbb26841bbf788f8');
    if (useuPort) {
      this.uport = new Connect('Matchgame', {
        clientId: '2okuJ48dEUSMVzVv5obeeaxph4qs9gyixfr',
        network: 'rinkeby',
        signer: SimpleSigner('d8a3fa9002aa5de86a8bd6aea3709489b16ed07398d910a9b9903b0840466bac'),
      });
      gameContract.setProvider(this.uport.getWeb3().currentProvider);
      return this.uport.requestCredentials({
        requested: ['name'],
        notifications: true,
      })
        .then((credentials) => {
          this.ownAccount = MNID.decode(credentials.address).address;
        })
        .then(() => this.getGameState())
        .then(state => [state, this.ownAccount]);
    }
    if (!window.web3) {
      this.errorCallback('Web3 not injected, is Metamask running and unlocked?');
      return null;
    }
    this.web3 = new Web3(window.web3.currentProvider);
    gameContract.setProvider(this.web3.currentProvider);
    return this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        this.errorCallback('There was an error fetching your accounts.');
        return null;
      }

      if (accs.length === 0) {
        this.errorCallback('Couldn\'t get any accounts! Make sure your Ethereum client is running');
        return null;
      }
      this.ownAccount = accs[0];
      return accs[0];
    })
      .then(() => this.getGameState())
      .then(state => [state, this.ownAccount]);
  };

  startGame = address => this.contractInstance.startNewGame(address, { from: this.ownAccount })
    .catch(() => this.errorCallback('Something went wrong, transaction didn\'t go through.'))
    .then(result => this.handleResult(result));

  handleResult = (result) => {
    // console.log(`transaction receipt: ${JSON.stringify(result)}`);
    if (result.receipt.status.endsWith('1')) {
      this.successCallback('Transaction sucessfully mined');
      const values = result.logs[0].args;
      return [values.field, values.isItYourTurn, values.playerWon, values.otherPlayer];
    }
    this.errorCallback('Something went wrong :(');
    return null;
  }

  makeMove = (row, amount) =>
    this.contractInstance.makeMove(row, amount, { from: this.ownAccount })
      .catch(() => this.errorCallback('Something went wrong, transaction didn\'t go through.'))
      .then(result => this.handleResult(result));

  getGameState = () =>
    this.contractInstance.getGame.call({ from: this.ownAccount })
      .then(gameState => gameState)
  // console.log(`gamestate ${JSON.stringify(gameState)}`);
}

