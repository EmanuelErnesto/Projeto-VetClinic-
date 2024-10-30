import DeleteTutorService from "@modules/tutors/services/DeleteTutorService";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { Request, Response } from "express";
import { container } from "tsyringe";

export class DeleteTutorController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    const deleteTutorService = container.resolve(DeleteTutorService);

    await deleteTutorService.execute(Number(id));

    return response.status(HttpStatusCode.NO_CONTENT).json();
  }
}
