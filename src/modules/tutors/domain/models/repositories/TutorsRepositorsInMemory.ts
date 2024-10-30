import CreateTutorDto from "@modules/tutors/domain/dtos/request/CreateTutor.dto";
import ITutor from "@modules/tutors/domain/models/entity/tutor.interface";
import ITutorsRepository from "@modules/tutors/domain/models/repositories/TutorsRepository.interface";
import Tutor from "@modules/tutors/infra/typeorm/entities/Tutor";

export class TutorsRepositoryInMemory implements ITutorsRepository {
  private tutors: ITutor[] = [];

  public async findAll(): Promise<ITutor[]> {
    return this.tutors;
  }

  public async findById(id: number): Promise<ITutor | null> {
    return this.tutors.find((tutor) => tutor.id === id) || null;
  }

  public async findByEmail(email: string): Promise<ITutor | null> {
    return this.tutors.find((tutor) => tutor.email === email) || null;
  }

  public async findByPhone(phone: string): Promise<ITutor | null> {
    return this.tutors.find((tutor) => tutor.phone === phone) || null;
  }

  public async create(createTutorDto: CreateTutorDto): Promise<ITutor> {
    const tutor = new Tutor();

    tutor.id = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
    tutor.name = createTutorDto.name;
    tutor.email = createTutorDto.email;
    tutor.date_of_birth = createTutorDto.date_of_birth;
    tutor.phone = createTutorDto.phone;
    tutor.zip_code = createTutorDto.zip_code;
    tutor.pets = [];
    this.tutors.push(tutor);

    return tutor;
  }

  public async save(tutor: ITutor): Promise<ITutor> {
    const tutorIndex = this.tutors.findIndex(
      (findTutor) => (findTutor.id = tutor.id),
    );

    this.tutors[tutorIndex] = tutor;

    return tutor;
  }

  public async remove(tutor: ITutor): Promise<void> {
    const index = this.tutors.findIndex(
      (tutorIndex) => tutorIndex.id === tutor.id,
    );

    if (index !== -1) {
      this.tutors.splice(index, 1);
    }
  }
}
