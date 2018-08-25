# Avoiding common attacks

## Logic bugs

There are positive and negative tests that ensure that the features are working or not working when they are not supposed to.

## Failed sends

Does not apply since the player cant play for money in this game. It could be implemented in the future. Then the pull over push principle should be implemented where a player can withdraw his winnings in a seperate function, that the player calls himself.

## Recursive calls

The contract does not send Ether or tokens or calls external contracts so reentrancy is not possible. If it would send Ether or call a function of an external contract, that should be done as last step in each function. It should also be marked as an unsafe function as a reminder to the developers.

## Integer over or underflow

The tested library SafeMath by Zeppelin solutions was used to calculate new game state, ensuring that the player can not produce underflow, either intentionally or unintentionally.

## Poison data

The inputs are of a fixed type (uint8) and the values are checked whether they are in the allowed range

## Exposed functions

The functions that are not required for the players to play the game are set to private to they can only be called from within the contract.

## Exposed secrets

The contract has no secret data. 

## Denial of service/ dust spam

The user input is limited and can not increase arrays and storage dramatically. Also only the rows are used in a loop and those have a fixed size. 

## Miner vulnerabilities

The contract does not rely on timestamps and the order of turns is ensured through the contract so no manipulation through transaction reordering can be used by miners

## Malicious creator

The owner has all the power currently, he can pause and destroy the contract. It should however not be a problem since
the contract does not hold user funds. If Ether should be sent to the contract by mistake, the owner has control over the ether since he can kill the contract and send remaining ether to another contract.

## Off-Chain safety

This does not really apply, but if the contract could hold user currency and the Webapplication does not hold any keys. So the safety guidelines of Metamask and uPort should be followed.

## Crosschain replay attack

Is not really a problem since the contract does not hold Ether.

## Tx.origian problem

Tx.origin is not used, only msg.sender.

## Solidity Function Signatures and Fallback Data Collision

Should not be a problem since you should not send Eth to the contract. The fallback function is also only implicit and holds no logic.

## Incorrect use of cryptography

The contract does not use any cryptography.

## Gas limits

The contract does not loop over arrays the get bigger over time and user input is of fixed size.

