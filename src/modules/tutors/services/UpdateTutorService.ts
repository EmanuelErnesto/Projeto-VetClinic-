import { inject, injectable } from "tsyringe";
import ITutorRepository from "../domain/models/repositories/TutorsRepository.interface";
import UpdateTutorDto from "../domain/dtos/request/UpdateTutor.dto";
import HttpNotFoundError from "@shared/errors/HttpNotFoundError";
import {
  EMAIL_ALREADY_USED,
  PHONE_ALREADY_USED,
  TUTOR_NOT_FOUND,
} from "@shared/consts/TutorErrorMessageConsts";
import HttpBadRequestError from "@shared/errors/HttpBadRequestError";
import TutorMapper from "../domain/mappers/TutorMapper";
import { TutorResponseDto } from "../domain/dtos/response/TutorResponse.dto";

@injectable()
class UpdateTutorService {
  constructor(
    @inject("TutorsRepository")
    private tutorsRepository: ITutorRepository,
  ) {}

  public async execute(
    updateTutorDto: UpdateTutorDto,
  ): Promise<TutorResponseDto> {
    const tutorEmailExists = await this.tutorsRepository.findByEmail(
      updateTutorDto.email,
    );

    const tutor = await this.tutorsRepository.findById(updateTutorDto.id);

    if (!tutor) throw new HttpNotFoundError(TUTOR_NOT_FOUND);

    if (tutorEmailExists && tutorEmailExists.id !== tutor.id)
      throw new HttpBadRequestError(EMAIL_ALREADY_USED);

    const tutorPhoneExists = await this.tutorsRepository.findByPhone(
      updateTutorDto.phone,
    );

    if (tutorPhoneExists && tutorPhoneExists.id !== tutor.id)
      throw new HttpBadRequestError(PHONE_ALREADY_USED);

    TutorMapper.TransferUpdateTutorDtoPropsToTutorEntity(updateTutorDto, tutor);

    await this.tutorsRepository.save(tutor);

    return TutorMapper.MappingToTutorResponseDto(tutor);
  }
}

export default UpdateTutorService;
