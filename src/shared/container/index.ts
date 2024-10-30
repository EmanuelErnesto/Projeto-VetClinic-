import "reflect-metadata";
import ITutorsRepository from "@modules/tutors/domain/models/repositories/TutorsRepository.interface";
import TutorsRepository from "@modules/tutors/infra/typeorm/repositories/TutorsRepository";
import { container } from "tsyringe";
import { IPetsRepository } from "@modules/pets/domain/models/repository/petsRepository.interface";
import { PetRepository } from "@modules/pets/infra/typeorm/repositories/Pet.repository";

container.registerSingleton<ITutorsRepository>(
  "TutorsRepository",
  TutorsRepository,
);

container.registerSingleton<IPetsRepository>("PetsRepository", PetRepository);
