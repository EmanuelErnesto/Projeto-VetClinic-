import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePetsTable1729031324865 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "tb_pets",
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
            name: "species",
            type: "VARCHAR",
            isNullable: false,
          },

          {
            name: "carry",
            type: "VARCHAR",
            isNullable: false,
          },

          {
            name: "weight",
            type: "int",
            isNullable: false,
          },
          {
            name: "date_of_birth",
            type: "timestamp",
            isNullable: false,
          },
          {
            name: "tutor_id",
            type: "int",
          },
        ],
        foreignKeys: [
          {
            name: "tutor_id_fk",
            referencedTableName: "tb_tutors",
            referencedColumnNames: ["id"],
            columnNames: ["tutor_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("tb_pets");
  }
}
