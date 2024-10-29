import { CreatePetDto } from "@modules/pets/domain/dtos/request/CreatePet.dto";
import { CreatePetService } from "@modules/pets/services/CreatePetService";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { Request, Response } from "express";
import { container } from "tsyringe";

export default class CreatePetController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const {
      tutor_id,
      name,
      carry,
      species,
      weight,
      date_of_birth,
    }: CreatePetDto = request.body;

    const createPetService = container.resolve(CreatePetService);

    const createPet: CreatePetDto = {
      tutor_id,
      name,
      carry,
      species,
      weight,
      date_of_birth,
    };

    const pet = await createPetService.execute(createPet);

    return response.status(HttpStatusCode.CREATED).json(pet);
  }
}
