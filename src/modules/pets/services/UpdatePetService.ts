import { inject, injectable } from "tsyringe";
import { IPetsRepository } from "../domain/models/repository/petsRepository.interface";
import PetResponseDto from "../domain/dtos/response/PetResponse.dto";
import { UpdatePetDto } from "../domain/dtos/request/UpdatePet.dto";
import ITutorsRepository from "@modules/tutors/domain/models/repositories/TutorsRepository.interface";
import HttpNotFoundError from "@shared/errors/HttpNotFoundError";
import {
  PET_ALREADY_EXISTS,
  PET_NOT_FOUND,
} from "@shared/consts/PetErrorMessageConsts";
import { TUTOR_NOT_FOUND } from "@shared/consts/TutorErrorMessageConsts";
import PetMapper from "../domain/mappers/PetMapper";
import HttpBadRequestError from "@shared/errors/HttpBadRequestError";

@injectable()
export class UpdatePetService {
  constructor(
    @inject("PetsRepository")
    private petsRepository: IPetsRepository,

    @inject("TutorsRepository")
    private tutorsRepository: ITutorsRepository,
  ) {}

  public async execute(updatePetDto: UpdatePetDto): Promise<PetResponseDto> {
    const pet = await this.petsRepository.findById(updatePetDto.id);

    if (!pet) throw new HttpNotFoundError(PET_NOT_FOUND);

    const tutorExists = await this.tutorsRepository.findById(
      updatePetDto.tutor_id,
    );

    if (!tutorExists) throw new HttpNotFoundError(TUTOR_NOT_FOUND);

    const petWithSameDataAlreadyExists =
      await this.petsRepository.findByAllData({
        name: updatePetDto.name,
        carry: updatePetDto.carry,
        date_of_birth: updatePetDto.date_of_birth,
        species: updatePetDto.species,
        tutor_id: updatePetDto.tutor_id,
        weight: updatePetDto.weight,
      });

    if (
      petWithSameDataAlreadyExists &&
      petWithSameDataAlreadyExists.id !== pet.id
    )
      throw new HttpBadRequestError(PET_ALREADY_EXISTS);

    PetMapper.TransferUpdateTutorDtoPropsToTutorEntity(
      updatePetDto,
      tutorExists,
      pet,
    );

    await this.petsRepository.save(pet);

    return PetMapper.MappingToPetResponseDto(pet);
  }
}
