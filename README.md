
# Matchgame on the Ethereum chain

This is the final project for the ConsenSys Developers Academy 2018.

It is a two player game in the form of a webapp that holds its state in the ethereum blockchain. The webinterface part of the DApp is made with vue.js and the library vue-material.

## Rules of the game

... genral

### Making a move

### Winner and looser

## Try out on IPFS

try out on ipfs
rinkeby

## Run the project locally

> Requirements: 
> * node.js
> * either npm or yarn
> * Ubuntu 16.04 (other OSs will work of course but according to the project definition is should be run in that OS)
> * Browser with Metamask (Chrome or Brave)
> * (uPort?)

Install truffle gobally

```sh
$ npm install -g truffle
# or with yarn
$ yarn global add truffle
```
Clone this project and cd into the folder
```sh
 $ git clone git@github.com:samt1803/eth-matchgame.git
 $ cd Matchgame
```

### Compile and test smart contracts
```sh
truffle develop
```
Then in the truffle console enter
```
> compile
```
to compile the contracts,
```
> migrate
```
to deploy them to the testchain, that truffle starts in its developers mode, and
```
> test
```
to run the test. A word on the structure of the tests and the coverage is further down.

### Run the webinterface locally in development mode
To run the app locally you need to install ganache-cli as the local test blockchain. The webapp part can be hosted with node scripts, that can be started with npm or yarn.

Install the GUI version of Ganache for your system from [here](https://github.com/trufflesuite/ganache/releases) or install the CLI version:
```sh
$ npm install -g ganache-cli
# or with yarn
$ yarn global add ganache-cli
```
Then start whichever version you installed. It needs to be configured to run on port 8545. Also connect your Metamask to Ganache. Metamask needs to be set up and you need to import an account from ganache into Metamask.
> IMPORTANT: You need to reset the Metamask transaction history every time you restart Ganache! Otherwise it can desync and then the nonce in Metamask and the nonce in Ganache are not the same and you cant make any tranactions. To do this go to the settings in Metamask, scroll down and klick "RESET ACCOUNT".

Now you need to deploy the contracts into ganache:
```sh
$ truffle compile
$ truffle migrate --reset
```
To compile and run the webapp first install all dependencies
```sh
$ npm install
# or with yarn:
$ yarn
```
and then run the application in development mode:
```sh
$ npm run dev
# or with yarn:
$ yarn dev
```
Now you can open the DApp in the browser with Metamask on localhost:8080.

### Test the game
To actually play the game you need two accounts.
What you can do is:
* import two accounts from ganache into Metamask and switch them after ech turn. This is not very comfortable...
* Use two different browsers (Chrome and Brave), each with Metamask installed. Then import different addresses into the different Metamasks. You then even can have them side by side.
* Use Metamask and uPort. Open the App in two different window, choose uPort in one.
* Use the same address for both players. This is only a convenience option for testing the game.

