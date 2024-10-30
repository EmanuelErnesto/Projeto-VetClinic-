import "dotenv/config";
import { DataSource } from "typeorm";
import Tutors from "@modules/tutors/infra/typeorm/entities/Tutor";
import { CreateTutors1727877805259 } from "./migrations/1727877805259-CreateTutors";
import { Pet } from "@modules/pets/infra/typeorm/entities/Pet";
import { CreatePetsTable1729031324865 } from "./migrations/1729031324865-CreatePetsTable";

export const datasource = new DataSource({
  type: "sqlite",
  database: process.env.DATABASE as string,
  synchronize: true,
  entities: [Tutors, Pet],
  migrations: [CreateTutors1727877805259, CreatePetsTable1729031324865],
  logging: false,
  busyTimeout: 10000,
});
