//import { StringLiteralExpression } from "assemblyscript";
import { PersistentUnorderedMap, RNG, context, math, u128 } from "near-sdk-as";

export const myTries = new PersistentUnorderedMap<string, MyTry>('#');
export const players = new PersistentUnorderedMap<string, Player>('p');


// player data storage data

@nearBindgen
export class Player {
    id: string;
    plays: i32;
    plus: i32;
    lastRandomNumber: u32;

    constructor() {
        this.id = context.sender;
        this.plays = 0;
        this.plus = -100;
        this.lastRandomNumber = 100;
    }

    static insert(): Player {
        const player = new Player();
        players.set(context.sender, player);
        return player;
      }
}

// game storage data
 
@nearBindgen
export class MyTry {
    id: string;
    completted: bool;
    goalNumber: u32;
    accumulatedAmount: u128;
    winner: Player;
    
    constructor() {
        this.id = context.blockIndex.toString();
        this.completted = false;
               
        let rng = new RNG<u32>(1, 100);
        let roll = rng.next();

        this.goalNumber = roll;
        this.accumulatedAmount = u128.Zero;
    }
}