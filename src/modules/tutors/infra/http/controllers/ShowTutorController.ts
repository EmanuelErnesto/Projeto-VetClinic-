import ShowTutorService from "@modules/tutors/services/ShowTutorService";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { Request, Response } from "express";
import { container } from "tsyringe";

export class ShowTutorController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    const showTutorService = container.resolve(ShowTutorService);

    const tutor = await showTutorService.execute(Number(id));

    return response.status(HttpStatusCode.Ok).json(tutor);
  }
}
