import { CreatePetDto } from "@modules/pets/domain/dtos/request/CreatePet.dto";
import PetResponseDto from "@modules/pets/domain/dtos/response/PetResponse.dto";
import { PetsRepositoryInMemory } from "@modules/pets/domain/models/repository/PetsRepositoryInMemory";
import { CreatePetService } from "@modules/pets/services/CreatePetService";
import CreateTutorDto from "@modules/tutors/domain/dtos/request/CreateTutor.dto";
import { TutorsRepositoryInMemory } from "@modules/tutors/domain/models/repositories/TutorsRepositorsInMemory";
import { PET_ALREADY_EXISTS } from "@shared/consts/PetErrorMessageConsts";
import { TUTOR_NOT_FOUND } from "@shared/consts/TutorErrorMessageConsts";
import HttpBadRequestError from "@shared/errors/HttpBadRequestError";
import HttpNotFoundError from "@shared/errors/HttpNotFoundError";

let petsRepositoryInMemory: PetsRepositoryInMemory;
let tutorsRepositoryInMemory: TutorsRepositoryInMemory;
let createPetsService: CreatePetService;
let id: number;
let idTutor2: number;

describe("CreatePet", async () => {
  const createTutor1: CreateTutorDto = {
    name: "Patrícia Lima",
    phone: "21987654321",
    email: "patricia.lima@email.com",
    date_of_birth: "1992-11-09 14:45",
    zip_code: "23456789",
  };

  const createTutor2: CreateTutorDto = {
    name: "Felipe Andrade",
    phone: "21976543210",
    email: "felipe.andrade@email.com",
    date_of_birth: "1986-04-03 11:30",
    zip_code: "12345678",
  };

  beforeEach(async () => {
    petsRepositoryInMemory = new PetsRepositoryInMemory();
    tutorsRepositoryInMemory = new TutorsRepositoryInMemory();
    createPetsService = new CreatePetService(
      petsRepositoryInMemory,
      tutorsRepositoryInMemory,
    );

    id = (await tutorsRepositoryInMemory.create(createTutor1)).id;
    idTutor2 = (await tutorsRepositoryInMemory.create(createTutor2)).id;
  });

  it("Should be able to create a new pet", async () => {
    const createPet: CreatePetDto = {
      tutor_id: id,
      name: "Lilo",
      species: "dog",
      carry: "p",
      weight: 5,
      date_of_birth: "1993-12-12 10:10",
    };

    const pet = await createPetsService.execute(createPet);

    expect(pet).toHaveProperty("id");
    expect(pet).toHaveProperty("tutor_id");
    expect(pet).toBeInstanceOf(PetResponseDto);
  });

  it("Should not be able to create a pet with the same data of a pet that already exists", async () => {
    const createPet: CreatePetDto = {
      tutor_id: id,
      name: "Milo",
      species: "cat",
      carry: "m",
      weight: 3.5,
      date_of_birth: "2021-05-15 09:00",
    };

    const createPet2: CreatePetDto = {
      tutor_id: idTutor2,
      name: "Milo",
      species: "cat",
      carry: "m",
      weight: 3.5,
      date_of_birth: "2021-05-15 09:00",
    };

    const expectedResponse: HttpBadRequestError = new HttpBadRequestError(
      PET_ALREADY_EXISTS,
    );

    await createPetsService.execute(createPet);

    try {
      await createPetsService.execute(createPet2);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpBadRequestError);
      expect(error).toEqual(expectedResponse);
    }
  });

  it("Should not be able to create a pet that tutor does not exists", async () => {
    const createPet: CreatePetDto = {
      tutor_id: 9999,
      name: "Biscoito",
      species: "dog",
      carry: "m",
      weight: 7,
      date_of_birth: "2020-08-21 15:45",
    };

    const expectedResponse: HttpNotFoundError = new HttpNotFoundError(
      TUTOR_NOT_FOUND,
    );

    try {
      await createPetsService.execute(createPet);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpNotFoundError);
      expect(error).toEqual(expectedResponse);
    }
  });
});
