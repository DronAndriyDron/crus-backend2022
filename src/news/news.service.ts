import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {addNewsDto} from 'src/dto/addNewsDto.dto';
import {addNewsEmotion} from 'src/dto/addNewsEmotions.dto';
import {News} from 'src/entities/news.entity';
import {NewsEmotions} from 'src/entities/newsEmotion.entity';
import {Users} from 'src/entities/user.entity';
import {Repository} from 'typeorm';
import {NewsContent} from "../entities/newsContent.entity";
import {NewsLanguage} from "../entities/newsLanguage.entity";
import {editNewsDto} from "../dto/editNews.dto";

@Injectable()
export class NewsService {

  constructor(
    @InjectRepository(News) private news_repository: Repository<News>,
    @InjectRepository(NewsContent) private news_content_repository: Repository<NewsContent>,
    @InjectRepository(NewsLanguage) private news_language_repository: Repository<NewsLanguage>,
    @InjectRepository(NewsEmotions) private news_emotions_repository: Repository<NewsEmotions>,
    @InjectRepository(Users) private users_repository: Repository<Users>
  ) {
  }

  async addNews(dto: addNewsDto, image?: any) {
    if (!image) {
      throw new HttpException('add image', HttpStatus.NOT_FOUND)
    }

    // Get languages
    const languages = {}
    const languageIds = JSON.parse(dto.content).map(item => item.languageId)
    const languagesData = await this.news_language_repository.createQueryBuilder("Language")
      .where("Language.id IN (:...id)", {id: languageIds})
      .getMany();
    languagesData.forEach((item) => {
      languages[item.id] = item
    })

    // Add news
    const pre_saved_data = new News();
    pre_saved_data.date = new Date()
    pre_saved_data.image = image.path.substr(7, image.path.length);
    const savedNews = await this.news_repository.save(pre_saved_data)

    // Save Content
    const contentToSave = JSON.parse(dto.content).map(item => {
      const newContent = new NewsContent()

      newContent.title = item.title
      newContent.content = item.content
      newContent.language = languages[item.languageId]
      newContent.news = savedNews

      return newContent
    })
    const savedContent = await this.news_content_repository.save(contentToSave)

    return {
      savedNews,
      savedContent
    };


  }

  async editNews(dto: editNewsDto, image?: any) {
    const news = await this.news_repository.findOne({where: {id: dto.newsId}})

    if (!news) {
      throw new HttpException("news з вказаним айді не існує", HttpStatus.NOT_FOUND);
    }

    if (image) {
      news.image = image.path.substr(7, image.path.length);
    }

    //Remove old content
    const oldNewsContent = await this.news_content_repository.find({where: {news: news}})
    await this.news_content_repository.remove(oldNewsContent)

    const savedNews = await this.news_repository.save(news)

    // Get languages
    const languages = {}
    const languageIds = JSON.parse(dto.content).map(item => item.languageId)
    const languagesData = await this.news_language_repository.createQueryBuilder("Language")
      .where("Language.id IN (:...id)", {id: languageIds})
      .getMany();
    languagesData.forEach((item) => {
      languages[item.id] = item
    })

    // Save Content
    const contentToSave = JSON.parse(dto.content).map(item => {
      const newContent = new NewsContent()

      newContent.title = item.title
      newContent.content = item.content
      newContent.language = languages[item.languageId]
      newContent.news = savedNews

      return newContent
    })
    const savedContent = await this.news_content_repository.save(contentToSave)

    return {
      savedNews,
      savedContent
    }
  }

  async getOneNews(dto) {
    const defaultLanguage = await this.news_language_repository.findOne({where: {isDefault: true}})
    if (!defaultLanguage) {
      throw new HttpException("language з вказаним айді не існує", HttpStatus.NOT_FOUND);
    }
    const additionalLanguage = !!dto.userLanguage ? dto.userLanguage : defaultLanguage.id


    const news = await this.news_repository.createQueryBuilder("News")
      .where("News.id = :id", {id: dto.newsId})
      .leftJoinAndSelect(
        'News.content', "Content",
        "Content.language = :defaultId OR Content.language = :chosenId",
        {defaultId: defaultLanguage.id, chosenId: additionalLanguage})
      .leftJoinAndSelect("Content.language", 'Language')
      .leftJoinAndSelect("News.emotions", "Emotion")
      .getOne();

    const contentForm = {}
    news.content.forEach(item => {
      contentForm[item.language.id] = item
    })

    const newsItem: Record<string, any> = {
      id: news.id,
      image: news.image,
      date: news.date,
      defaultLanguage: {
        title: contentForm[defaultLanguage.id].title,
        content: contentForm[defaultLanguage.id].content
      },
      like: 0,
      dislike: 0
    }

    news.emotions.forEach(item => {
      if (item.emotion === 'like') {
        newsItem.like = newsItem.like + 1
      } else if (item.emotion === 'dislike') {
        newsItem.dislike = newsItem.dislike + 1
      }
    })

    if (!!contentForm[dto.userLanguage]) {
      newsItem.userLanguage = {
        title: contentForm[additionalLanguage].title,
        content: contentForm[additionalLanguage].content
      }
    }

    return {
      news: newsItem
    }
  }

