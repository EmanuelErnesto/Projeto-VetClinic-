import CreateTutorDto from "@modules/tutors/domain/dtos/request/CreateTutor.dto";
import UpdateTutorDto from "@modules/tutors/domain/dtos/request/UpdateTutor.dto";
import UpdateTutorService from "@modules/tutors/services/UpdateTutorService";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { Request, Response } from "express";
import { container } from "tsyringe";

export class UpdateTutorController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { name, email, phone, date_of_birth, zip_code }: CreateTutorDto =
      request.body;
    const { id } = request.params;

    const updateTutorService = container.resolve(UpdateTutorService);

    const updateTutor: UpdateTutorDto = {
      id: Number(id),
      name,
      email,
      phone,
      date_of_birth,
      zip_code,
    };

    const tutor = await updateTutorService.execute(updateTutor);

    return response.status(HttpStatusCode.Ok).json(tutor);
  }
}
