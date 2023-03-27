import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {addForumThemeLanguageDto} from "../dto/addForumThemeLanguage.dto";
import {ForumThemeLanguage} from "../entities/forumThemeLanguage";

@Injectable()
export class ForumThemeLanguageService {

  constructor(
    @InjectRepository(ForumThemeLanguage) public forumThemeLanguage_repository: Repository<ForumThemeLanguage>
  ){}

  async addLanguage(dto: addForumThemeLanguageDto) {
    const isHaveLanguage = await this.forumThemeLanguage_repository.count({where: {name: dto.name}})
    if (!!isHaveLanguage) {
      throw new HttpException("This language already used", HttpStatus.BAD_REQUEST)
    }

    // Add language
    const newLanguage = new ForumThemeLanguage()
    newLanguage.name = dto.name
    newLanguage.isDefault = false
    const savedLanguage = await this.forumThemeLanguage_repository.save(newLanguage)

    return {
      savedLanguage
    }
  }


  async getLanguages () {
    const languages = await this.forumThemeLanguage_repository.find({
      order: {
        id: "ASC",
      }
    })

    return {
      languages
    }
  }

  async setDefaultLanguage (dto) {
    const languages = await this.forumThemeLanguage_repository.find()

    const newLanguages = languages.map(item => {
      if (item.id === dto.languageId) {
        item.isDefault = true
      } else {
        item.isDefault = false
      }

      return item
    })

    const savedLanguages = await this.forumThemeLanguage_repository.save(newLanguages)

    return {
      savedLanguages
    }
  }

  async editForumLanguage (dto) {
    const language = await this.forumThemeLanguage_repository.findOne({where: {id: dto.languageId}})
    if (!language) {
      throw new HttpException("language not found", HttpStatus.NOT_FOUND)
    }

    language.name = dto.name

    const saveLanguage = await this.forumThemeLanguage_repository.save(language)


    return {
      saveLanguage
    }
  }
}
