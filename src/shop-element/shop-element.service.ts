import common_1, {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ShopElement} from "../entities/shopElement.entity";
import {ShopElementToUser} from "../entities/shopElementToUser.entity";
import {Users} from "../entities/user.entity";
import common_2 from "@nestjs/common";

@Injectable()
export class ShopElementService {

  constructor(
    @InjectRepository(ShopElement) private shopElement_repository: Repository<ShopElement>,
    @InjectRepository(ShopElementToUser) private shopElementToUser_repository: Repository<ShopElementToUser>,
    @InjectRepository(Users) private users_repository: Repository<Users>
  ) {
  }

  async addShopElement(dto, file) {
    const newElement = new ShopElement()

    if (!file) throw new HttpException("File no found", HttpStatus.BAD_REQUEST)

    newElement.name = dto.name
    newElement.type = dto.type
    newElement.isInShop = dto.isInShop === 'true'
    newElement.image = file.path.substr(7, file.path.length);

    if (dto.isInShop === 'true') {
      newElement.price = dto.price
    } else {
      newElement.level = dto.level
    }

    const saveShopElement = await this.shopElement_repository.save(newElement)


    return {
      saveShopElement
    }
  }

  async editShopElement(dto, file) {
    const element = await this.shopElement_repository.findOne({where: {id: dto.elementId}})

    if (!element) throw new HttpException("Element no found", HttpStatus.BAD_REQUEST)


    element.name = dto.name
    element.type = dto.type
    element.isInShop = dto.isInShop === 'true'

    if (file) {
      element.image = file.path.substr(7, file.path.length);
    }

    if (dto.isInShop === 'true') {
      element.price = dto.price
      element.level = 0
    } else {
      element.level = dto.level
      element.price = 0
    }

    const saveShopElement = await this.shopElement_repository.save(element)


    return {
      saveShopElement
    }
  }

  async setShopElementDefault(dto) {
    const element = await this.shopElement_repository.findOne({where: {id: dto.elementId}})

    if (!element) {
      throw new common_1.HttpException("Element not found", common_1.HttpStatus.BAD_REQUEST);
    }


    const sameElementsType = await this.shopElement_repository.find({where: {type: element.type}})
    const sameElementsToSave = sameElementsType.map(item => {
      item.isDefault = item.id === dto.elementId;

      return item
    })

    const savedAllElements = await this.shopElement_repository.save(sameElementsToSave)


    return {
      savedAllElements
    }
  }

  async getTest() {
    const shopElements = await this.shopElement_repository.find()

    return {
      shopElements
    }

  }

  async getShopElements(dto) {

    const shopElements = await this.shopElement_repository.createQueryBuilder("ShopElements")
      .where("ShopElements.type = :type", {type: dto.type})
      .andWhere("ShopElements.isInShop = :isInShop", {isInShop: dto.isInShop})
      .orderBy("ShopElements.name", 'ASC')
      .skip(dto.page * 18)
      .take(18)
      .getMany();

    const length = await this.shopElement_repository.count({where: {isInShop: dto.isInShop, type: dto.type}})

    return {
      data: shopElements,
      length
    }
  }

  async getShopElementsForUser(dto) {

    const shopElements = await this.shopElement_repository.createQueryBuilder("ShopElements")
      .where("ShopElements.type = :type", {type: dto.type})
      .andWhere("ShopElements.isInShop = :isInShop", {isInShop: true})
      .skip(dto.page * 18)
      .take(18)
      .orderBy('ShopElements.price', 'ASC')
      .getMany();

    const length = await this.shopElement_repository.count({where: {isInShop: true, type: dto.type}})

    return {
      data: shopElements,
      length
    }
  }

  async buyElement(dto) {

    // Get User And Element
    const user = await this.users_repository.findOne({where: {id: dto.userId}})
    const element = await this.shopElement_repository.findOne({where: {id: dto.elementId}})
    const isUserHaveElement = await this.shopElementToUser_repository.findOne({
      where: {
        shopElement: element,
        user: user
      }
    })
    if (isUserHaveElement) {
      return {
        isUserHave: true
      }
    }

    if (!user) throw new common_1.HttpException("User not found", common_1.HttpStatus.BAD_REQUEST);
    if (!element) throw new common_1.HttpException("Element not found", common_1.HttpStatus.BAD_REQUEST);

    if (user.coins < element.price) {
      throw new common_1.HttpException("It's so expensive for you", common_1.HttpStatus.BAD_REQUEST);
    }

    // Add element
    const userElement = new ShopElementToUser()
    userElement.user = user
    userElement.shopElement = element

    // Check money
    user.coins = user.coins - element.price


    // Save
    const savedUserElement = await this.shopElementToUser_repository.save(userElement)
    const savedUser = await this.users_repository.save(user)


    return {
      isSaved: true,
      savedUserElement,
      savedUser
    }
  }

