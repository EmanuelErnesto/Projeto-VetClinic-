import CreateTutorDto from "@modules/tutors/domain/dtos/request/CreateTutor.dto";
import { TutorResponseDto } from "@modules/tutors/domain/dtos/response/TutorResponse.dto";
import { TutorsRepositoryInMemory } from "@modules/tutors/domain/models/repositories/TutorsRepositorsInMemory";
import Tutor from "@modules/tutors/infra/typeorm/entities/Tutor";
import ShowTutorService from "@modules/tutors/services/ShowTutorService";
import { TUTOR_NOT_FOUND } from "@shared/consts/TutorErrorMessageConsts";
import HttpNotFoundError from "@shared/errors/HttpNotFoundError";

let showTutorsService: ShowTutorService;
let tutorsRepositoryInMemory: TutorsRepositoryInMemory;

describe("ShowTutor", async () => {
  beforeEach(async () => {
    tutorsRepositoryInMemory = new TutorsRepositoryInMemory();
    showTutorsService = new ShowTutorService(tutorsRepositoryInMemory);
  });

  it("Should be able to return a tutor that exists", async () => {
    const tutorToCreate: CreateTutorDto = {
      name: "Fernanda Ribeiro",
      phone: "21876543210",
      email: "fernanda.ribeiro@email.com",
      date_of_birth: "1990-07-15 09:45",
      zip_code: "98765432",
    };

    const createdTutor: Tutor =
      await tutorsRepositoryInMemory.create(tutorToCreate);

    const retrievedTutor: TutorResponseDto = await showTutorsService.execute(
      createdTutor.id,
    );

    expect(retrievedTutor).toBeInstanceOf(TutorResponseDto);
    expect(retrievedTutor).toHaveProperty("id");
    expect(retrievedTutor).toHaveProperty("name");
    expect(retrievedTutor).toEqual(createdTutor);
  });

  it("Should not be able to return a tutor that not exists", async () => {
    const idOfAInexistentTutor = 9999;

    const expectedResponse: HttpNotFoundError = new HttpNotFoundError(
      TUTOR_NOT_FOUND,
    );

    try {
      await showTutorsService.execute(idOfAInexistentTutor);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpNotFoundError);
      expect(error).toEqual(expectedResponse);
    }
  });
});
