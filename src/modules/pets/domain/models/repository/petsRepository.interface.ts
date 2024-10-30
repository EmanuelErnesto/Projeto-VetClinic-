import { CreatePetDto } from "../../dtos/request/CreatePet.dto";
import { IPet } from "../entity/pet.interface";

export interface IPetsRepository {
  findAll(): Promise<IPet[]>;
  findById(id: number): Promise<IPet | null>;
  findByTutorId(tutor_id: number): Promise<IPet | null>;
  findByAllData(createPetDto: CreatePetDto): Promise<IPet | null>;
  create(createPetDto: CreatePetDto): Promise<IPet>;
  save(pet: IPet): Promise<IPet>;
  remove(pet: IPet): Promise<void>;
}
