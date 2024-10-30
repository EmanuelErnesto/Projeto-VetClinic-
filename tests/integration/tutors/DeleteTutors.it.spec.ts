import CreateTutorDto from "@modules/tutors/domain/dtos/request/CreateTutor.dto";
import { TutorsRepositoryInMemory } from "@modules/tutors/domain/models/repositories/TutorsRepositorsInMemory";
import DeleteTutorService from "@modules/tutors/services/DeleteTutorService";
import { TUTOR_NOT_FOUND } from "@shared/consts/TutorErrorMessageConsts";
import HttpNotFoundError from "@shared/errors/HttpNotFoundError";

let tutorsRepositoryInMemory: TutorsRepositoryInMemory;
let deleteTutorsService: DeleteTutorService;
describe("DeleteTutors", async () => {
  beforeEach(async () => {
    tutorsRepositoryInMemory = new TutorsRepositoryInMemory();
    deleteTutorsService = new DeleteTutorService(tutorsRepositoryInMemory);
  });

  it("Should be able to delete a tutor that exists", async () => {
    const createTutor: CreateTutorDto = {
      name: "Lucas Almeida",
      phone: "21912345678",
      email: "lucas.almeida@email.com",
      date_of_birth: "1987-11-22 14:30",
      zip_code: "12345678",
    };
    const tutor = await tutorsRepositoryInMemory.create(createTutor);

    expect(deleteTutorsService.execute(tutor.id)).resolves;
  });

  it("Should not be able to delete a tutor that not exists", async () => {
    const idOfAInexistentTutor = 9999;

    const expectedResponse = new HttpNotFoundError(TUTOR_NOT_FOUND);

    try {
      await deleteTutorsService.execute(idOfAInexistentTutor);
    } catch (error) {
      expect(error).toEqual(expectedResponse);
      expect(error).toBeInstanceOf(HttpNotFoundError);
    }
  });
});
