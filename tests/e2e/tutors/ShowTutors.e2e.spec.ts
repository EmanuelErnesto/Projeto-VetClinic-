import "reflect-metadata";
import ShowTutorService from "@modules/tutors/services/ShowTutorService";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { app } from "@shared/infra/http/app";
import { datasource } from "@shared/infra/typeorm/dataSource";
import supertest from "supertest";
import { container } from "tsyringe";
import {
  IHttpNotFoundException,
  IHttpValidationException,
} from "tests/utils/errors.interfaces";
import { HttpStatusResponse } from "@shared/enums/HttpStatusResponse";
import { TUTOR_NOT_FOUND } from "@shared/consts/TutorErrorMessageConsts";
import { INVALID_REQUEST_DATA } from "@shared/consts/GenericErrorMessageConsts";
import { DatabaseSeedsQueryBuilder } from "tests/utils/DatabaseSeedsQueryBuilder";

const tutors = [
  {
    id: 300,
    name: "Nicolas",
    phone: "01179465149",
    email: "xmendes@souza.org",
    date_of_birth: "1911-29-01 03:03",
    zip_code: "93647131",
  },
  {
    id: 301,
    name: "Luiz Miguel",
    phone: "8446961548",
    email: "sofia78@freitas.com",
    date_of_birth: "1976-18-01 06:10",
    zip_code: "48829839",
  },
  {
    id: 302,
    name: "Stephany",
    phone: "05113378786",
    email: "xcampos@pires.org",
    date_of_birth: "1940-19-02 01:05",
    zip_code: "17414-245",
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

describe("ShowTutorsController", async () => {
  let showTutorService: ShowTutorService;

  const url = "/api/v1/tutors";

  beforeEach(async () => {
    showTutorService = container.resolve(ShowTutorService);
  });

  it("Should be able to return a tutor that exists", async () => {
    const id = 302;

    const response = await supertest(app).get(`${url}/${id}`);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toEqual(id);
  });

  it("Should not be able to return a tutor that not exists", async () => {
    const id = 1000;
    const expectedResponse: IHttpNotFoundException = {
      code: HttpStatusCode.NOT_FOUND,
      status: HttpStatusResponse.NOT_FOUND,
      message: TUTOR_NOT_FOUND,
    };

    const response = await supertest(app).get(`${url}/${id}`);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to return a tutor with invalid id", async () => {
    const id = "invalid";

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: ["id must be a number"],
    };

    const response = await supertest(app).get(`${url}/${id}`);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
});
