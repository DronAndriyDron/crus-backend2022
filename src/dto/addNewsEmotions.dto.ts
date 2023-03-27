import { IsNotEmpty } from "class-validator"

export class addNewsEmotion {
   
    @IsNotEmpty()
    newsId: number

    @IsNotEmpty()
    userId: number

    @IsNotEmpty()
    emotion: string;

}