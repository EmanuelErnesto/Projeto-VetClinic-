import ITutorsRepository from "@modules/tutors/domain/models/repositories/TutorsRepository.interface";
import { Repository } from "typeorm";
import Tutor from "../entities/Tutor";
import ITutor from "@modules/tutors/domain/models/entity/tutor.interface";
import CreateTutorDto from "@modules/tutors/domain/dtos/request/CreateTutor.dto";
import { datasource } from "@shared/infra/typeorm/dataSource";

class TutorsRepository implements ITutorsRepository {
  private ormRepository: Repository<Tutor>;

  constructor() {
    this.ormRepository = datasource.getRepository(Tutor);
  }

  public async findAll(): Promise<ITutor[]> {
    return await this.ormRepository.find({ relations: ["pets"] });
  }

  public async findById(id: number): Promise<ITutor | null> {
    return await this.ormRepository.findOne({
      where: { id },
      relations: ["pets"],
    });
  }

  public async findByEmail(email: string): Promise<ITutor | null> {
    return await this.ormRepository.findOne({
      where: { email },
    });
  }

  public async findByPhone(phone: string): Promise<ITutor | null> {
    return await this.ormRepository.findOne({
      where: { phone },
    });
  }

  public async create(createTutorDto: CreateTutorDto): Promise<ITutor> {
    return this.ormRepository.create(createTutorDto);
  }

  public async save(tutor: ITutor): Promise<ITutor> {
    return await this.ormRepository.save(tutor);
  }

  public async remove(tutor: ITutor): Promise<void> {
    this.ormRepository.remove(tutor);
  }
}

export default TutorsRepository;
