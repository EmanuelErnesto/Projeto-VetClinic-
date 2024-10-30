import { Router } from "express";
import { RequestDataValidator } from "@shared/infra/http/middlewares/RequestDataValidator";
import { CreateTutorSchema } from "../joi/schemas/CreateTutor.schema";
import { CreateTutorController } from "../controllers/CreateTutorController";
import ListTutorController from "../controllers/ListTutorController";
import { RequestParamsDataValidator } from "@shared/infra/http/middlewares/RequestParamDataValidator";
import { ShowTutorSchema } from "../joi/schemas/ShowTutor.schema";
import { ShowTutorController } from "../controllers/ShowTutorController";
import { DeleteTutorController } from "../controllers/DeleteTutorController";
import { RequestUpdateEntityDataValidator } from "@shared/infra/http/middlewares/RequestUpdateEntityValidator";
import { UpdateTutorSchema } from "../joi/schemas/UpdateTutor.schema";
import { UpdateTutorController } from "../controllers/UpdateTutorController";

const tutorRouter = Router();

const createTutorController = new CreateTutorController();
const listTutorController = new ListTutorController();
const showTutorController = new ShowTutorController();
const updateTutorController = new UpdateTutorController();
const deleteTutorController = new DeleteTutorController();

tutorRouter.post(
  "/",
  RequestDataValidator(CreateTutorSchema),
  createTutorController.execute,
);

tutorRouter.get("/", listTutorController.execute);

tutorRouter.get(
  "/:id",
  RequestParamsDataValidator(ShowTutorSchema),
  showTutorController.execute,
);

tutorRouter.delete(
  "/:id",
  RequestParamsDataValidator(ShowTutorSchema),
  deleteTutorController.execute,
);

tutorRouter.put(
  "/:id",
  RequestUpdateEntityDataValidator(UpdateTutorSchema),
  updateTutorController.execute,
);

export default tutorRouter;
