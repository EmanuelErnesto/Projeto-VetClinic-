import { inject, injectable } from "tsyringe";
import ITutorRepository from "../domain/models/repositories/TutorsRepository.interface";
import HttpNotFoundError from "@shared/errors/HttpNotFoundError";
import { TUTOR_NOT_FOUND } from "@shared/consts/TutorErrorMessageConsts";
import TutorMapper from "../domain/mappers/TutorMapper";
import { TutorResponseDto } from "../domain/dtos/response/TutorResponse.dto";

@injectable()
class ShowTutorService {
  constructor(
    @inject("TutorsRepository")
    private tutorsRepository: ITutorRepository,
  ) {}

  public async execute(id: number): Promise<TutorResponseDto> {
    const tutor = await this.tutorsRepository.findById(id);

    if (!tutor) throw new HttpNotFoundError(TUTOR_NOT_FOUND);

    return TutorMapper.MappingToTutorResponseDto(tutor);
  }
}

export default ShowTutorService;
