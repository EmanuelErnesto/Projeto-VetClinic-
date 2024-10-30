import { CreatePetDto } from "@modules/pets/domain/dtos/request/CreatePet.dto";
import { UpdatePetDto } from "@modules/pets/domain/dtos/request/UpdatePet.dto";
import PetResponseDto from "@modules/pets/domain/dtos/response/PetResponse.dto";
import { PetsRepositoryInMemory } from "@modules/pets/domain/models/repository/PetsRepositoryInMemory";
import { UpdatePetService } from "@modules/pets/services/UpdatePetService";
import CreateTutorDto from "@modules/tutors/domain/dtos/request/CreateTutor.dto";
import { TutorsRepositoryInMemory } from "@modules/tutors/domain/models/repositories/TutorsRepositorsInMemory";
import {
  PET_ALREADY_EXISTS,
  PET_NOT_FOUND,
} from "@shared/consts/PetErrorMessageConsts";
import { TUTOR_NOT_FOUND } from "@shared/consts/TutorErrorMessageConsts";
import HttpBadRequestError from "@shared/errors/HttpBadRequestError";
import HttpNotFoundError from "@shared/errors/HttpNotFoundError";

let updatePetsService: UpdatePetService;
let petsRepositoryInMemory: PetsRepositoryInMemory;
let tutorsRepositoryInMemory: TutorsRepositoryInMemory;
let tutorId: number;
let petId: number;
const createTutor: CreateTutorDto = {
  name: "Carlos",
  phone: "21998765432",
  email: "carlos@email.com",
  date_of_birth: "1985-11-03 14:20",
  zip_code: "12345678",
};

describe("UpdatePets", () => {
  beforeEach(async () => {
    petsRepositoryInMemory = new PetsRepositoryInMemory();
    tutorsRepositoryInMemory = new TutorsRepositoryInMemory();
    updatePetsService = new UpdatePetService(
      petsRepositoryInMemory,
      tutorsRepositoryInMemory,
    );

    tutorId = (await tutorsRepositoryInMemory.create(createTutor)).id;

    const createPet: CreatePetDto = {
      tutor_id: tutorId,
      name: "Nina",
      species: "dog",
      carry: "p",
      weight: 10,
      date_of_birth: "2019-02-10 09:00",
    };

    petId = (await petsRepositoryInMemory.create(createPet)).id;
  });

  it("Should be able to update a pet that exists", async () => {
    const updatePet: UpdatePetDto = {
      id: petId,
      tutor_id: tutorId,
      name: "Simba",
      species: "cat",
      carry: "m",
      weight: 7,
      date_of_birth: "2021-07-25 12:45",
    };

    const pet = await updatePetsService.execute(updatePet);

    expect(pet).toBeInstanceOf(PetResponseDto);
    expect(pet).toHaveProperty("id");
    expect(pet).toHaveProperty("tutor_id");
    expect(pet).toHaveProperty("name");
    expect(pet).toHaveProperty("species");
  });

  it("Should not be able to update a pet that not exists", async () => {
    const updatePet: UpdatePetDto = {
      id: 99999,
      tutor_id: tutorId,
      name: "Chester",
      species: "dog",
      carry: "p",
      weight: 12,
      date_of_birth: "2018-09-15 08:30",
    };

    const expectedResponse: HttpNotFoundError = new HttpNotFoundError(
      PET_NOT_FOUND,
    );

    try {
      await updatePetsService.execute(updatePet);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpNotFoundError);
      expect(error).toEqual(expectedResponse);
    }
  });

  it("Should not be able to update a pet that tutor does not exists", async () => {
    const updatePet: UpdatePetDto = {
      id: petId,
      tutor_id: 9999,
      name: "Toby",
      species: "rabbit",
      carry: "m",
      weight: 3,
      date_of_birth: "2020-04-05 14:15",
    };

    const expectedResponse: HttpNotFoundError = new HttpNotFoundError(
      TUTOR_NOT_FOUND,
    );

    try {
      await updatePetsService.execute(updatePet);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpNotFoundError);
      expect(error).toEqual(expectedResponse);
    }
  });

  it("Should not be able to update a pet with data of other existent pet", async () => {
    const createPet: CreatePetDto = {
      tutor_id: tutorId,
      name: "Bella",
      species: "dog",
      carry: "p",
      weight: 8,
      date_of_birth: "2022-01-10 16:00",
    };

    const updatePet: UpdatePetDto = {
      id: petId,
      tutor_id: tutorId,
      name: "Bella",
      species: "dog",
      carry: "p",
      weight: 8,
      date_of_birth: "2022-01-10 16:00",
    };

    const expectedResponse: HttpBadRequestError = new HttpBadRequestError(
      PET_ALREADY_EXISTS,
    );

    await petsRepositoryInMemory.create(createPet);

    try {
      await updatePetsService.execute(updatePet);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpBadRequestError);
      expect(error).toEqual(expectedResponse);
    }
  });
});
