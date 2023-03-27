import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ForumTheme} from "../entities/forumTheme.entity";
import {Repository} from "typeorm";
import {ForumMessage} from "../entities/forumMessage.entity";
import {addThemeMessageDto} from "../dto/addThemeMessage.dto";
import {Users} from "../entities/user.entity";
import {addEmotionDto} from 'src/dto/addEmotion.dto';
import {ForumEmotions} from 'src/entities/forumEmotions.entity';
import {editThemeMessageDto} from '../dto/editThemeMessage.dto';
import {getMessagesByTheme} from 'src/dto/getMessagesByTheme.dto';
import {getMessagesByReportsDto} from "../dto/forum/getMessagesByReports.dto";
import {ForumThemeLanguage} from "../entities/forumThemeLanguage";

@Injectable()
export class ForumMessageService {
  constructor(
    @InjectRepository(ForumMessage) private ForumMessage_Repository: Repository<ForumMessage>,
    @InjectRepository(Users) private Users_Repository: Repository<Users>,
    @InjectRepository(ForumTheme) private ForumTheme_Repository: Repository<ForumTheme>,
    @InjectRepository(ForumEmotions) private ForumEmotions_Repository: Repository<ForumEmotions>,
    @InjectRepository(ForumThemeLanguage) private ForumThemeLanguage_Repository: Repository<ForumThemeLanguage>
  ) {
  }

  async addThemeMessage(dto: addThemeMessageDto) {
    const user = await this.Users_Repository.findOne({where: {id: dto.userId}})
    const theme = await this.ForumTheme_Repository.findOne({where: {id: dto.themeId}})
    if (!user) return new HttpException('user not found', HttpStatus.NOT_FOUND)
    if (!theme) return new HttpException('theme not found', HttpStatus.NOT_FOUND)

    const messageToAdd = new ForumMessage()

    messageToAdd.date = (new Date()).toISOString()
    messageToAdd.message = dto.message
    messageToAdd.user = user
    messageToAdd.forumTheme = theme

    const saveMessage = await this.ForumMessage_Repository.save(messageToAdd)

    return {
      message: {
        name: user.name,
        surname: user.surname,
        message: saveMessage.message,
        data: saveMessage.date,
        id: saveMessage.id,
        like: 0,
        dislike: 0
      }
    }
  }

  async addEmotion(dto: addEmotionDto) {
    let oldEmotionName = null
    const message = await this.ForumMessage_Repository.findOne({where: {id: dto.messageId}})
    const user = await this.Users_Repository.findOne({where: {id: dto.userId}})

    if (!message) throw new HttpException("news з вказаним айді не існує", HttpStatus.NOT_FOUND);
    if (!user) throw new HttpException("user з вказаним айді не існує", HttpStatus.NOT_FOUND);


    // Check old emotion
    const oldEmotion = await this.ForumEmotions_Repository.findOne({where: {forumMessage: message, user: user}})
    if (oldEmotion) {
      oldEmotionName = oldEmotion.emotion
      await this.ForumEmotions_Repository.remove(oldEmotion)
    }


    // Add new emotion
    const newEmotion = new ForumEmotions()
    newEmotion.forumMessage = message
    newEmotion.user = user
    newEmotion.emotion = dto.emotion

    await this.ForumEmotions_Repository.save(newEmotion)

    return {
      message: 'emotion success added',
      oldEmotionName: oldEmotionName
    }
  }

  async editThemeMessage(dto: editThemeMessageDto) {
    const message = await this.ForumMessage_Repository.findOne({where: {id: dto.messageId}})
    if (!message) return new HttpException('message not found', HttpStatus.NOT_FOUND)

    // Edit Message
    message.message = dto.message
    const saveMessage = await this.ForumMessage_Repository.save(message)

    return saveMessage
  }

