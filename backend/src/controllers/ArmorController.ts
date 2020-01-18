import { Request, Response } from "express";
import { getRepository } from "typeorm";

import { Armor } from "../entity/Armor";
import { Item } from "../entity/Item";

class ArmorController {
  static listAll = async (req: Request, res: Response) => {
    //Get armors from database
    const armorRepository = getRepository(Armor);
    const armors = await armorRepository.find({
      order: { name: "ASC" }
    });

    // const itemRepository = getRepository(Item);

    // for (let index = 0; index < armors.length; index++) {
    //   const items = await itemRepository.find({
    //     where: { armor: armors[index] }
    //   });
    //   armors[index].composition = items;
    // }

    //Send the armors object
    res.send(armors);
  };

  static getOneByName = async (req: Request, res: Response) => {
    //Get the name from the url
    const name: string = req.params.name;

    //Get the armor from database
    const armorRepository = getRepository(Armor);
    try {
      const armor = await armorRepository.findOneOrFail({
        where: { name: name }
      });

      const itemRepository = getRepository(Item);

      const items = await itemRepository.find({
        where: { armor: armor }
      });
      armor.composition = items;

      res.status(200).send(armor);
    } catch (error) {
      res.status(404).send("Armor not found");
    }
  };

  static newArmor = async (req: Request, res: Response) => {
    //Get parameters from the body
    const armor: Armor = { ...req.body };

    const armorController = new ArmorController();

    const isValide = await armorController.armorIsValide(armor, res);
    if (!isValide) {
      return;
    }

    //Try to save. If fails, the armorname is already in use
    const armorRepository = getRepository(Armor);
    try {
      await armorRepository.save(armor);
    } catch (e) {
      res.status(409).send("armor name already in use");
      return;
    }

    //If all ok, send 201 response
    res.status(201).send(armor);
  };

  static editArmor = async (req: Request, res: Response) => {
    //Get the name from the url
    const name: string = req.params.name;

    //Get values from the body
    const armor: Armor = { ...req.body };

    const armorController = new ArmorController();

    const isValide = await armorController.armorIsValide(armor, res);
    if (!isValide) {
      return;
    }

    const armorRepository = getRepository(Armor);

    try {
      //await armorRepository.update({ name: name }, armor);
      const oldArmor = await armorRepository.findOneOrFail({ name: name });
      if (oldArmor) {
        await armorRepository.delete({ name: name });
        await armorRepository.save(armor);
      }
    } catch (error) {
      //If not found, send a 404 response
      console.log("error:", error);
      res.status(404).send("Armor not found");
      return;
    }

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static deleteArmor = async (req: Request, res: Response) => {
    //Get the name from the url
    const name = req.params.name;

    const armorRepository = getRepository(Armor);
    let armor: Armor;
    try {
      armor = await armorRepository.findOneOrFail({
        where: { name: name }
      });
    } catch (error) {
      res.status(404).send("Armor not found");
      return;
    }
    armorRepository.delete({ name: name });

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  public armorIsValide = async (armor: Armor, res: Response) => {
    const itemTypes = ["helmet", "arm", "torso", "leg", "cape"];
    const armorComposition = [];

    armor.composition.forEach(item => {
      // check if item type is correct
      if (!(itemTypes.indexOf(item.type) > -1)) {
        res
          .status(400)
          .send(
            `Item type: '${item.type}' isn't good. Item types are 'helmet', 'arm', 'torso', 'leg', 'cape'.`
          );
        return false;
      }
      // check if item type is unique
      if (!armorComposition[item.type]) {
        armorComposition[item.type] = item;
      } else {
        res.status(400).send(`Item type: '${item.type}' isn't unique.`);
        return false;
      }
    });

    if (armor.composition.length !== 5) {
      let emptyItems: string;

      itemTypes.forEach(type => {
        if (!armorComposition[type]) {
          if (!emptyItems) {
            emptyItems = `'${type}'`;
          } else {
            emptyItems += `, '${type}'`;
          }
        }
      });
      res.status(400).send(`Item types are missing: ${emptyItems}.`);
    }

    const itemRepository = getRepository(Item);

    let inexistantItems: string;

    for (let index = 0; index < armor.composition.length; index++) {
      try {
        await itemRepository.findOneOrFail(armor.composition[index]);
      } catch {
        if (!inexistantItems) {
          inexistantItems = `'${armor.composition[index].name}'`;
        } else {
          inexistantItems += `, '${armor.composition[index].name}'`;
        }
      }
    }

    if (inexistantItems) {
      res.status(400).send(`Items ${inexistantItems} don't exist.`);
      return false;
    }

    return true;
  };
}

export default ArmorController;
