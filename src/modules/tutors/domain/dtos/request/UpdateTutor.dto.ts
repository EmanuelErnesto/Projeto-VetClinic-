import { Pet } from "@modules/pets/infra/typeorm/entities/Pet";

class UpdateTutorDto {
  id: number;
  name: string;
  phone: string;
  email: string;
  pets: Pet[];
  date_of_birth: string;
  zip_code: string;
}

export default UpdateTutorDto;
