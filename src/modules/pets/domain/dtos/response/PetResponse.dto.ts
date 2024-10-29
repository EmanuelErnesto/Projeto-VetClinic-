export type PetResponseDtoProperties = {
  id: number;
  tutor_id: number;
  name: string;
  species: string;
  carry: string;
  weight: number;
  date_of_birth: string;
};

class PetResponseDto {
  private id: number;
  private tutor_id: number;
  private name: string;
  private species: string;
  private carry: string;
  private weight: number;
  private date_of_birth: string;

  constructor(props: PetResponseDtoProperties) {
    this.id = props.id;
    this.tutor_id = props.tutor_id;
    this.name = props.name;
    this.species = props.species;
    this.carry = props.carry;
    this.weight = props.weight;
    this.date_of_birth = props.date_of_birth;
  }
}

export default PetResponseDto;
