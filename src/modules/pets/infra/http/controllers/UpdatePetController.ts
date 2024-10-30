import { CreatePetDto } from "@modules/pets/domain/dtos/request/CreatePet.dto";
import { UpdatePetDto } from "@modules/pets/domain/dtos/request/UpdatePet.dto";
import { UpdatePetService } from "@modules/pets/services/UpdatePetService";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { Request, Response } from "express";
import { container } from "tsyringe";

export default class UpdatePetController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const {
      name,
      tutor_id,
      carry,
      species,
      weight,
      date_of_birth,
    }: CreatePetDto = request.body;
    const { id } = request.params;

    const updatePetService = container.resolve(UpdatePetService);

    const updatePetDto: UpdatePetDto = {
      id: Number(id),
      tutor_id,
      name,
      carry,
      species,
      weight,
      date_of_birth,
    };

    const pet = await updatePetService.execute(updatePetDto);

    return response.status(HttpStatusCode.Ok).json(pet);
  }
}
