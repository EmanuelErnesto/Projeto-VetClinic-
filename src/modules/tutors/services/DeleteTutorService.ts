import { inject, injectable } from "tsyringe";
import ITutorRepository from "../domain/models/repositories/TutorsRepository.interface";
import { TUTOR_NOT_FOUND } from "@shared/consts/TutorErrorMessageConsts";
import HttpNotFoundError from "@shared/errors/HttpNotFoundError";

@injectable()
class DeleteTutorService {
  constructor(
    @inject("TutorsRepository")
    private tutorsRepository: ITutorRepository,
  ) {}

  public async execute(id: number): Promise<void> {
    const tutor = await this.tutorsRepository.findById(id);

    if (!tutor) throw new HttpNotFoundError(TUTOR_NOT_FOUND);

    await this.tutorsRepository.remove(tutor);
  }
}

export default DeleteTutorService;
