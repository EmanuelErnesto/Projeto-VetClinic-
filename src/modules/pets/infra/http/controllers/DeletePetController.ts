import { DeletePetService } from "@modules/pets/services/DeletePetService";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { Request, Response } from "express";
import { container } from "tsyringe";

export default class DeletePetController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    const deletePetService = container.resolve(DeletePetService);

    await deletePetService.execute(Number(id));

    return response.status(HttpStatusCode.NO_CONTENT).json();
  }
}
