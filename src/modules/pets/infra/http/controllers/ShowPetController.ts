import { ShowPetService } from "@modules/pets/services/ShowPetService";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { Request, Response } from "express";
import { container } from "tsyringe";

export default class ShowPetController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    const showPetService = container.resolve(ShowPetService);

    const pet = await showPetService.execute(Number(id));

    return response.status(HttpStatusCode.Ok).json(pet);
  }
}
