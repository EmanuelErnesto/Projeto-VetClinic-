import { ListPetService } from "@modules/pets/services/ListPetService";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { Request, Response } from "express";
import { container } from "tsyringe";

export default class ListPetController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const listPetController = container.resolve(ListPetService);

    const pets = await listPetController.execute();

    return response.status(HttpStatusCode.Ok).json(pets);
  }
}
