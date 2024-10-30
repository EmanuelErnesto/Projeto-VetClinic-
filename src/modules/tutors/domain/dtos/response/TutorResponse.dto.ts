import { Pet } from "@modules/pets/infra/typeorm/entities/Pet";

export type TutorResponseDtoProperties = {
  id: number;
  name: string;
  phone: string;
  email: string;
  date_of_birth: string;
  zip_code: string;
  pets: Pet[];
};

export class TutorResponseDto {
  private readonly id: number;
  private readonly name: string;
  private readonly phone: string;
  private readonly email: string;
  private readonly date_of_birth: string;
  private readonly zip_code: string;
  private pets: Pet[];

  constructor(props: TutorResponseDtoProperties) {
    this.id = props.id;
    this.name = props.name;
    this.phone = props.phone;
    this.email = props.email;
    this.date_of_birth = props.date_of_birth;
    this.zip_code = props.zip_code;
    this.pets = props.pets;
  }
}