  async getMessagesByTheme(dto: getMessagesByTheme) {
    const theme = await this.ForumTheme_Repository.findOne({where: {id: dto.themeId}});
    if (!theme) throw new HttpException('ForumTheme with this id not exist', HttpStatus.NOT_FOUND);


    const messages = await this.ForumMessage_Repository.createQueryBuilder('ForumMessage')
      .select([
        'ForumMessage.id',
        'ForumMessage.date',
        'ForumMessage.message',
        'user.name',
        'user.surname',
        'user.id'
      ])
      .where('ForumMessage.forumThemeId = :themeId', {themeId: dto.themeId})
      .leftJoin('ForumMessage.user', 'user')
      .leftJoinAndSelect('ForumMessage.forumEmotions', "Emotion")
      .orderBy('ForumMessage.id', 'ASC')
      .skip(dto.page * 20)
      .take(20)
      .getMany();

    const result = messages.map((item) => {
      const contentForm = {
        id: item.id,
        date: item.date,
        message: item.message,
        like: 0,
        dislike: 0,
        user: {
          id: item.user.id,
          name: item.user.name,
          surname: item.user.surname
        },
      }

      item.forumEmotions.forEach(elem => {
        if (elem.emotion === 'like') {
          contentForm.like = contentForm.like + 1
        } else if (elem.emotion === 'dislike') {
          contentForm.dislike = contentForm.dislike + 1
        }
      })

      return contentForm
    })

    const count = await this.ForumMessage_Repository.count({where: {forumTheme: theme}})


    return {
      length: count,
      data: result,
      theme: theme.title
    };
  }

  async getMessagesByReports (dto: getMessagesByReportsDto) {
    const language = await this.ForumThemeLanguage_Repository.findOne({where: {id: dto.languageId}})
    if (!language) {
      throw new HttpException('This language not exist',HttpStatus.BAD_REQUEST);
    }
    const themes = await this.ForumTheme_Repository.createQueryBuilder("Themes")
      .leftJoinAndSelect( "Themes.language", "ThemeLanguage")
      .where('Themes.language.id = :language', {language: language.id})
      .getMany()

    if (themes.length < 1) {
      return {
        data: [],
        length: 0
      }
    }

    const themesIds = themes.map(item => item.id)

    const messages = await this.ForumMessage_Repository.createQueryBuilder('ForumMessage')
      .select([
        'ForumMessage.id',
        'ForumMessage.date',
        'ForumMessage.message',
        'ForumMessage.reports',
        'User.name',
        'User.surname',
        'User.id'
      ])
      .where("ForumMessage.forumTheme.id IN (:...ids)", { ids: themesIds })
      .andWhere("ForumMessage.reports > :minValue", {minValue: 0})
      .leftJoinAndSelect('ForumMessage.forumEmotions', "Emotion")
      .leftJoinAndSelect('ForumMessage.user', "User")
      .orderBy('ForumMessage.reports', 'DESC')
      .skip(dto.page * 20)
      .take(20)
      .getMany();


    const count = await this.ForumMessage_Repository.createQueryBuilder('ForumMessage')
      .where("ForumMessage.forumTheme.id IN (:...ids)", { ids: themesIds })
      .andWhere("ForumMessage.reports > :minValue", {minValue: 0})
      .getCount();


    return {
      length: count,
      data: messages
    };
  }

  async removeMessage(id) {
    const message = await this.ForumMessage_Repository.findOne({where: {id: id}})
    if (!message) throw new HttpException('ForumMessage with this id not exist', HttpStatus.NOT_FOUND);


    const deleteEmotions = await this.ForumEmotions_Repository.find({where: {forumMessage: message}})
    const deletedIds = deleteEmotions.map(key => key.id)
    if (deletedIds.length) await this.ForumEmotions_Repository.delete(deletedIds);

    await this.ForumMessage_Repository.delete(id)

    return {
      message: `message with id ${id} succesfull deleted`
    };
  }

  async addReport (id) {
    const message = await this.ForumMessage_Repository.findOne({where: {id: id}})
    if (!message) {
      throw new HttpException('Message not exist', HttpStatus.BAD_REQUEST);
    }

    message.reports = message.reports + 1

    const savedMessage = await this.ForumMessage_Repository.save(message)

    return {
      savedMessage
    }
  }

  async clearReports(id) {
    const message = await this.ForumMessage_Repository.findOne({where: {id: id}})
    if (!message) {
      throw new HttpException("Message not exist", HttpStatus.NOT_FOUND)
    }

    message.reports = 0

    const savedMessage = await this.ForumMessage_Repository.save(message)

    return {
      savedMessage
    }
  }
}