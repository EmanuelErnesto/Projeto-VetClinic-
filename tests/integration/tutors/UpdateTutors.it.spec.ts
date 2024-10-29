import CreateTutorDto from "@modules/tutors/domain/dtos/request/CreateTutor.dto";
import UpdateTutorDto from "@modules/tutors/domain/dtos/request/UpdateTutor.dto";
import { TutorResponseDto } from "@modules/tutors/domain/dtos/response/TutorResponse.dto";
import { TutorsRepositoryInMemory } from "@modules/tutors/domain/models/repositories/TutorsRepositorsInMemory";
import UpdateTutorService from "@modules/tutors/services/UpdateTutorService";
import {
  EMAIL_ALREADY_USED,
  PHONE_ALREADY_USED,
  TUTOR_NOT_FOUND,
} from "@shared/consts/TutorErrorMessageConsts";
import HttpBadRequestError from "@shared/errors/HttpBadRequestError";
import HttpNotFoundError from "@shared/errors/HttpNotFoundError";

const createTutor1: CreateTutorDto = {
  name: "Carlos Silva",
  phone: "21987654321",
  email: "carlos.silva@email.com",
  date_of_birth: "1985-02-10 12:00",
  zip_code: "23456789",
};

let tutorsRepositoryInMemory: TutorsRepositoryInMemory;
let updateTutorsService: UpdateTutorService;
let id: number;
describe("UpdateTutor", async () => {
  beforeEach(async () => {
    tutorsRepositoryInMemory = new TutorsRepositoryInMemory();
    updateTutorsService = new UpdateTutorService(tutorsRepositoryInMemory);

    id = (await tutorsRepositoryInMemory.create(createTutor1)).id;
  });

  it("Should be able to update a tutor that exists", async () => {
    const createTutor2: CreateTutorDto = {
      name: "Mariana Souza",
      phone: "21912345679",
      email: "mariana.souza@email.com",
      date_of_birth: "1992-09-30 16:15",
      zip_code: "34567890",
    };

    const updateTutor1: UpdateTutorDto = {
      id,
      name: "Roberto Martins",
      phone: "21965432109",
      email: "carlos.silva@email.com",
      pets: [],
      date_of_birth: "1980-12-05 08:30",
      zip_code: "45678901",
    };

    await tutorsRepositoryInMemory.create(createTutor2);
    const updatedTutor = await updateTutorsService.execute(updateTutor1);

    expect(updatedTutor).toHaveProperty("id");
    expect(updatedTutor).toBeInstanceOf(TutorResponseDto);
    expect(updatedTutor).toHaveProperty("phone");
    expect(updatedTutor).toHaveProperty("email");
  });

  it("Should not be able to update a tutor that not exists", async () => {
    const updateTutor: UpdateTutorDto = {
      id: 9999,
      name: "Ana Paula Ferreira",
      phone: "21932165487",
      email: "ana.ferreira@email.com",
      pets: [],
      date_of_birth: "1995-03-18 10:15",
      zip_code: "67890123",
    };

    const expectedResponse: HttpNotFoundError = new HttpNotFoundError(
      TUTOR_NOT_FOUND,
    );

    try {
      await updateTutorsService.execute(updateTutor);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpNotFoundError);
      expect(error).toEqual(expectedResponse);
    }
  });

  it("Should not be able to update a existent tutor with email of another existent tutor", async () => {
    const createTutor: CreateTutorDto = {
      name: "Thiago Oliveira",
      phone: "21998765432",
      email: "thiago.oliveira@email.com",
      date_of_birth: "1988-06-25 11:45",
      zip_code: "78901234",
    };

    const updateTutor: UpdateTutorDto = {
      id,
      name: "Thiago Oliveira Lima",
      phone: "21912345678",
      email: "thiago.oliveira@email.com",
      pets: [],
      date_of_birth: "1990-09-12 08:30",
      zip_code: "34567890",
    };

    const expectedResponse: HttpBadRequestError = new HttpBadRequestError(
      EMAIL_ALREADY_USED,
    );

    await tutorsRepositoryInMemory.create(createTutor);

    try {
      await updateTutorsService.execute(updateTutor);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpBadRequestError);
      expect(error).toEqual(expectedResponse);
    }
  });

  it("Should not be able to update a existent tutor with phone of another existent tutor", async () => {
    const createTutor: CreateTutorDto = {
      name: "Júlio César",
      phone: "21943210987",
      email: "julio.cesar@email.com",
      date_of_birth: "1984-01-20 17:00",
      zip_code: "45678901",
    };

    const updateTutor: UpdateTutorDto = {
      id,
      name: "Carlos Nogueira Nobre",
      phone: "21943210987",
      email: "carlos.nogueira@email.com",
      pets: [],
      date_of_birth: "1999-10-15 08:30",
      zip_code: "34567890",
    };

    const expectedResponse: HttpBadRequestError = new HttpBadRequestError(
      PHONE_ALREADY_USED,
    );

    await tutorsRepositoryInMemory.create(createTutor);

    try {
      await updateTutorsService.execute(updateTutor);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpBadRequestError);
      expect(error).toEqual(expectedResponse);
    }
  });
});
