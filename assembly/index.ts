// The entry file of your WebAssembly module.
import { ContractPromiseBatch, context, logging, PersistentUnorderedMap, u128, RNG } from "near-sdk-as";
import { Player, MyTry, myTries, players} from "./model";

const DEPOSIT: u128 = u128.fromString("10000000000000000000000")


// return a game goalNumber to reach it.

export function createMyTry(): string {
  assert(context.sender == context.contractName, "Only contract account create MyTry game!");
  const myTry = new MyTry();

  myTries.set(myTry.id, myTry);
  return `New Game: ${myTry.id} goal number is ${myTry.goalNumber.toString()}`;
}

//  view all games values

export function viewTryGames(): Array<MyTry> {
  return myTries.values();
}

// return given id game 

export function viewTryGame(id: string): MyTry {
  return myTries.getSome(id);
}

//  check game status

function isContinue(id: string): bool {
  let myTry = myTries.getSome(id);
  return !myTry.completted; 
}

// try to reach game goalNumber function

export function letsTry(id: string, plus: i32 = 0): string {
  assert(myTries.contains(id), 'Game does not exist');
  assert(isContinue(id), "Game is over");
  assert(context.attachedDeposit == DEPOSIT, "Try only 0.01 Near deposit");
  assert((plus >= -99 && plus <= 99), "userContribution Must be greater than -100 and less than +100");

  if(!players.contains(context.sender)) {
    Player.insert();
  }

  let player = players.getSome(context.sender); 
  
  let myTry = myTries.getSome(id);

  let rng = new RNG<u32>(1, 100);
  let randomNumber = rng.next();

  
  player.plays += 1;
  player.lastRandomNumber = randomNumber;
  player.plus = plus;

  myTry.accumulatedAmount += context.attachedDeposit;
  
  players.set(player.id, player);
  myTries.set(myTry.id, myTry);
  
  let message = "";
  if((player.plus + randomNumber) == myTry.goalNumber) {
    message = `Congratulations: ${context.sender} winner od the myTry and received ${myTry.accumulatedAmount}`;
    myTryOver(id, player);
  } else {
    message = ` Player: ${context.sender}  play ${player.plays.toString()} times. Random number ${randomNumber.toString()} player plus ${player.plus.toString()}. Goal Number: ${myTry.goalNumber.toString()}`;
  }
  return message;
}

// set to winner set all acumulated amount to winner and finish game

export function myTryOver(id: string, player: Player): void {
  let myTry = myTries.getSome(id);
  myTry.winner = player;
  myTry.completted = true;
  myTries.set(myTry.id, myTry);

  const send_to_winner = ContractPromiseBatch.create(context.sender);
  const accumulatedAmount = myTry.accumulatedAmount;
  send_to_winner.transfer(accumulatedAmount);
 
}