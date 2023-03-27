import { IsNotEmpty } from "class-validator";


export class confirmThemeDto{

  @IsNotEmpty()
  themeId:number;

  @IsNotEmpty()
  isConfirmed: boolean;

}