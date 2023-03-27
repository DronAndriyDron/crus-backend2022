import { IsArray, IsNotEmpty } from "class-validator";
import { EditRateType } from "src/types/editRate.type";



export class EditRatesDto{
   @IsArray()
   editRates:EditRateType[]

   @IsNotEmpty()
   gameId:number;

   @IsNotEmpty()
   userId:number;
}