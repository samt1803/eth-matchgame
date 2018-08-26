
# Matchgame on the Ethereum chain

This is one submission as final project for the ConsenSys Developers Academy 2018.

It is a two player game in the form of a webapp that holds its state in the ethereum blockchain. The webinterface part of the DApp is made with vue.js and the library vue-material.

## Rules of the game

The rules are as follows:
* Players alternate, one player makes a move, then it is the other players turn
* there are 4 rows of matches, 1 match in the first row, 3 in the second, 5 in the third and 7 in the fourth row
* if it is one players turn he has to remove one or more matches from one of the rows
* he also can remove all the matches from one row
* the player that removes or has to remove the last match looses

## Run the project locally

> Requirements: 
> * Ubuntu 16.04 (other OSs will work but according to the project definition it should be run in that OS)
> * node.js
> * either npm or yarn
> * Browser with Metamask (Chrome or Brave)
> * uPort

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
to run the test. The tests make sure that only the right users can interact with the game a their time. The tests include negative tests, that check that some functions do not work when they are not supposed to.

The contracts use tested and audited library contracts by Zeppelin solutions:
* Pausable: this adds the functionality of a circuitbreaker. The owner can pause the contract, then ste state can not be change, only the function to get the state can be called. This functionality is also covered in the tests. The pausable contract also uses the Ownable contract to make the pause function only availabe to the owner.
* SafeMath: this adds a over and underflow safe way to add, substract, multiply and divide

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
To use the locally hostes app with the contracts deployed on rinkeby just change the contracts address in the GameContractConnector.js file. See line 22.
The address of the contract on the rinkeby network (0xc9d3b722372d7e82a3a4a131bbb26841bbf788f8) is also in the deployed_addresses.txt file.

## Play the game
To actually play the game you need two accounts.
What you can do is:
* import two accounts from ganache into Metamask and switch them after ech turn. This is not very comfortable...
* Use two different browsers (Chrome and Brave), each with Metamask installed. Then import different addresses into the different Metamasks. You then even can have them side by side. Note that in Brave the question for approving transactions does not pop up by itself. You have to klick on the Metamask plugin.
* Use Metamask and uPort. Open the App in two different windows, choose uPort in one.
* Use the same address for both players. This is only a convenience option for testing the game quickly with one account.

Then you first need to start a new game and enter the address of the other player. Each player can only be in one game. When creating a new game, any finished or unfinished game for yourself and for the other player are overwritten. When one player makes a move the other one has to klick 'Get state' to refresh.

### uPort

To connect with uPort you have to have the app installed on an Android or iPhone and have made an account by registering an identity on the rinkeby network (default). The when you klick 'Continue with uPort', you have to scan the barcode to log in. After that, if you start a new game or make a move you dont have to scan anything, the request for approval will just pop up in the uPort app.

### Try out on IPFS
The game is also hosten on ipfs and connected to the rinkeby chain. 
you can access it for exampe here:
[https://ipfs.io/ipfs/QmS3nwMD25fhhcHTKiQQu8NSsx3wqcQciZaKP74T4d7Xxj/](https://ipfs.io/ipfs/QmS3nwMD25fhhcHTKiQQu8NSsx3wqcQciZaKP74T4d7Xxj/)
or here 
[https://ipfs.infura.io/ipfs/QmS3nwMD25fhhcHTKiQQu8NSsx3wqcQciZaKP74T4d7Xxj/]
(https://ipfs.infura.io/ipfs/QmS3nwMD25fhhcHTKiQQu8NSsx3wqcQciZaKP74T4d7Xxj/)

If it should not load try again in a few hours, it was somehow not always accessible.

#### Build version for ipfs

to build the version that is deployed on ipfs you can check out the ipfsBuild branch. It has a the rinkeby address set for the game contract and it uses the images that are also deployed on ipfs.
Then run the build script:
```sh
$ npm run build
# or with yarn:
$ yarn build
```
Then you have to make the paths for the css and js files in the index.html in the dist folder relative by adding a . in the beginning.
then you can deploy it to ipfs yourself with
```sh
$ ipfs add -r dist/
```
### Known issues with playing

* in the Brave browser the Metamask window is not popping up automatically, you have to klick the plugin 
* when making the last move (loosing and thus other player winning) while logged in with uPort sometimes iport throws an error. Possibly a problem with the fuelstation contrac by uPort, that either calculates the needed gas wrong or simply does not want to spend so much gas.
* when one player made a move, the other player has to refresh with 'get state'. Metamask does not support subscribing to the contract events. It might work to subscribe directly to a node over websocket.
* future improvement: each player should be able to have multiple games at onece, so the state is not overwritten
