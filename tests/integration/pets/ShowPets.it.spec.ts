import { CreatePetDto } from "@modules/pets/domain/dtos/request/CreatePet.dto";
import PetResponseDto from "@modules/pets/domain/dtos/response/PetResponse.dto";
import { PetsRepositoryInMemory } from "@modules/pets/domain/models/repository/PetsRepositoryInMemory";
import { ShowPetService } from "@modules/pets/services/ShowPetService";
import { PET_NOT_FOUND } from "@shared/consts/PetErrorMessageConsts";
import HttpNotFoundError from "@shared/errors/HttpNotFoundError";

let showPetsService: ShowPetService;
let petsRepositoryInMemory: PetsRepositoryInMemory;

describe("ShowPets", () => {
  beforeEach(async () => {
    petsRepositoryInMemory = new PetsRepositoryInMemory();
    showPetsService = new ShowPetService(petsRepositoryInMemory);
  });

  it("Should be able to return a pet that exists", async () => {
    const createPet: CreatePetDto = {
      tutor_id: 5,
      name: "Ziggy",
      species: "bird",
      carry: "p",
      weight: 0.5,
      date_of_birth: "2020-03-15 10:10",
    };

    const createdPet = await petsRepositoryInMemory.create(createPet);

    const retrievedPet = await showPetsService.execute(createdPet.id);

    expect(retrievedPet).toBeInstanceOf(PetResponseDto);
    expect(retrievedPet).toHaveProperty("id");
    expect(retrievedPet).toHaveProperty("name");
    expect(retrievedPet).toHaveProperty("species");
    expect(retrievedPet).toHaveProperty("carry");
    expect(retrievedPet).toHaveProperty("weight");
  });

  it("Should not be able to return a pet that not exists", async () => {
    const idOfInexistentPet: number = 9999;

    const expectedResponse: HttpNotFoundError = new HttpNotFoundError(
      PET_NOT_FOUND,
    );

    try {
      await showPetsService.execute(idOfInexistentPet);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpNotFoundError);
      expect(error).toEqual(expectedResponse);
    }
  });
});
