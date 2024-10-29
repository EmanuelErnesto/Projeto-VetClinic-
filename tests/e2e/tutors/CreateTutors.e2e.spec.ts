import "reflect-metadata";
import { container } from "tsyringe";
import { datasource } from "@shared/infra/typeorm/dataSource";
import CreateTutorService from "@modules/tutors/services/CreateTutorService";
import supertest from "supertest";
import { app } from "@shared/infra/http/app";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { HttpStatusResponse } from "@shared/enums/HttpStatusResponse";
import {
  EMAIL_ALREADY_USED,
  PHONE_ALREADY_USED,
} from "@shared/consts/TutorErrorMessageConsts";
import {
  IHttpBadRequestException,
  IHttpValidationException,
} from "tests/utils/errors.interfaces";
import { INVALID_REQUEST_DATA } from "@shared/consts/GenericErrorMessageConsts";
import { DatabaseSeedsQueryBuilder } from "tests/utils/DatabaseSeedsQueryBuilder";

const tutors = [
  {
    id: 100,
    name: "Josué",
    phone: "21966472250",
    email: "josue@email.com",
    date_of_birth: "2000-02-01 22:10",
    zip_code: "33123444",
  },
  {
    id: 101,
    name: "Maria",
    phone: "21988887777",
    email: "maria@email.com",
    date_of_birth: "1995-07-15 12:05",
    zip_code: "22222333",
  },
  {
    id: 102,
    name: "Carlos",
    phone: "21999994444",
    email: "carlos@email.com",
    date_of_birth: "1988-11-30 05:20",
    zip_code: "44445555",
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

describe("CreateTutorController", async () => {
  let createTutorService: CreateTutorService;

  const url = "/api/v1/tutors";

  beforeEach(() => {
    createTutorService = container.resolve(CreateTutorService);
  });

  it("Should be able to create a new tutor", async () => {
    const createTutor = {
      name: "Marco",
      phone: "21966472321",
      email: "marco@email.com",
      date_of_birth: "1990-05-10 03:28",
      zip_code: "33123653",
    };

    const response = await supertest(app).post(url).send(createTutor);

    expect(response.status).toEqual(HttpStatusCode.CREATED);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toEqual(createTutor.name);
    expect(response.body.email).toEqual(createTutor.email);
    expect(response.body.phone).toEqual(createTutor.phone);
  });

  it("Should not be able to create a tutor that email already exists", async () => {
    const createTutor = {
      name: "Josué",
      phone: "21966472286",
      email: "josue@email.com",
      date_of_birth: "2000-02-01 06:40",
      zip_code: "33123444",
    };

    const expectedResponse: IHttpBadRequestException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: EMAIL_ALREADY_USED,
    };

    const response = await supertest(app).post(url).send(createTutor);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to create a tutor that phone already exists", async () => {
    const createTutor = {
      name: "Josué",
      phone: "21966472250",
      email: `josue${Date.now()}@email.com`,
      date_of_birth: "2000-02-01 07:23",
      zip_code: "33123444",
    };

    const expectedResponse: IHttpBadRequestException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: PHONE_ALREADY_USED,
    };

    const response = await supertest(app).post(url).send(createTutor);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to create a tutor with empty request body", async () => {
    const createTutor = {};

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: [
        "name is required",
        "email is required",
        "phone is required",
        "date_of_birth is required",
        "zip_code is required",
      ],
    };

    const response = await supertest(app).post(url).send(createTutor);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to create a tutor with request body that have properties, but empty values", async () => {
    const createTutor = {
      name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      zip_code: "",
    };

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: [
        "name is not allowed to be empty",
        "email is not allowed to be empty",
        "phone is not allowed to be empty",
        "date_of_birth is not allowed to be empty",
        "zip_code is not allowed to be empty",
      ],
    };

    const response = await supertest(app).post(url).send(createTutor);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to create a tutor with request body that have property name with value, but other props with empty values", async () => {
    const createTutor = {
      name: "maria",
      email: "",
      phone: "",
      date_of_birth: "",
      zip_code: "",
    };

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: [
        "email is not allowed to be empty",
        "phone is not allowed to be empty",
        "date_of_birth is not allowed to be empty",
        "zip_code is not allowed to be empty",
      ],
    };

    const response = await supertest(app).post(url).send(createTutor);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to create a tutor with request body that have property name, email with value, but other props with empty values", async () => {
    const createTutor = {
      name: "maria",
      email: `maria${Date.now()}@email.com`,
      phone: "",
      date_of_birth: "",
      zip_code: "",
    };

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: [
        "phone is not allowed to be empty",
        "date_of_birth is not allowed to be empty",
        "zip_code is not allowed to be empty",
      ],
    };

    const response = await supertest(app).post(url).send(createTutor);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to create a tutor with request body that have property name, email and phone with value, but other props with empty values", async () => {
    const createTutor = {
      name: "maria",
      email: `maria${Date.now()}@email.com`,
      phone: "23123456789",
      date_of_birth: "",
      zip_code: "",
    };

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: [
        "date_of_birth is not allowed to be empty",
        "zip_code is not allowed to be empty",
      ],
    };

    const response = await supertest(app).post(url).send(createTutor);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to create a tutor without zip_code prop", async () => {
    const createTutor = {
      name: "maria",
      email: `maria${Date.now()}@email.com`,
      phone: "22321654789",
      date_of_birth: "2005-03-05 01:05",
      zip_code: "",
    };

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: ["zip_code is not allowed to be empty"],
    };

    const response = await supertest(app).post(url).send(createTutor);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
});
