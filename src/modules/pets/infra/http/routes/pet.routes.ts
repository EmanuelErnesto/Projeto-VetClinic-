import { Router } from "express";
import CreatePetController from "../controllers/CreatePetController";
import ListPetController from "../controllers/ListPetController";
import ShowPetController from "../controllers/ShowPetController";
import UpdatePetController from "../controllers/UpdatePetController";
import DeletePetController from "../controllers/DeletePetController";
import { RequestDataValidator } from "@shared/infra/http/middlewares/RequestDataValidator";
import { CreatePetSchema } from "../joi/CreatePetSchema";
import { RequestParamsDataValidator } from "@shared/infra/http/middlewares/RequestParamDataValidator";
import { ShowPetSchema } from "../joi/ShowPetSchema";
import { UpdatePetSchema } from "../joi/UpdatePetSchema";
import { RequestUpdateEntityDataValidator } from "@shared/infra/http/middlewares/RequestUpdateEntityValidator";

const createPetController = new CreatePetController();
const listPetController = new ListPetController();
const showPetController = new ShowPetController();
const updatePetController = new UpdatePetController();
const deletePetController = new DeletePetController();

const router = Router();

router.post(
  "/:tutorId",
  RequestDataValidator(CreatePetSchema),
  createPetController.execute,
);

router.get("/", listPetController.execute);

router.get(
  "/:id",
  RequestParamsDataValidator(ShowPetSchema),
  showPetController.execute,
);

router.put(
  "/:id/tutor/:tutorId",
  RequestUpdateEntityDataValidator(UpdatePetSchema),
  RequestParamsDataValidator(ShowPetSchema),
  updatePetController.execute,
);

router.delete(
  "/:id/tutor/:tutorId",
  RequestParamsDataValidator(ShowPetSchema),
  deletePetController.execute,
);

export { router as petRouter };
