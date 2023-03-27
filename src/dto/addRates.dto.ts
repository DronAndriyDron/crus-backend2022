import {IsArray, IsNumber, IsString} from "class-validator";

export interface IRatesCaptains {
    playerId: number,
    position: "defender" | "midfielder" | "attacker"
}

export interface IRatesLineups {
    playerId: number,
    position:
      "gk" | "ld" | "lcd" | "cd" | "rcd" | "rd" | "rsm" | "sm" | "lsm" | "lm" |
      "lcm" | "cm" | "rcm" | "rm" | "ram" | "am" | "lam" | "rfa" | "lfa" | "rca" | "ca" | "lca"
}

export class addRatesDto{
    @IsNumber()
    gameId: number;

    @IsNumber()
    userId: number;

    @IsNumber()
    shots:number;

    @IsNumber()
    successShots:number;

    @IsNumber()
    passes:number;

    @IsNumber()
    successPasses:number;

    @IsNumber()
    dribbles:number;

    @IsNumber()
    successDribbles:number;

    @IsNumber()
    ballAccuracy: number;

    @IsArray()
    lineups: Record<string, any>[]

    @IsArray()
    captains:  Record<string, any>[]

    @IsString()
    formation: string;

}