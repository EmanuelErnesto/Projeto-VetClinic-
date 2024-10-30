import { IPet } from "@modules/pets/domain/models/entity/pet.interface";
import Tutor from "@modules/tutors/infra/typeorm/entities/Tutor";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("tb_pets")
export class Pet implements IPet {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "int" })
  tutor_id: number;

  @ManyToOne(() => Tutor, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tutor_id" })
  tutor: Tutor;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: false })
  species: string;

  @Column({ type: "varchar", nullable: false })
  carry: string;

  @Column({ type: "int", nullable: false })
  weight: number;

  @Column({ type: "date", nullable: false })
  date_of_birth: string;
}
