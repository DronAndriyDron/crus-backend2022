import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {addLanguageDto} from "../dto/addLanguage.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {NewsLanguage} from "../entities/newsLanguage.entity";

@Injectable()
export class NewsLanguageService {

  constructor(
    @InjectRepository(NewsLanguage) public newsLanguage_repository: Repository<NewsLanguage> ){
  }

  async addLanguage(dto: addLanguageDto) {
    const isHaveLanguage = await this.newsLanguage_repository.count({where: {name: dto.name}})
    if (!!isHaveLanguage) {
      throw new HttpException("This language already used", HttpStatus.BAD_REQUEST)
    }

    // Add language
    const newLanguage = new NewsLanguage()
    newLanguage.name = dto.name
    newLanguage.isDefault = false
    const savedLanguage = await this.newsLanguage_repository.save(newLanguage)

    return {
      savedLanguage
    }
  }


  async getLanguages () {
    const languages = await this.newsLanguage_repository.find({
      order: {
        id: "ASC",
      }
    })

    return {
      languages
    }
  }

  async setDefaultLanguage (dto) {
    const languages = await this.newsLanguage_repository.find()

    const newLanguages = languages.map(item => {
      if (item.id === dto.languageId) {
        item.isDefault = true
      } else {
        item.isDefault = false
      }

      return item
    })

    const savedLanguages = await this.newsLanguage_repository.save(newLanguages)

    return {
      savedLanguages
    }
  }

  async editNewsLanguage (dto) {
    const language = await this.newsLanguage_repository.findOne({where: {id: dto.languageId}})
    if (!language) {
      throw new HttpException("language not found", HttpStatus.NOT_FOUND)
    }

    language.name = dto.name
    const saveLanguage = await this.newsLanguage_repository.save(language)

    return {
      saveLanguage
    }
  }

}
