import Tutor from "@modules/tutors/infra/typeorm/entities/Tutor";
import ITutor from "../models/entity/tutor.interface";
import UpdateTutorDto from "../dtos/request/UpdateTutor.dto";
import {
  TutorResponseDto,
  TutorResponseDtoProperties,
} from "../dtos/response/TutorResponse.dto";

class TutorMapper {
  static MappingToTutorResponseDto(tutor: ITutor): TutorResponseDto {
    const tutorProps: TutorResponseDtoProperties = {
      id: tutor.id,
      name: tutor.name,
      email: tutor.email,
      phone: tutor.phone,
      zip_code: tutor.zip_code,
      date_of_birth: tutor.date_of_birth,
      pets: tutor.pets,
    };

    return new TutorResponseDto(tutorProps);
  }

  static MappingTutorListToTutorResponseDto(
    tutors: ITutor[],
  ): TutorResponseDto[] {
    const tutorsFormatted: TutorResponseDto[] = tutors.map((tutor) => {
      return this.MappingToTutorResponseDto(tutor);
    });

    return tutorsFormatted;
  }

  static TransferUpdateTutorDtoPropsToTutorEntity(
    updateTutorDto: UpdateTutorDto,
    tutor: Tutor,
  ): void {
    tutor.name = updateTutorDto.name;
    tutor.phone = updateTutorDto.phone;
    tutor.email = updateTutorDto.email;
    tutor.pets = updateTutorDto.pets;
    tutor.date_of_birth = updateTutorDto.date_of_birth;
    tutor.zip_code = updateTutorDto.zip_code;
  }
}

export default TutorMapper;
