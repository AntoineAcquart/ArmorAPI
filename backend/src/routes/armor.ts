import { Router } from "express";
import ArmorController from "../controllers/ArmorController";

const router = Router();

//get all armors
router.get("/all", ArmorController.listAll);

//get one armor
router.get("/:name", ArmorController.getOneByName);

//create new armor
router.post("/", ArmorController.newArmor);

//edit an armor
router.put("/:name", ArmorController.editArmor);

//delete an armor
router.delete("/:name", ArmorController.deleteArmor);

export default router;
