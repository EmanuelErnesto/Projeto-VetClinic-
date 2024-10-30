import ListTutorService from "@modules/tutors/services/ListTutorService";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { Request, Response } from "express";
import { container } from "tsyringe";

class ListTutorController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const listTutorService = container.resolve(ListTutorService);

    const tutors = await listTutorService.execute();

    return response.status(HttpStatusCode.Ok).json(tutors);
  }
}

export default ListTutorController;
