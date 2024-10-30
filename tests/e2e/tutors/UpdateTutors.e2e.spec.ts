import "reflect-metadata";
import UpdateTutorService from "@modules/tutors/services/UpdateTutorService";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { app } from "@shared/infra/http/app";
import { datasource } from "@shared/infra/typeorm/dataSource";
import supertest from "supertest";
import { container } from "tsyringe";
import {
  IHttpBadRequestException,
  IHttpNotFoundException,
  IHttpValidationException,
} from "tests/utils/errors.interfaces";
import { HttpStatusResponse } from "@shared/enums/HttpStatusResponse";
import {
  EMAIL_ALREADY_USED,
  PHONE_ALREADY_USED,
  TUTOR_NOT_FOUND,
} from "@shared/consts/TutorErrorMessageConsts";
import { INVALID_REQUEST_DATA } from "@shared/consts/GenericErrorMessageConsts";
import { DatabaseSeedsQueryBuilder } from "tests/utils/DatabaseSeedsQueryBuilder";

const tutors = [
  {
    id: 500,
    name: "Ana Silva",
    phone: "31987654321",
    email: "ana.silva@example.com",
    date_of_birth: "1987-11-12 01:10",
    zip_code: "11223445",
  },
  {
    id: 501,
    name: "Paulo Souza",
    phone: "21976543210",
    email: "paulo.souza@example.com",
    date_of_birth: "1982-08-03 06:20",
    zip_code: "33445667",
  },
  {
    id: 502,
    name: "Fernanda Lima",
    phone: "11999887766",
    email: "fernanda.lima@example.com",
    date_of_birth: "1990-05-25 06:20",
    zip_code: "55678990",
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

describe("UpdateTutorsController", async () => {
  let updateTutorService: UpdateTutorService;

  const url = "/api/v1/tutors";

  beforeEach(async () => {
    updateTutorService = container.resolve(UpdateTutorService);
  });

  it("Should be able to update a existent tutor", async () => {
    const id: number = 500;

    const updatedTutor = {
      name: "Ana Silva",
      phone: "31987654321",
      email: "ana.silvanovoemail@example.com",
      date_of_birth: "1990-11-12 01:10",
      zip_code: "11223445",
    };

    const response = await supertest(app)
      .put(`${url}/${id}`)
      .send(updatedTutor);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toEqual(id);
    expect(response.body.name).toEqual(updatedTutor.name);
    expect(response.body.phone).toEqual(updatedTutor.phone);
    expect(response.body.email).toEqual(updatedTutor.email);
    expect(response.body.zip_code).toEqual(updatedTutor.zip_code);
    expect(response.body.date_of_birth).toEqual(updatedTutor.date_of_birth);
  });

  it("Should not be able to update a tutor that not exists", async () => {
    const id: number = 99999;

    const updatedTutor = {
      name: "Ana Silva",
      phone: "31987654321",
      email: "ana.silvanovoemail@example.com",
      date_of_birth: "1990-11-12 04:40",
      zip_code: "11223445",
    };

    const expectedResponse: IHttpNotFoundException = {
      code: HttpStatusCode.NOT_FOUND,
      status: HttpStatusResponse.NOT_FOUND,
      message: TUTOR_NOT_FOUND,
    };

    const response = await supertest(app)
      .put(`${url}/${id}`)
      .send(updatedTutor);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to update a tutor with email of other tutor", async () => {
    const id: number = 500;

    const updatedTutor = {
      name: "Ana Silva",
      phone: "31987654321",
      email: "paulo.souza@example.com",
      date_of_birth: "1990-11-12 04:20",
      zip_code: "11223445",
    };

    const expectedResponse: IHttpBadRequestException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: EMAIL_ALREADY_USED,
    };

    const response = await supertest(app)
      .put(`${url}/${id}`)
      .send(updatedTutor);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to update a tutor with phone of other tutor", async () => {
    const id: number = 500;

    const updatedTutor = {
      name: "Ana Silva",
      phone: "11999887766",
      email: "ana.silva@example.com",
      date_of_birth: "1990-11-12 01:43",
      zip_code: "11223445",
    };

    const expectedResponse: IHttpBadRequestException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: PHONE_ALREADY_USED,
    };

    const response = await supertest(app)
      .put(`${url}/${id}`)
      .send(updatedTutor);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to update a tutor with empty request body", async () => {
    const id: number = 500;

    const updatedTutor = {};

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

    const response = await supertest(app)
      .put(`${url}/${id}`)
      .send(updatedTutor);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to update a tutor with request body that have empty property values", async () => {
    const id: number = 500;

    const updatedTutor = {
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

    const response = await supertest(app)
      .put(`${url}/${id}`)
      .send(updatedTutor);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to update a tutor with request body that have prop name, but other empty props", async () => {
    const id: number = 500;

    const updatedTutor = {
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

    const response = await supertest(app)
      .put(`${url}/${id}`)
      .send(updatedTutor);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to update a tutor with request body that have props name and email, but other empty props", async () => {
    const id: number = 500;

    const updatedTutor = {
      name: "maria",
      email: "maria@example.com",
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

    const response = await supertest(app)
      .put(`${url}/${id}`)
      .send(updatedTutor);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to update a tutor with request body that have props name, email and phone, but other empty props", async () => {
    const id: number = 500;

    const updatedTutor = {
      name: "maria",
      email: "maria@example.com",
      phone: "26124215300",
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

    const response = await supertest(app)
      .put(`${url}/${id}`)
      .send(updatedTutor);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to update a tutor with request body that have zip_code empty", async () => {
    const id: number = 500;

    const updatedTutor = {
      name: "maria",
      email: "maria@example.com",
      phone: "26124215300",
      date_of_birth: "1990-01-02 01:30",
      zip_code: "",
    };

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: ["zip_code is not allowed to be empty"],
    };

    const response = await supertest(app)
      .put(`${url}/${id}`)
      .send(updatedTutor);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
});
