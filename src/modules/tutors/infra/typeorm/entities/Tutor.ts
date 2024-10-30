import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import ITutor from "../../../domain/models/entity/tutor.interface";
import { Pet } from "@modules/pets/infra/typeorm/entities/Pet";

@Entity("tb_tutors")
class Tutor implements ITutor {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @OneToMany(() => Pet, (pet) => pet.tutor, { cascade: true })
  pets: Pet[];

  @Column({ type: "varchar", nullable: false, unique: true })
  phone: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  email: string;

  @Column({ type: "date", nullable: false })
  date_of_birth: string;

  @Column({ type: "varchar", nullable: false })
  zip_code: string;
}

export default Tutor;
