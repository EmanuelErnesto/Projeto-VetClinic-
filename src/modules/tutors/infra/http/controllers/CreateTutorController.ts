import CreateTutorDto from "@modules/tutors/domain/dtos/request/CreateTutor.dto";
import TutorResponseDto from "@modules/tutors/domain/dtos/response/TutorResponse.dto";
import CreateTutorService from "@modules/tutors/services/CreateTutorService";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { Request, Response } from "express";
import { container } from "tsyringe";

export class CreateTutorController {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { name, email, phone, date_of_birth, zip_code }: CreateTutorDto =
      request.body;

    const createTutorService = container.resolve(CreateTutorService);

    const createTutor: CreateTutorDto = {
      name,
      email,
      phone,
      date_of_birth,
      zip_code,
    };

    const tutor: TutorResponseDto =
      await createTutorService.execute(createTutor);

    return response.status(HttpStatusCode.CREATED).json(tutor);
  }
}
