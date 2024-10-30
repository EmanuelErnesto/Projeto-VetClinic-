import { Pet } from "@modules/pets/infra/typeorm/entities/Pet";
import { CreatePetDto } from "../../dtos/request/CreatePet.dto";
import { IPet } from "../entity/pet.interface";
import { IPetsRepository } from "./petsRepository.interface";

export class PetsRepositoryInMemory implements IPetsRepository {
  private pets: IPet[] = [];

  public async findAll(): Promise<IPet[]> {
    return this.pets;
  }

  public async findById(id: number): Promise<IPet | null> {
    return this.pets.find((pet) => pet.id === id) || null;
  }

  public async findByTutorId(tutor_id: number): Promise<IPet | null> {
    return this.pets.find((pet) => pet.tutor_id === tutor_id) || null;
  }
  public async findByAllData(createPetDto: CreatePetDto): Promise<IPet | null> {
    return this.pets.find((pet) => pet === createPetDto) || null;
  }

  public async create(createPetDto: CreatePetDto): Promise<IPet> {
    const pet = new Pet();

    pet.id = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
    pet.tutor_id = createPetDto.tutor_id;
    pet.name = createPetDto.name;
    pet.carry = createPetDto.carry;
    pet.date_of_birth = createPetDto.date_of_birth;
    pet.species = createPetDto.species;
    pet.weight = createPetDto.weight;

    this.pets.push(pet);

    return pet;
  }

  public async save(pet: IPet): Promise<IPet> {
    const petIndex = this.pets.findIndex((findPet) => (findPet.id = pet.id));

    this.pets[petIndex] = pet;

    return pet;
  }

  public async remove(pet: IPet): Promise<void> {
    const index = this.pets.findIndex((petIndex) => petIndex.id === pet.id);

    if (index !== -1) {
      this.pets.splice(index, 1);
    }
  }
}
