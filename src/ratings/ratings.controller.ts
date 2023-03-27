import {Controller} from '@nestjs/common';
import { RatingsService } from './ratings.service';
@Controller('ratings')
export class RatingsController {

    constructor( private ratingsService:RatingsService){}
    
}
