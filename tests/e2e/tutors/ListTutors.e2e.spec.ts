import { datasource } from "@shared/infra/typeorm/dataSource";
import "reflect-metadata";
import { container } from "tsyringe";
import ListTutorService from "@modules/tutors/services/ListTutorService";
import { app } from "@shared/infra/http/app";
import supertest from "supertest";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { DatabaseSeedsQueryBuilder } from "tests/utils/DatabaseSeedsQueryBuilder";

const tutors = [
  {
    id: 200,
    name: "Paulo",
    phone: "21955551234",
    email: "paulo.santos@email.com",
    date_of_birth: "1991-12/03 06:10",
    zip_code: "12345000",
  },
  {
    id: 201,
    name: "Ana",
    phone: "21966667890",
    email: "ana.souza@email.com",

    date_of_birth: "1987-25-05 00:30",
    zip_code: "98765432",
  },
  {
    id: 202,
    name: "Fernanda",
    phone: "21977773456",
    email: "fernanda.lima@email.com",
    date_of_birth: "1993-08-09 02:50",
    zip_code: "54321678",
  },
];

const dbSeedsQueryBuilder = new DatabaseSeedsQueryBuilder();

beforeAll(async () => {
  await datasource.initialize();
});

beforeEach(async () => {
  await dbSeedsQueryBuilder.insertData("tb_tutors", tutors);
});

afterEach(async () => {
  await datasource.query(dbSeedsQueryBuilder.deleteQuery("tb_tutors"));
});

afterAll(async () => {
  await datasource.destroy();
});

describe("ListTutorController", async () => {
  let listTutorService: ListTutorService;

  const url = "/api/v1/tutors";

  beforeEach(async () => {
    listTutorService = container.resolve(ListTutorService);
  });

  it("Should be able to return a list of tutors", async () => {
    const response = await supertest(app).get(url);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
