import CreateTutorDto from "../../dtos/request/CreateTutor.dto";
import ITutor from "../entity/tutor.interface";

interface ITutorsRepository {
  findAll(): Promise<ITutor[]>;
  findById(id: number): Promise<ITutor | null>;
  findByEmail(email: string): Promise<ITutor | null>;
  findByPhone(phone: string): Promise<ITutor | null>;
  create(createTutorDto: CreateTutorDto): Promise<ITutor>;
  save(tutor: ITutor): Promise<ITutor>;
  remove(tutor: ITutor): Promise<void>;
}

export default ITutorsRepository;
