import { inject, injectable } from "tsyringe";
import { IPetsRepository } from "../domain/models/repository/petsRepository.interface";
import PetResponseDto from "../domain/dtos/response/PetResponse.dto";
import PetMapper from "../domain/mappers/PetMapper";

@injectable()
export class ListPetService {
  constructor(
    @inject("PetsRepository")
    private petRepository: IPetsRepository,
  ) {}

  public async execute(): Promise<PetResponseDto[]> {
    const pets = await this.petRepository.findAll();

    return PetMapper.MappingPetListToPetResponseDto(pets);
  }
}
