# Design Pattern Decisions

## Fail early and fail loud

The contract relies on require and bundles requirements in function modifiers. If a require is not met it throws an exception and the transaction is reverted. It does not just check for conditions and then does nothing if they are not met. 

## Restricting access

Functions that are only used internally and are not needed for the players to call them are marked as private and thus can not be used by other contracts.
Also the contract uses libraries to make it ownable and pausable. Those functions can only be used by the owner who created the contract or someone who was made owner by the contract creator.

## Mortal/Destructible

The owner can completely kill the contract so it can never be used again

## Circuit breaker

The contract is pausable by the owner. Then only getter functions can be called but the state of the games can not be changed.

## Use tested libraries

The used libraries are well tested open source libraries by Zeppelin solution. They are registered in the thpm registry and are imported via truffle.