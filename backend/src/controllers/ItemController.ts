import { Request, Response } from "express";
import { getRepository } from "typeorm";

import { Item } from "../entity/Item";

class ItemController {
  static listAll = async (req: Request, res: Response) => {
    const type = req.headers.itemType;
    //Get items from database
    const itemRepository = getRepository(Item);
    const items = await itemRepository.find({ where: { type: type } });

    //Send the items object
    res.send(items);
  };

  static getOneByName = async (req: Request, res: Response) => {
    //Get the name from the url
    const name: string = req.params.name;

    const type = req.headers.itemType;

    //Get the item from database
    const itemRepository = getRepository(Item);
    try {
      const item = await itemRepository.findOneOrFail({
        where: { name: name, type: type }
      });
      res.status(200).send(item);
    } catch (error) {
      res.status(404).send("Item not found");
    }
  };

  static newItem = async (req: Request, res: Response) => {
    //Get parameters from the body
    const item: Item = { ...req.body };

    const type = req.headers.itemType;

    if (item.type !== type) {
      res.status(400).send(`Item type isn't '${type}'`);
      return;
    }

    const itemController = new ItemController();

    const isValide = await itemController.itemIsValide(item, res);
    if (!isValide) {
      return;
    }

    const itemRepository = getRepository(Item);

    if (await itemRepository.findOne({ name: item.name })) {
      res.status(400).send(`Item name '${item.name}' is already in use.`);
      return false;
    }

    //Try to save. If fails, the item name is already in use
    try {
      await itemRepository.save(item);
    } catch (e) {
      res.status(409).send("item name already in use");
      return;
    }

    //If all ok, send 201 response
    res.status(201).send("Item created");
  };

  static editItem = async (req: Request, res: Response) => {
    //Get the name from the url
    const name: string = req.params.name;

    //Get values from the body
    const item: Item = { ...req.body };

    if (item.name !== name) {
      res.status(400).send(`Item name cannot be changed`);
      return;
    }

    const type = req.headers.itemType;

    if (item.type !== type) {
      res.status(400).send(`Item type isn't '${type}'`);
      return;
    }

    const itemController = new ItemController();

    const isValide = await itemController.itemIsValide(item, res);
    if (!isValide) {
      return;
    }

    const itemRepository = getRepository(Item);

    // if (await itemRepository.findOne({ name: item.name, type: type })) {
    //   res.status(400).send(`Item name '${item.name}' is already in use.`);
    //   return false;
    // }

    let update;

    try {
      update = await itemRepository.update({ name: name, type: type }, item);
      if (update.affected !== 1) {
        res.status(404).send("Item not found");
        return;
      }
    } catch (error) {
      //If not found, send a 404 response
      res.status(400).send("Error");
      return;
    }

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static deleteItem = async (req: Request, res: Response) => {
    //Get the name from the url
    const name = req.params.name;

    const type = req.headers.itemType;

    const itemRepository = getRepository(Item);
    let item: Item;
    try {
      item = await itemRepository.findOneOrFail({
        where: { name: name, type: type }
      });
    } catch (error) {
      res.status(404).send("Item not found");
      return;
    }
    itemRepository.delete({ name: name });

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  public itemIsValide = async (item: Item, res: Response) => {
    const itemTypes = ["helmet", "arm", "torso", "leg", "cape"];

    if (!(itemTypes.indexOf(item.type) > -1)) {
      res
        .status(400)
        .send(
          `Item type: '${item.type}' isn't good. Item types are 'helmet', 'arm', 'torso', 'leg', 'cape'.`
        );
      return false;
    }

    return true;
  };
}

export default ItemController;
