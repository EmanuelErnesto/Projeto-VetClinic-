import { PetsRepositoryInMemory } from "@modules/pets/domain/models/repository/PetsRepositoryInMemory";
import { CreatePetDto } from "@modules/pets/domain/dtos/request/CreatePet.dto";
import { ListPetService } from "@modules/pets/services/ListPetService";

let petsRepositoryInMemory: PetsRepositoryInMemory;
let listPetsService: ListPetService;

describe("ListPets", () => {
  beforeEach(async () => {
    petsRepositoryInMemory = new PetsRepositoryInMemory();
    listPetsService = new ListPetService(petsRepositoryInMemory);

    const createPets: CreatePetDto[] = [
      {
        tutor_id: 1,
        name: "Lilo",
        species: "dog",
        carry: "p",
        weight: 5,
        date_of_birth: "1993-12-12 10:10",
      },
      {
        tutor_id: 1,
        name: "Milo",
        species: "cat",
        carry: "m",
        weight: 3.5,
        date_of_birth: "2021-05-15 09:00",
      },
      {
        tutor_id: 2,
        name: "Biscoito",
        species: "dog",
        carry: "m",
        weight: 7,
        date_of_birth: "2020-08-21 15:45",
      },
    ];

    for (const pet of createPets) {
      await petsRepositoryInMemory.create(pet);
    }
  });

  it("Should be able to return a list of pets", async () => {
    const pets = await listPetsService.execute();

    expect(pets.length).toBeGreaterThan(0);
    expect(pets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Lilo" }),
        expect.objectContaining({ name: "Milo" }),
        expect.objectContaining({ name: "Biscoito" }),
      ]),
    );
  });

  it("Should return pets with the correct properties", async () => {
    const pets = await listPetsService.execute();

    pets.forEach((pet) => {
      expect(pet).toHaveProperty("id");
      expect(pet).toHaveProperty("tutor_id");
      expect(pet).toHaveProperty("name");
      expect(pet).toHaveProperty("species");
      expect(pet).toHaveProperty("carry");
      expect(pet).toHaveProperty("weight");
      expect(pet).toHaveProperty("date_of_birth");
    });
  });
});
