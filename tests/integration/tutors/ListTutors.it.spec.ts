import CreateTutorDto from "@modules/tutors/domain/dtos/request/CreateTutor.dto";
import { TutorsRepositoryInMemory } from "@modules/tutors/domain/models/repositories/TutorsRepositorsInMemory";
import ListTutorService from "@modules/tutors/services/ListTutorService";

const tutorsToCreate: CreateTutorDto[] = [
  {
    name: "Ana Oliveira",
    phone: "21987654321",
    email: "ana.oliveira@email.com",
    date_of_birth: "1988-05-15 10:30",
    zip_code: "12345678",
  },
  {
    name: "Bruno Souza",
    phone: "21934567890",
    email: "bruno.souza@email.com",
    date_of_birth: "1990-08-22 12:00",
    zip_code: "23456789",
  },
  {
    name: "Fernanda Lima",
    phone: "21987654322",
    email: "fernanda.lima@email.com",
    date_of_birth: "1995-02-10 08:45",
    zip_code: "34567890",
  },
  {
    name: "Lucas Pereira",
    phone: "21934567891",
    email: "lucas.pereira@email.com",
    date_of_birth: "1987-11-30 15:20",
    zip_code: "45678901",
  },
  {
    name: "Juliana Costa",
    phone: "21987654323",
    email: "juliana.costa@email.com",
    date_of_birth: "1993-04-05 18:10",
    zip_code: "56789012",
  },
];

let tutorsRepositoryInMemory: TutorsRepositoryInMemory;
let listTutorsService: ListTutorService;

describe("ListTutor", async () => {
  beforeEach(async () => {
    tutorsRepositoryInMemory = new TutorsRepositoryInMemory();
    listTutorsService = new ListTutorService(tutorsRepositoryInMemory);

    for (const tutor of tutorsToCreate) {
      await tutorsRepositoryInMemory.create(tutor);
    }
  });

  it("Should be able to return a list of tutors", async () => {
    const tutors = await listTutorsService.execute();

    expect(tutors.length).toEqual(5);
    expect(tutors.length).toBeGreaterThan(0);
    expect(tutors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Ana Oliveira" }),
        expect.objectContaining({ name: "Lucas Pereira" }),
        expect.objectContaining({ name: "Juliana Costa" }),
        expect.objectContaining({ name: "Bruno Souza" }),
        expect.objectContaining({ name: "Fernanda Lima" }),
      ]),
    );
  });

  it("Should be able to return a list of tutors with the expected properties", async () => {
    const tutors = await listTutorsService.execute();

    tutors.forEach((tutor) => {
      expect(tutor).toHaveProperty("id");
      expect(tutor).toHaveProperty("phone");
      expect(tutor).toHaveProperty("date_of_birth");
      expect(tutor).toHaveProperty("email");
      expect(tutor).toHaveProperty("zip_code");
    });
  });
});