  async getNews(dto) {
    const defaultLanguage = await this.news_language_repository.findOne({where: {isDefault: true}})
    if (!defaultLanguage) {
      throw new HttpException("language з вказаним айді не існує", HttpStatus.NOT_FOUND);
    }

    const additionalLanguage = !!dto.userLanguage ? dto.userLanguage : defaultLanguage.id

    const news = await this.news_repository.createQueryBuilder("News")
      .leftJoinAndSelect(
        'News.content', "Content",
        "Content.language = :defaultId OR Content.language = :chosenId",
        {defaultId: defaultLanguage.id, chosenId: additionalLanguage})
      .leftJoinAndSelect("Content.language", 'Language')
      .leftJoinAndSelect("News.emotions", "Emotion")
      .skip(dto.page * 18)
      .take(18)
      .orderBy('News.date', 'DESC')
      .getMany();


    const result = news.map(item => {
      const contentForm = {}
      item.content.forEach(item => {
        contentForm[item.language.id] = item
      })

      const newItem: Record<string, any> = {
        id: item.id,
        image: item.image,
        date: item.date,
        defaultLanguage: {
          title: contentForm[defaultLanguage.id].title,
          content: contentForm[defaultLanguage.id].content
        },
        like: 0,
        dislike: 0
      }

      item.emotions.forEach(item => {
        if (item.emotion === 'like') {
          newItem.like = newItem.like + 1
        } else if (item.emotion === 'dislike') {
          newItem.dislike = newItem.dislike + 1
        }
      })

      if (!!contentForm[dto.userLanguage]) {
        newItem.userLanguage = {
          title: contentForm[additionalLanguage].title,
          content: contentForm[additionalLanguage].content
        }
      }

      return newItem
    })

    const length = await this.news_repository.count()

    return {
      data: result,
      length
    }
  }

  async getNewsAdmin(id) {
    const news = await this.news_repository.createQueryBuilder("News")
      .where('News.id = :id', {id: id})
      .leftJoinAndSelect('News.content', "Content")
      .leftJoinAndSelect('Content.language', "Language")
      .getOne();


    return {
      news
    }
  }

  async removeNews(newsId: number) {
    const news = await this.news_repository.findOne({where: {id: newsId}})

    if (!news) {
      throw new HttpException("news з вказаним айді не існує", HttpStatus.NOT_FOUND);
    }

    //Remove old content
    const oldNewsContent = await this.news_content_repository.find({where: {news: news}})
    await this.news_content_repository.remove(oldNewsContent)

    //Remove old emotion
    const oldNewsEmotion = await this.news_emotions_repository.find({where: {news: news}})
    await this.news_emotions_repository.remove(oldNewsEmotion)


    await this.news_repository.remove(news)

    return {
      message: `news success removed`
    }
  }

  async addEmotion(dto: addNewsEmotion) {
    let oldEmotionName = null
    const news = await this.news_repository.findOne({where: {id: dto.newsId}})
    const user = await this.users_repository.findOne({where: {id: dto.userId}})

    if (!news) throw new HttpException("news з вказаним айді не існує", HttpStatus.NOT_FOUND);
    if (!user) throw new HttpException("user з вказаним айді не існує", HttpStatus.NOT_FOUND);


    // Check old emotion
    const oldEmotion = await this.news_emotions_repository.findOne({
      where: {
        news: news,
        user: user
      }
    })
    if (oldEmotion) {
      oldEmotionName = oldEmotion.emotion
      await this.news_emotions_repository.remove(oldEmotion)
    }


    // Add new emotion
    const newEmotion = new NewsEmotions()
    newEmotion.news = news
    newEmotion.user = user
    newEmotion.emotion = dto.emotion

    await this.news_emotions_repository.save(newEmotion)

    return {
      message: 'emotion success added',
      oldEmotionName: oldEmotionName
    }
  }
}
