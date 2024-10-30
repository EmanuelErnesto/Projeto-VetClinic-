import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTutors1727877805259 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "tb_tutors",
        columns: [
          {
            name: "id",
            type: "int",
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "VARCHAR",
            isNullable: false,
          },
          {
            name: "phone",
            type: "VARCHAR",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "email",
            type: "VARCHAR",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "date_of_birth",
            type: "timestamp",
            isNullable: false,
          },
          {
            name: "zip_code",
            type: "VARCHAR",
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("tb_tutors");
  }
}
