import { Router } from "express";
import tutorRouter from "@modules/tutors/infra/http/routes/tutors.routes";
import { petRouter } from "@modules/pets/infra/http/routes/pet.routes";

export const router = Router();

router.use("/tutors", tutorRouter);
router.use("/pets", petRouter);
