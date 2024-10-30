import "reflect-metadata";
import { ListPetService } from "@modules/pets/services/ListPetService";
import { datasource } from "@shared/infra/typeorm/dataSource";
import { DatabaseSeedsQueryBuilder } from "tests/utils/DatabaseSeedsQueryBuilder";
import { container } from "tsyringe";
import supertest from "supertest";
import { app } from "@shared/infra/http/app";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";

const tutors = [
  {
    id: 100,
    name: "Lucas",
    phone: "21987654321",
    email: "lucas@email.com",
    date_of_birth: "1992-03-10 09:15",
    zip_code: "12345678",
  },
  {
    id: 101,
    name: "Ana",
    phone: "21976543210",
    email: "ana@email.com",
    date_of_birth: "1985-06-25 14:30",
    zip_code: "87654321",
  },
  {
    id: 102,
    name: "Renato",
    phone: "21965432109",
    email: "renato@email.com",
    date_of_birth: "1990-12-05 18:45",
    zip_code: "33445566",
  },
  {
    id: 103,
    name: "Mariana",
    phone: "21912345678",
    email: "mariana@email.com",
    date_of_birth: "1995-09-15 10:00",
    zip_code: "11122334",
  },
  {
    id: 104,
    name: "Pedro",
    phone: "21987654322",
    email: "pedro@email.com",
    date_of_birth: "1988-01-20 11:15",
    zip_code: "43215678",
  },
];

const pets = [
  {
    id: 100,
    tutor_id: 101,
    name: "Toby",
    species: "dog",
    carry: "m",
    weight: 10,
    date_of_birth: "2015-05-20 08:30",
  },
  {
    id: 101,
    tutor_id: 102,
    name: "Mia",
    species: "cat",
    carry: "f",
    weight: 4,
    date_of_birth: "2018-03-15 15:00",
  },
  {
    id: 102,
    tutor_id: 100,
    name: "Nina",
    species: "rabbit",
    carry: "f",
    weight: 2,
    date_of_birth: "2020-07-30 11:45",
  },
  {
    id: 103,
    tutor_id: 103,
    name: "Max",
    species: "dog",
    carry: "m",
    weight: 15,
    date_of_birth: "2016-02-14 09:30",
  },
  {
    id: 104,
    tutor_id: 104,
    name: "Lola",
    species: "cat",
    carry: "f",
    weight: 3,
    date_of_birth: "2019-08-01 12:00",
  },
];

const dbSeedsQueryBuilder = new DatabaseSeedsQueryBuilder();

beforeAll(async () => {
  await datasource.initialize();
});

beforeEach(async () => {
  await dbSeedsQueryBuilder.insertData("tb_tutors", tutors);
  await dbSeedsQueryBuilder.insertData("tb_pets", pets);
});

afterEach(async () => {
  await datasource.query(dbSeedsQueryBuilder.deleteQuery("tb_pets"));
  await datasource.query(dbSeedsQueryBuilder.deleteQuery("tb_tutors"));
});

afterAll(async () => {
  await datasource.destroy();
});

describe("ListPetsController", async () => {
  let listPetsService: ListPetService;

  const url = "/api/v1/pets";

  beforeEach(async () => {
    listPetsService = container.resolve(ListPetService);
  });

  it("Should be able to return a list of pets", async () => {
    const response = await supertest(app).get(url);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body.length).toEqual(5);
    expect(response.body[0]).toEqual(pets[0]);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("weight");
  });
});
