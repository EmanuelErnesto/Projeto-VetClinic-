import { IPetsRepository } from "@modules/pets/domain/models/repository/petsRepository.interface";
import { Repository } from "typeorm";
import { Pet } from "../entities/Pet";
import { datasource } from "@shared/infra/typeorm/dataSource";
import { CreatePetDto } from "@modules/pets/domain/dtos/request/CreatePet.dto";
import { IPet } from "@modules/pets/domain/models/entity/pet.interface";

export class PetRepository implements IPetsRepository {
  private ormRepository: Repository<Pet>;

  constructor() {
    this.ormRepository = datasource.getRepository(Pet);
  }

  public async findAll(): Promise<IPet[]> {
    return await this.ormRepository.find();
  }

  public async findById(id: number): Promise<IPet | null> {
    return await this.ormRepository.findOneBy({ id });
  }

  public async findByTutorId(tutor_id: number): Promise<IPet | null> {
    return await this.ormRepository.findOneBy({ tutor_id });
  }

  public async findByAllData(createPetDto: CreatePetDto): Promise<IPet | null> {
    return await this.ormRepository.findOne({
      where: {
        name: createPetDto.name,
        species: createPetDto.species,
        carry: createPetDto.carry,
        weight: createPetDto.weight,
        date_of_birth: createPetDto.date_of_birth,
      },
    });
  }

  public async create(createPetDto: CreatePetDto): Promise<IPet> {
    return this.ormRepository.create(createPetDto);
  }

  public async save(pet: IPet): Promise<IPet> {
    return await this.ormRepository.save(pet);
  }

  public async remove(pet: IPet): Promise<void> {
    await this.ormRepository.delete(pet);
  }
}
