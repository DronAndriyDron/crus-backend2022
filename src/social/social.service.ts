import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {socialDto} from 'src/dto/socialDto.dto';
import {Social} from 'src/entities/social.entity';
import {Repository} from 'typeorm';

@Injectable()
export class SocialService {

  constructor(@InjectRepository(Social) private social_repository: Repository<Social>) {

  }

  async createSocials(dto: socialDto) {
    const isExists = await this.social_repository.find();


    if (isExists.length) {
      const socialIds = isExists.map(key => key.id);

      await this.social_repository.delete(socialIds);
    }

    const socials = dto.socials.map(key => {
      const soc = new Social();
      soc.isActive = key.isActive;
      soc.link = key.link;
      soc.name = key.name;

      return soc;
    })

    return await this.social_repository.save(socials);
  }

  async getSocials() {
    return await this.social_repository.find();
  }


}
