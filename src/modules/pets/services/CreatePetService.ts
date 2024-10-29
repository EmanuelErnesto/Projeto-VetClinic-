import { inject, injectable } from "tsyringe";
import { IPetsRepository } from "../domain/models/repository/petsRepository.interface";
import { CreatePetDto } from "../domain/dtos/request/CreatePet.dto";
import PetResponseDto from "../domain/dtos/response/PetResponse.dto";
import ITutorsRepository from "@modules/tutors/domain/models/repositories/TutorsRepository.interface";
import HttpNotFoundError from "@shared/errors/HttpNotFoundError";
import { TUTOR_NOT_FOUND } from "@shared/consts/TutorErrorMessageConsts";
import PetMapper from "../domain/mappers/PetMapper";
import HttpBadRequestError from "@shared/errors/HttpBadRequestError";
import { PET_ALREADY_EXISTS } from "@shared/consts/PetErrorMessageConsts";

@injectable()
export class CreatePetService {
  constructor(
    @inject("PetsRepository")
    private petRepository: IPetsRepository,

    @inject("TutorsRepository")
    private tutorsRepository: ITutorsRepository,
  ) {}

  public async execute(createPetDto: CreatePetDto): Promise<PetResponseDto> {
    const petAlreadyExists =
      await this.petRepository.findByAllData(createPetDto);

    if (petAlreadyExists) throw new HttpBadRequestError(PET_ALREADY_EXISTS);

    const tutorExists = await this.tutorsRepository.findById(
      createPetDto.tutor_id,
    );

    if (!tutorExists) throw new HttpNotFoundError(TUTOR_NOT_FOUND);

    const pet = await this.petRepository.create(createPetDto);

    await this.petRepository.save(pet);

    return PetMapper.MappingToPetResponseDto(pet);
  }
}
