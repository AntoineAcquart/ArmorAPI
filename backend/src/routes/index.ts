import { Router, Request, Response, NextFunction } from "express";
import armor from "./armor";
import item from "./item";

function addType(type: string) {
  return function(req: Request, res: Response, next: NextFunction) {
    req.headers.itemType = type;
    next();
  };
}

const routes = Router();

routes.use("/armor", armor);

routes.use("/helmet", addType("helmet"), item);
routes.use("/arm", addType("arm"), item);
routes.use("/torso", addType("torso"), item);
routes.use("/leg", addType("leg"), item);
routes.use("/cape", addType("cape"), item);

export default routes;
