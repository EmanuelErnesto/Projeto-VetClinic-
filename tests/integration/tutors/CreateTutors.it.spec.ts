import "reflect-metadata";
import CreateTutorService from "@modules/tutors/services/CreateTutorService";
import CreateTutorDto from "@modules/tutors/domain/dtos/request/CreateTutor.dto";
import { TutorResponseDto } from "@modules/tutors/domain/dtos/response/TutorResponse.dto";
import { TutorsRepositoryInMemory } from "@modules/tutors/domain/models/repositories/TutorsRepositorsInMemory";
import HttpBadRequestError from "@shared/errors/HttpBadRequestError";
import {
  EMAIL_ALREADY_USED,
  PHONE_ALREADY_USED,
} from "@shared/consts/TutorErrorMessageConsts";

let tutorsRepositoryInMemory: TutorsRepositoryInMemory;
let createTutorsService: CreateTutorService;

describe("CreateTutor", async () => {
  beforeEach(() => {
    tutorsRepositoryInMemory = new TutorsRepositoryInMemory();
    createTutorsService = new CreateTutorService(tutorsRepositoryInMemory);
  });

  it("Should be able to create a new tutor", async () => {
    const createTutor: CreateTutorDto = {
      name: "Julia",
      phone: "21912345678",
      email: "julia@email.com",
      date_of_birth: "1990-05-14 11:30",
      zip_code: "78901234",
    };

    const tutor = await createTutorsService.execute(createTutor);

    expect(tutor).toHaveProperty("id");
    expect(tutor).toHaveProperty("name");
    expect(tutor).toHaveProperty("phone");
    expect(tutor).toHaveProperty("email");
    expect(tutor).toHaveProperty("date_of_birth");
    expect(tutor).toHaveProperty("zip_code");
    expect(tutor).toBeInstanceOf(TutorResponseDto);
  });

  it("Should not be able to create a tutor with email that already exists", async () => {
    const createTutor: CreateTutorDto = {
      name: "Carlos Silva",
      phone: "21987654321",
      email: "carlos.silva@email.com",
      date_of_birth: "1985-11-22 09:15",
      zip_code: "12345678",
    };

    const createTutor2: CreateTutorDto = {
      name: "Carlos Magno",
      phone: "21934567890",
      email: "carlos.silva@email.com",
      date_of_birth: "1992-03-10 14:45",
      zip_code: "45678901",
    };

    const expectedResponse: HttpBadRequestError = new HttpBadRequestError(
      EMAIL_ALREADY_USED,
    );

    await createTutorsService.execute(createTutor);

    try {
      await createTutorsService.execute(createTutor2);
    } catch (error) {
      expect(error).toEqual(expectedResponse);
      expect(error).toBeInstanceOf(HttpBadRequestError);
    }
  });
  it("Should not be able to create a tutor with phone that already exists", async () => {
    const createTutor: CreateTutorDto = {
      name: "Carlos Silva",
      phone: "21987654321",
      email: "carlos.silva@email.com",
      date_of_birth: "1985-11-22 09:15",
      zip_code: "12345678",
    };

    const createTutor2: CreateTutorDto = {
      name: "Carlos Magno",
      phone: "21987654321",
      email: "carlos.magno@email.com",
      date_of_birth: "1992-03-10 14:45",
      zip_code: "45678901",
    };

    const expectedResponse: HttpBadRequestError = new HttpBadRequestError(
      PHONE_ALREADY_USED,
    );

    await createTutorsService.execute(createTutor);

    try {
      await createTutorsService.execute(createTutor2);
    } catch (error) {
      expect(error).toEqual(expectedResponse);
      expect(error).toBeInstanceOf(HttpBadRequestError);
    }
  });
});
