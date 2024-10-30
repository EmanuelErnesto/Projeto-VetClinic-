import Tutor from "@modules/tutors/infra/typeorm/entities/Tutor";

export interface IPet {
  id: number;
  tutor_id: number;
  tutor: Tutor;
  name: string;
  species: string;
  carry: string;
  weight: number;
  date_of_birth: string;
}
