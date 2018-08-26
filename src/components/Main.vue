<template>
  <div>
<!-- eslint-disable max-len -->
    <md-dialog-prompt
      :md-active.sync="modalActive"
      v-model="otherPlayerAddress"
      md-title="What is the adddress of the other player?"
      md-input-maxlength="42"
      md-input-placeholder="eth address"
      md-cancel-text="Cancel"
      md-confirm-text="Start Game"
      @md-confirm="startGame()"/>

    <md-dialog :md-active.sync="showAuthPick">
      <md-dialog-title>Authentification</md-dialog-title>
      <md-content style="text-align:center; width:350px">
      Do you want to use uPort or Metamask?
      </md-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="authenticateAndConnect(true)">uPort</md-button>
        <md-button class="md-primary" @click="authenticateAndConnect(false)">Metamask</md-button>
      </md-dialog-actions>
    </md-dialog>


    <md-toolbar class="md-primary">
      <h3 class="md-title">Matchgame</h3>
        <div class="md-toolbar-section-end">
          <div style="margin-right:20px">
            <span v-if="uportAsProvider">Own uPort address:</span>
            <span v-if="!uportAsProvider">Own Metamask address:</span>
            <span style="color:yellow"> {{this.ownAddress}}</span></div>
        </div>
        </md-toolbar>
                <div>Other Player: {{gameState[3]}}</div>
                <md-button class="md-primary md-raised" @click="modalActive = true">Start new game</md-button>
                <md-button class="md-raised md-primary" @click="getState()">Get state</md-button><br/>
                <md-content v-if="gameState[2] == '0'" class="md-primary">Nobody won yet</md-content>
                <md-content v-if="gameState[2] == '1'" class="md-accent">You lost</md-content>
                <md-content v-if="gameState[2] == '2'" style="background:limegreen">You won the game! \o/ </md-content>
                <!-- <div>{{gameState}}</div> -->
                <div id="app-4">
                  <ol style="max-width:400px; margin:auto; margin-top:30px">
                    <li v-for="(e, index) in gameState[0]" :key="'row'+e" >
                      <img v-for="m in e" :key="'a'+m" style="height:80px" alt="match" src="../assets/match.jpg">
                      <img v-for="n in originalGameState[index] - e" :key="'b'+n" style="height:80px" alt="match" src="../assets/match_bw.jpg">
                    </li>
                  </ol>
                </div>
         <md-field style="max-width:200px; margin:auto; margin-top:30px">
          <label for="pickedRow">Row</label>
          <md-select v-model="pickedRow" name="pickedRow" id="pickedRow">
            <md-option v-for="i in 4" :key="i" :value="i-1">{{i}}</md-option>
          </md-select>
        </md-field>
        <md-field  style="max-width:200px; margin:auto; margin-bottom:30px">
          <label for="pickedAmount">Amount</label>
          <md-select v-model="pickedAmount" name="pickedAmount" id="pickedAmount">
            <md-option v-for="i in 7" :key="i" :value="i">{{i}}</md-option>
          </md-select>
        </md-field>
        <md-content v-if="gameState[1]" class="md-primary">It is your turn</md-content>
        <md-content v-if="!gameState[1]" class="md-accent">it is NOT your turn</md-content>
        <md-button class="md-raised md-primary" @click="makeMove()">Remove Matches</md-button><br/>
            <md-progress-bar v-if="waiting" md-mode="indeterminate"></md-progress-bar>

    <md-snackbar :md-position='"left"' :md-duration="5000" :md-active.sync="showSnackbar" md-persistent>
      <span>{{this.snackbarMessage}}</span>
      <md-button class="md-primary" @click="showSnackbar = false">Dismiss</md-button>
    </md-snackbar>

  </div>
<!-- eslint-enable max-len -->
</template>

<style lang="scss" scoped>
  .md-toolbar + .md-toolbar {
    margin-top: 16px;
  }
  .md-progress-bar {
    margin: 24px;
  }

</style>

<script>
import GameConnector from '../services/GameContractConnector';

let gameConnector;
export default {
  name: 'Main',
  data: () => ({
    showAuthPick: false,
    originalGameState: [1, 3, 5, 7],
    ownAddress: null,
    modalActive: false,
    otherPlayerAddress: null,
    pickedRow: 0,
    pickedAmount: 1,
    snackbarMessage: '',
    showSnackbar: false,
    waiting: false,
    gameState: {},
    uportAsProvider: false,
  }),
  methods: {
    authenticateAndConnect(_uportAsProvider) {
      this.showAuthPick = false;
      this.uportAsProvider = _uportAsProvider;
      gameConnector.connectToContract(_uportAsProvider).then((result) => {
        this.setGameState(result[0]);
        this.ownAddress = result[1];
      });
    },
    setGameState(state) {
      this.waiting = false;
      if (state) {
        state[0] = state[0].map(el => parseInt(el, 10));
        this.gameState = state;
      }
    },
    showSnackbarMessage(message) {
      this.waiting = false;
      this.snackbarMessage = message;
      this.showSnackbar = true;
    },
    startGame() {
      this.waiting = true;
      if (this.uportAsProvider) {
        this.showSnackbarMessage('Please approve transaction on the phone int the uPort app!');
      }
      gameConnector.startGame(this.otherPlayerAddress).then(state => this.setGameState(state));
    },
    makeMove() {
      if (this.uportAsProvider) {
        this.showSnackbarMessage('Please approve transaction on the phone int the uPort app!');
      }
      this.waiting = true;
      gameConnector.makeMove(this.pickedRow, this.pickedAmount)
        .then(state => this.setGameState(state));
    },
    getState() {
      gameConnector.getGameState().then(state => this.setGameState(state));
    },
  },
  mounted() {
    gameConnector = new GameConnector(
      (success) => {
        this.showSnackbarMessage(success);
      },
      (error) => {
        this.showSnackbarMessage(error);
      },
    );
    this.showAuthPick = true;
  },
};
</script>
