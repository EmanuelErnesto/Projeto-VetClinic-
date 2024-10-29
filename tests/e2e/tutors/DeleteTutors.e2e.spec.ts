import "reflect-metadata";
import DeleteTutorService from "@modules/tutors/services/DeleteTutorService";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { app } from "@shared/infra/http/app";
import { datasource } from "@shared/infra/typeorm/dataSource";
import supertest from "supertest";
import { container } from "tsyringe";
import { HttpStatusResponse } from "@shared/enums/HttpStatusResponse";
import { TUTOR_NOT_FOUND } from "@shared/consts/TutorErrorMessageConsts";
import { INVALID_REQUEST_DATA } from "@shared/consts/GenericErrorMessageConsts";
import {
  IHttpNotFoundException,
  IHttpValidationException,
} from "tests/utils/errors.interfaces";
import { DatabaseSeedsQueryBuilder } from "tests/utils/DatabaseSeedsQueryBuilder";

const tutors = [
  {
    id: 400,
    name: "Gabriel Santos",
    phone: "11987654321",
    email: "gabriel.santos@example.com",
    date_of_birth: "1985-05-10 05:20",
    zip_code: "12345678",
  },
  {
    id: 401,
    name: "Mariana Oliveira",
    phone: "21987654321",
    email: "mariana.oliveira@example.com",
    date_of_birth: "1990-23-07 05:20",
    zip_code: "87654321",
  },
  {
    id: 402,
    name: "Carlos Pereira",
    phone: "31987654321",
    email: "carlos.pereira@example.com",
    date_of_birth: "1978-15-03 05:20",
    zip_code: "56789123",
  },
];

const pets = [
  {
    id: 53,
    tutor_id: 400,
    name: "Rocky",
    species: "dog",
    carry: "m",
    weight: 12,
    date_of_birth: "2016-11-10 09:15",
  },
  {
    id: 54,
    tutor_id: 401,
    name: "Luna",
    species: "cat",
    carry: "f",
    weight: 5,
    date_of_birth: "2019-06-25 14:30",
  },
  {
    id: 55,
    tutor_id: 402,
    name: "Bunny",
    species: "rabbit",
    carry: "f",
    weight: 3,
    date_of_birth: "2021-02-14 12:00",
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
  await datasource.query(dbSeedsQueryBuilder.deleteQuery("tb_tutors"));
  await datasource.query(dbSeedsQueryBuilder.deleteQuery("tb_pets"));
});

afterAll(async () => {
  await datasource.destroy();
});

describe("DeleteTutorsController", async () => {
  let deleteTutorService: DeleteTutorService;

  const url = "/api/v1/tutors";

  beforeEach(async () => {
    deleteTutorService = container.resolve(DeleteTutorService);
  });

  it("Should be able to delete a tutor that exists", async () => {
    const id = 400;

    const response = await supertest(app).delete(`${url}/${id}`);

    expect(response.status).toEqual(HttpStatusCode.NO_CONTENT);
  });

  it("Should not be able to delete a tutor that not exists", async () => {
    const id = 99999;

    const expectedResponse: IHttpNotFoundException = {
      code: HttpStatusCode.NOT_FOUND,
      status: HttpStatusResponse.NOT_FOUND,
      message: TUTOR_NOT_FOUND,
    };

    const response = await supertest(app).delete(`${url}/${id}`);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to delete a tutor with invalid id", async () => {
    const id = "invalid";

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: ["id must be a number"],
    };

    const response = await supertest(app).delete(`${url}/${id}`);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
});