  async getBoxElements(page: number) {
    const elements = await this.shopElement_repository.createQueryBuilder("ShopElement")
      .where('ShopElement.isInShop = :isInShop', {isInShop: false})
      .skip(page * 18)
      .take(18)
      .orderBy('ShopElement.level', 'DESC')
      .getMany();


    const length  = await this.shopElement_repository.count({where: {isInShop: false}})

    return {
      data: elements,
      length: length
    }
  }

  async getUserElements(dto) {

    const user = await this.users_repository.createQueryBuilder('User')
      .where('User.id = :id', {id: dto.userId})
      .leftJoinAndSelect('User.shopElementToUser', "ShopElementToUser")
      .leftJoinAndSelect(
        'ShopElementToUser.shopElement',
        "ShopElement"
      )
      .andWhere('ShopElement.type = :type', {type: dto.type})
      .orderBy("ShopElement.level", "DESC")
      .getOne();

    const elements = user?.shopElementToUser.length ? user.shopElementToUser.map(item => item.shopElement) : []

    return {
      elements,
      usedIds: [user.playerForm, user.goalkeeperForm, user.stadium]
    }
  }

  async getShopElementById(id: number) {
    const element = await this.shopElement_repository.findOne({where: {id: id}})

    if (!element) throw new HttpException("Element no found", HttpStatus.BAD_REQUEST)

    return {
      element
    }
  }

  async removeShopElement(id: number) {
    const element = await this.shopElement_repository.findOne({where: {id: id}})

    if (!element) throw new HttpException("Element no found", HttpStatus.BAD_REQUEST)

    const elementsToShop = await this.shopElementToUser_repository.find({where: {shopElement: element}})


    const removerElementsToShop = await this.shopElementToUser_repository.remove(elementsToShop)
    const removedElement = await this.shopElement_repository.remove(element)

    return {
      removerElementsToShop,
      removedElement
    }
  }

  async setUserElementDefault(dto) {
    const user = await this.users_repository.findOne({where: {id: dto.userId}})
    const elementToUser = await this.shopElementToUser_repository.createQueryBuilder('ShopElementToUser')
      .where(
        "ShopElementToUser.user.id = :userId AND ShopElementToUser.shopElement.id = :elementId",
        {userId: dto.userId, elementId: dto.elementId})
      .leftJoinAndSelect('ShopElementToUser.shopElement', 'ShopElement')
      .getOne()

    if (!user) throw new HttpException("user not found ", HttpStatus.BAD_REQUEST);
    if (!elementToUser) throw new HttpException("element not found ", HttpStatus.BAD_REQUEST);

    if (elementToUser.shopElement.type === 'playerForm') {
      user.playerForm = elementToUser.shopElement.id
    } else if (elementToUser.shopElement.type === 'goalkeeperForm') {
      user.goalkeeperForm = elementToUser.shopElement.id
    } else if (elementToUser.shopElement.type === 'stadium') {
      user.stadium = elementToUser.shopElement.id
    }

    const savedUser = await this.users_repository.save(user)

    return {
      savedUser
    }
  }

  async openUserBox(dto) {
    const user = await this.users_repository.findOne({where: {id: dto.userId}})
    if (!user) throw new HttpException('User not exist', HttpStatus.BAD_REQUEST);
    if (user.box < 1) throw new HttpException('Not have a box', HttpStatus.BAD_REQUEST);

    // Find elements
    const allElements = await this.shopElement_repository.find({where: {isInShop: false}})
    const userElements = await this.shopElementToUser_repository.createQueryBuilder("UserElements")
      .leftJoinAndSelect("UserElements.shopElement", "ShopElement")
      .getMany()
    const usedElementsIds = userElements.map(item => item.shopElement.id)
    if (!allElements.length) throw new HttpException('Not have elements', HttpStatus.BAD_REQUEST);

    const elements = allElements.filter(item => !usedElementsIds.includes(item.id))
    if (!elements.length) throw new HttpException('Not have elements to user', HttpStatus.BAD_REQUEST);

    // Get random element
    const rand = Math.random() * elements.length | 0;
    const chosenValue = elements[rand];

    // Save result
    user.box = user.box - 1

    const newUserElement = new ShopElementToUser()
    newUserElement.user = user
    newUserElement.shopElement = chosenValue

    await this.users_repository.save(user)
    await this.shopElementToUser_repository.save(newUserElement)

    return {
      chosenValue
    }
  }

  async buyUserBox(dto) {
    const user = await this.users_repository.findOne({where: {id: dto.userId}})
    if (!user) throw new HttpException('User not exist', HttpStatus.BAD_REQUEST);
    if (user.coins < 400) throw new HttpException('Not have a money', HttpStatus.BAD_REQUEST);

    user.coins = user.coins - 400
    user.box = user.box + 1

    await this.users_repository.save(user)


    return {
      isOk: true
    }
  }
}
