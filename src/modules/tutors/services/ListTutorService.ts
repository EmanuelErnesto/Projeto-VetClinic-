import { inject, injectable } from "tsyringe";
import ITutorRepository from "../domain/models/repositories/TutorsRepository.interface";
import TutorMapper from "../domain/mappers/TutorMapper";
import { TutorResponseDto } from "../domain/dtos/response/TutorResponse.dto";

@injectable()
class ListTutorService {
  constructor(
    @inject("TutorsRepository")
    private tutorsRepository: ITutorRepository,
  ) {}
  public async execute(): Promise<TutorResponseDto[]> {
    const tutors = await this.tutorsRepository.findAll();

    return TutorMapper.MappingTutorListToTutorResponseDto(tutors);
  }
}

export default ListTutorService;
