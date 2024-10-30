import { Pet } from "@modules/pets/infra/typeorm/entities/Pet";
import { UpdatePetDto } from "../dtos/request/UpdatePet.dto";
import PetResponseDto, {
  PetResponseDtoProperties,
} from "../dtos/response/PetResponse.dto";
import { IPet } from "../models/entity/pet.interface";
import Tutor from "@modules/tutors/infra/typeorm/entities/Tutor";

class PetMapper {
  static MappingToPetResponseDto(pet: IPet): PetResponseDto {
    const petProps: PetResponseDtoProperties = {
      id: pet.id,
      tutor_id: pet.tutor_id,
      name: pet.name,
      species: pet.species,
      carry: pet.carry,
      weight: pet.weight,
      date_of_birth: pet.date_of_birth,
    };
    return new PetResponseDto(petProps);
  }

  static MappingPetListToPetResponseDto(pets: IPet[]): PetResponseDto[] {
    const petsFormatted: PetResponseDto[] = pets.map((pet) => {
      return this.MappingToPetResponseDto(pet);
    });

    return petsFormatted;
  }

  static TransferUpdateTutorDtoPropsToTutorEntity(
    updatePetDto: UpdatePetDto,
    tutor: Tutor,
    pet: Pet,
  ): void {
    pet.name = updatePetDto.name;
    pet.tutor = tutor;
    pet.tutor_id = updatePetDto.tutor_id;
    pet.species = updatePetDto.species;
    pet.carry = updatePetDto.carry;
    pet.weight = updatePetDto.weight;
    pet.date_of_birth = updatePetDto.date_of_birth;
  }
}

export default PetMapper;
