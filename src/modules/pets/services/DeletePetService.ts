import { inject, injectable } from "tsyringe";
import { IPetsRepository } from "../domain/models/repository/petsRepository.interface";
import HttpNotFoundError from "@shared/errors/HttpNotFoundError";
import { PET_NOT_FOUND } from "@shared/consts/PetErrorMessageConsts";

@injectable()
export class DeletePetService {
  constructor(
    @inject("PetsRepository")
    private petRepository: IPetsRepository,
  ) {}

  public async execute(id: number): Promise<void> {
    const pet = await this.petRepository.findById(id);

    if (!pet) throw new HttpNotFoundError(PET_NOT_FOUND);

    await this.petRepository.remove(pet);
  }
}
