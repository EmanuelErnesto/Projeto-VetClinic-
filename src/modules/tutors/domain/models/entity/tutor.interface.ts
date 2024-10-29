import { Pet } from "@modules/pets/infra/typeorm/entities/Pet";

interface ITutor {
  id: number;
  name: string;
  pets: Pet[];
  phone: string;
  email: string;
  date_of_birth: string;
  zip_code: string;
}

export default ITutor;
