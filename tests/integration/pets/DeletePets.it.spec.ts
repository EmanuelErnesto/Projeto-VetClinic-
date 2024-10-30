import { CreatePetDto } from "@modules/pets/domain/dtos/request/CreatePet.dto";
import { PetsRepositoryInMemory } from "@modules/pets/domain/models/repository/PetsRepositoryInMemory";
import { DeletePetService } from "@modules/pets/services/DeletePetService";
import { PET_NOT_FOUND } from "@shared/consts/PetErrorMessageConsts";
import HttpNotFoundError from "@shared/errors/HttpNotFoundError";

let petsRepositoryInMemory: PetsRepositoryInMemory;
let deletePetsService: DeletePetService;

describe("DeletePets", () => {
  beforeEach(async () => {
    petsRepositoryInMemory = new PetsRepositoryInMemory();
    deletePetsService = new DeletePetService(petsRepositoryInMemory);
  });

  it("Should be able to delete a existent pet", async () => {
    const createPet: CreatePetDto = {
      tutor_id: 3,
      name: "Luna",
      species: "cat",
      carry: "m",
      weight: 4,
      date_of_birth: "2018-08-22 10:10",
    };

    const pet = await petsRepositoryInMemory.create(createPet);

    expect(deletePetsService.execute(pet.id)).resolves;
  });

  it("Should not be able to delete a pet that not exists", async () => {
    const idOfAInexistentPet: number = 9999;

    const expectedResponse: HttpNotFoundError = new HttpNotFoundError(
      PET_NOT_FOUND,
    );

    try {
      await deletePetsService.execute(idOfAInexistentPet);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpNotFoundError);
      expect(error).toEqual(expectedResponse);
    }
  });
});
