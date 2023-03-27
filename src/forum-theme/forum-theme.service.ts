import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ForumTheme} from "../entities/forumTheme.entity";
import {addForumThemeDto} from "../dto/addForumTheme.dto";
import {ForumMessage} from 'src/entities/forumMessage.entity';
import {editThemeDto} from 'src/dto/editTheme.dto';
import { ForumEmotions } from 'src/entities/forumEmotions.entity';
import { confirmThemeDto } from 'src/dto/confirmThemeDto.dto';
import { getThemesDto } from 'src/dto/getThemes.dto';
import {ForumThemeLanguage} from "../entities/forumThemeLanguage";

@Injectable()
export class ForumThemeService {
  constructor(
    @InjectRepository(ForumTheme) private ForumTheme_Repository: Repository<ForumTheme>,
    @InjectRepository(ForumMessage) private ForumMessage_Repository: Repository<ForumMessage>,
    @InjectRepository(ForumEmotions) private ForumEmotions_Repository:Repository<ForumEmotions>,
    @InjectRepository(ForumThemeLanguage) private forumThemeLanguages_Repository:Repository<ForumThemeLanguage>
  ) {}

  async addTheme(dto: addForumThemeDto) {
    const language = await this.forumThemeLanguages_Repository.findOne({where: {id: dto.forumLanguageId}})

    if (!language) {
      throw new HttpException("language not found", HttpStatus.NOT_FOUND)
    }

    //Add theme
    const themeToAdd = new ForumTheme()
    themeToAdd.date = (new Date()).toISOString()
    themeToAdd.title = dto.title
    themeToAdd.language = language
    const saveNewTheme = await this.ForumTheme_Repository.save(themeToAdd)

    return saveNewTheme
  }

  async getThemes(dto:getThemesDto) {
    const language = await this.forumThemeLanguages_Repository.findOne({where: {id: dto.forumLanguageId}})
    if (!language) {
      throw new HttpException("language not found", HttpStatus.NOT_FOUND)
    }


    const themes = await this.ForumTheme_Repository.find({
      select: ['id', 'title', 'date', 'isConfirmed'],
      where: {
        isConfirmed: dto.isConfirmed,
        language: language
      },
      order: {
        id: 'DESC'
      },
      skip: dto.page * 20,
      take: 20
    })

    const length = await this.ForumTheme_Repository.count({
      where: {
        isConfirmed: dto.isConfirmed,
        language: language
      }
    })


    return {
      themes,
      length
    }
  }

  async removeTheme(id: number) {
    const theme = await this.ForumTheme_Repository.findOne({where: {id: id}})
    if (!theme) throw new HttpException("this theme not exist in DB", HttpStatus.NOT_FOUND)

    // Find message and emotions
    const forumMessagesToDelete = await this.ForumMessage_Repository.find({where: {forumTheme: theme}})
    if (forumMessagesToDelete.length) {
      const forumMessagesToDeleteIds = forumMessagesToDelete.map(item => item.id)

      const deleteEmotions = await this.ForumEmotions_Repository.createQueryBuilder('ForumEmotions')
        .where("ForumEmotions.forumMessage.id IN (:...ids)", { ids: forumMessagesToDeleteIds })
        .getMany();
      // Remove message and emotions
      if (deleteEmotions.length) await this.ForumEmotions_Repository.remove(deleteEmotions);

      if (forumMessagesToDelete.length) await this.ForumMessage_Repository.remove(forumMessagesToDelete)
    }

    await this.ForumTheme_Repository.delete(id);

    return `theme with id ${id} success removed`;
  }


  async editTheme(dto: editThemeDto) {
    const theme = await this.ForumTheme_Repository.findOne({
      where: {
        id: dto.id
      }
    })

    if (!theme) throw new HttpException("this theme not exist in DB", HttpStatus.NOT_FOUND)

    theme.title = dto.title;

    const savedTheme = await this.ForumTheme_Repository.save(theme);

    return savedTheme;
  }



  async confirmTheme(dto:confirmThemeDto) {
      const theme = await this.ForumTheme_Repository.findOne(dto.themeId);
      if(!theme) {
        throw new HttpException('This theme not exist',HttpStatus.NOT_FOUND);
      }

      theme.isConfirmed = dto.isConfirmed;
      const saved = await this.ForumTheme_Repository.save(theme);

      return saved;
  }

}