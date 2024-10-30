import { inject, injectable } from "tsyringe";
import { IPetsRepository } from "../domain/models/repository/petsRepository.interface";
import PetResponseDto from "../domain/dtos/response/PetResponse.dto";
import HttpNotFoundError from "@shared/errors/HttpNotFoundError";
import { PET_NOT_FOUND } from "@shared/consts/PetErrorMessageConsts";
import PetMapper from "../domain/mappers/PetMapper";

@injectable()
export class ShowPetService {
  constructor(
    @inject("PetsRepository")
    private petRepository: IPetsRepository,
  ) {}

  public async execute(id: number): Promise<PetResponseDto> {
    const pet = await this.petRepository.findById(id);

    if (!pet) throw new HttpNotFoundError(PET_NOT_FOUND);

    return PetMapper.MappingToPetResponseDto(pet);
  }
}
