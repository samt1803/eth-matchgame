pragma solidity ^0.4.24;

import "../installed_contracts/zeppelin/contracts/math/SafeMath.sol";
import "../installed_contracts/zeppelin/contracts/lifecycle/Pausable.sol";
import "../installed_contracts/zeppelin/contracts/lifecycle/Destructible.sol";

contract Matchgame is Pausable, Destructible {

    uint8[4] initialGameState = [1,3,5,7];
    uint numberOfGames;
    mapping(address => uint) playersToGameID;
    mapping(uint => Game) gameIdToGame;

    event GameState(uint8[4] field, bool isItYourTurn, uint8 playerWon, address otherPlayer);

    struct Game {
        bool voted;
        address player1;
        address player2;
        //bool player1AgreedToStart;
        //bool player2AgreedToStart;
        bool player1turn;
        bool gameFinished;
        bool player1Won;
        uint8[4] field;
    }

    modifier isValidMove(uint8 row) {
        Game storage game = gameIdToGame[playersToGameID[msg.sender]];
        // game should not be finished yes
        require (!game.gameFinished);
        // it must be the players turn
        if (game.player1turn) {
            require(game.player1 == msg.sender);
        } else {
            require(game.player2 == msg.sender);
        }
        // the row must be in the right range
        require(row >= 0 && row <= 3);
        _;
    }
    
    /**
     * This starts a new game. For the caller and for the other player that is
     * given as a parameter the games are overwritten!
     * The game is set to its initial position.
     * 
     * @param otherPlayer The address of the second player. (Can be the same as first player for testing)
     */
    function startNewGame(address otherPlayer) whenNotPaused public {
        Game memory game;
        game.field = initialGameState;
        game.player1 = msg.sender;
        game.player2 = otherPlayer;
        numberOfGames++;
        gameIdToGame[numberOfGames] = game;
        playersToGameID[msg.sender] = numberOfGames;
        playersToGameID[otherPlayer] = numberOfGames;
        (uint8[4] memory field, bool yourTurn, uint8 playerWon, address other) = getGame();
        emit GameState(field, yourTurn, playerWon, other);
    }

    /**
    * Get the game state with information for the caller.
    * 
    * @return field The game field with the state the game is currently in.
    * @return isItYourTurn Boolean, true if it is the callers turn.
    * @return playerWon uint8, 0 noone won, 1 if caller lost, 2 if caller won.
     */
    function getGame() view public returns(uint8[4] memory field, bool isItYourTurn, uint8 playerWon, address otherPlayer) {
        Game memory game = gameIdToGame[playersToGameID[msg.sender]];
        field = game.field;
        if (game.gameFinished) {
            if ((game.player1Won && game.player1 == msg.sender) ||
                (!game.player1Won && game.player2 == msg.sender)) {
                    playerWon = 2;
                }
                else {
                    playerWon = 1;
                }
        }
        else {
            if ((game.player1turn && game.player1 == msg.sender) ||
            (!game.player1turn && game.player2 == msg.sender) ) {
                isItYourTurn = true;
            } else {
                isItYourTurn = false;
            }
        }
        if (game.player1 == msg.sender) {
            otherPlayer = game.player2;
        } else {
            otherPlayer = game.player1;
        }
    }
    
    /**
     * Make a game move with this function, removing between 1 and all matches of one row.
     * The method validates if it is a valid move and calculates the won or lost state
     * in case the game is finisched
     * 
     * @param row The row from which to remove matches.
     * @param amountToRemove The amount of matches to remove.
     */
    function makeMove(uint8 row, uint8 amountToRemove) isValidMove(row) whenNotPaused public {
        Game storage game = gameIdToGame[playersToGameID[msg.sender]];

        game.field[row] = uint8(SafeMath.sub(game.field[row], amountToRemove));
        
        determineGameFinished();

        if (!game.gameFinished) {
            game.player1turn = !game.player1turn;
        }

        (uint8[4] memory field, bool yourTurn, uint8 playerWon, address otherPlayer) = getGame();
        emit GameState(field, yourTurn, playerWon, otherPlayer);
    }


    /**
     * Helper function to determine if the game is finished. If so it also sets the winner and loser.
     */
    function determineGameFinished() private {
        Game storage game = gameIdToGame[playersToGameID[msg.sender]];
        // check if this was the last removed item or if there is only one left
        bool gameLost = true;
        for(uint8 i = 0; i<4; i++) {
            if (game.field[i] != 0) {
                gameLost = false;
            }
        }
        if (gameLost) {
            game.gameFinished = true;
            if (!game.player1turn) { //player 2s turn
                game.player1Won = true;  //other case (player 2 won) is gameFinished=true and player1Won=false
            }
        }        
    }
}