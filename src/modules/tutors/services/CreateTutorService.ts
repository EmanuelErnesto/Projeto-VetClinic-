import { inject, injectable } from "tsyringe";
import CreateTutorDto from "../domain/dtos/request/CreateTutor.dto";
import HttpBadRequestError from "@shared/errors/HttpBadRequestError";
import {
  EMAIL_ALREADY_USED,
  PHONE_ALREADY_USED,
} from "@shared/consts/TutorErrorMessageConsts";
import TutorMapper from "../domain/mappers/TutorMapper";
import ITutorsRepository from "../domain/models/repositories/TutorsRepository.interface";
import { TutorResponseDto } from "../domain/dtos/response/TutorResponse.dto";

@injectable()
class CreateTutorService {
  constructor(
    @inject("TutorsRepository")
    private tutorsRepository: ITutorsRepository,
  ) {}

  public async execute(
    createTutorDto: CreateTutorDto,
  ): Promise<TutorResponseDto> {
    const tutorEmailExists = await this.tutorsRepository.findByEmail(
      createTutorDto.email,
    );

    if (tutorEmailExists) throw new HttpBadRequestError(EMAIL_ALREADY_USED);

    const tutorPhoneExists = await this.tutorsRepository.findByPhone(
      createTutorDto.phone,
    );

    if (tutorPhoneExists) throw new HttpBadRequestError(PHONE_ALREADY_USED);

    const tutor = await this.tutorsRepository.create(createTutorDto);

    await this.tutorsRepository.save(tutor);

    return TutorMapper.MappingToTutorResponseDto(tutor);
  }
}

export default CreateTutorService;
