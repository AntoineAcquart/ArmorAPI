import { Router } from "express";
import ItemController from "../controllers/ItemController";

const router = Router();

//get all items
router.get("/all", ItemController.listAll);

//get one item
router.get("/:name", ItemController.getOneByName);

//create new item
router.post("/", ItemController.newItem);

//edit an item
router.put("/:name", ItemController.editItem);

//delete an item
router.delete("/:name", ItemController.deleteItem);

export default router;
