import "reflect-metadata";
import { CreatePetService } from "@modules/pets/services/CreatePetService";
import { datasource } from "@shared/infra/typeorm/dataSource";
import { container } from "tsyringe";
import supertest from "supertest";
import { app } from "@shared/infra/http/app";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import {
  IHttpBadRequestException,
  IHttpNotFoundException,
  IHttpValidationException,
} from "tests/utils/errors.interfaces";
import { HttpStatusResponse } from "@shared/enums/HttpStatusResponse";
import { TUTOR_NOT_FOUND } from "@shared/consts/TutorErrorMessageConsts";
import { PET_ALREADY_EXISTS } from "@shared/consts/PetErrorMessageConsts";
import { DatabaseSeedsQueryBuilder } from "tests/utils/DatabaseSeedsQueryBuilder";
import { INVALID_REQUEST_DATA } from "@shared/consts/GenericErrorMessageConsts";

const tutors = [
  {
    id: 50,
    name: "Lucas",
    phone: "21987654321",
    email: "lucas@email.com",
    date_of_birth: "1992-03-10 09:15",
    zip_code: "12345678",
  },
  {
    id: 51,
    name: "Ana",
    phone: "21976543210",
    email: "ana@email.com",
    date_of_birth: "1985-06-25 14:30",
    zip_code: "87654321",
  },
  {
    id: 52,
    name: "Renato",
    phone: "21965432109",
    email: "renato@email.com",
    date_of_birth: "1990-12-05 18:45",
    zip_code: "33445566",
  },
];

const pets = [
  {
    id: 50,
    tutor_id: 51,
    name: "Toby",
    species: "dog",
    carry: "m",
    weight: 10,
    date_of_birth: "2015-05-20 08:30",
  },
  {
    id: 51,
    tutor_id: 52,
    name: "Mia",
    species: "cat",
    carry: "f",
    weight: 4,
    date_of_birth: "2018-03-15 15:00",
  },
  {
    id: 52,
    tutor_id: 50,
    name: "Nina",
    species: "rabbit",
    carry: "f",
    weight: 2,
    date_of_birth: "2020-07-30 11:45",
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

describe("CreatePetController", async () => {
  let createPetService: CreatePetService;

  const url = "/api/v1/pets/:tutorId";

  beforeEach(async () => {
    createPetService = container.resolve(CreatePetService);
  });

  it("Should be able to create a new pet", async () => {
    const createPet = {
      tutor_id: 50,
      name: "Lilo",
      species: "dog",
      carry: "p",
      weight: 5,
      date_of_birth: "1993-12-12 10:10",
    };

    const response = await supertest(app).post(url).send(createPet);

    expect(response.status).toEqual(HttpStatusCode.CREATED);
    expect(response.body).toHaveProperty("tutor_id");
    expect(response.body).toHaveProperty("id");
    expect(response.body.tutor_id).toEqual(createPet.tutor_id);
    expect(response.body.name).toEqual("Lilo");
    expect(response.body.species).toEqual("dog");
    expect(response.body.carry).toEqual("p");
    expect(response.body.weight).toEqual(5);
  });

  it("Should not be able to create a pet with tutor that not exists", async () => {
    const createPet = {
      tutor_id: 9999,
      name: "Fúria",
      species: "dog",
      carry: "M",
      weight: 7,
      date_of_birth: "2020-05-10 12:30",
    };

    const expectedResponse: IHttpNotFoundException = {
      code: 404,
      status: HttpStatusResponse.NOT_FOUND,
      message: TUTOR_NOT_FOUND,
    };

    const response = await supertest(app).post(url).send(createPet);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to create a pet that already exists", async () => {
    const createPet = {
      tutor_id: 51,
      name: "Toby",
      species: "dog",
      carry: "m",
      weight: 10,
      date_of_birth: "2015-05-20 08:30",
    };

    const expectedResponse: IHttpBadRequestException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: PET_ALREADY_EXISTS,
    };

    const response = await supertest(app).post(url).send(createPet);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to create a pet with empty request body", async () => {
    const createPet = {};

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: [
        "tutor_id is required",
        "name is required",
        "species is required",
        "carry is required",
        "weight is required",
        "date_of_birth is required",
      ],
    };

    const response = await supertest(app).post(url).send(createPet);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to create a pet with request body that have properties, but empty values", async () => {
    const createPet = {
      tutor_id: "",
      name: "",
      species: "",
      carry: "",
      weight: "",
      date_of_birth: "",
    };

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: [
        "tutor_id must be a number",
        "name is not allowed to be empty",
        "species is not allowed to be empty",
        "carry is not allowed to be empty",
        "weight must be a number",
        "date_of_birth is not allowed to be empty",
      ],
    };

    const response = await supertest(app).post(url).send(createPet);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to create a pet with request body that have property tutor_id with value, but other props with empty values", async () => {
    const createPet = {
      tutor_id: 50,
      name: "",
      species: "",
      carry: "",
      weight: "",
      date_of_birth: "",
    };

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: [
        "name is not allowed to be empty",
        "species is not allowed to be empty",
        "carry is not allowed to be empty",
        "weight must be a number",
        "date_of_birth is not allowed to be empty",
      ],
    };

    const response = await supertest(app).post(url).send(createPet);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to create a pet with request body that have property tutor_id and name with value, but other props with empty values", async () => {
    const createPet = {
      tutor_id: 50,
      name: "Fido",
      species: "",
      carry: "",
      weight: "",
      date_of_birth: "",
    };

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: [
        "species is not allowed to be empty",
        "carry is not allowed to be empty",
        "weight must be a number",
        "date_of_birth is not allowed to be empty",
      ],
    };

    const response = await supertest(app).post(url).send(createPet);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to create a pet with request body that have property tutor_id, name, and species with value, but other props with empty values", async () => {
    const createPet = {
      tutor_id: 50,
      name: "Fido",
      species: "dog",
      carry: "",
      weight: "",
      date_of_birth: "",
    };

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: [
        "carry is not allowed to be empty",
        "weight must be a number",
        "date_of_birth is not allowed to be empty",
      ],
    };

    const response = await supertest(app).post(url).send(createPet);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to create a pet without carry prop", async () => {
    const createPet = {
      tutor_id: 50,
      name: "Fido",
      species: "dog",
      weight: 5,
      date_of_birth: "2015-05-20 08:30",
    };

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: ["carry is required"],
    };

    const response = await supertest(app).post(url).send(createPet);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to create a pet without weight prop", async () => {
    const createPet = {
      tutor_id: 50,
      name: "Fido",
      species: "dog",
      carry: "m",
      date_of_birth: "2015-05-20 08:30",
    };

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: ["weight is required"],
    };

    const response = await supertest(app).post(url).send(createPet);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to create a pet without date_of_birth prop", async () => {
    const createPet = {
      tutor_id: 50,
      name: "Fido",
      species: "dog",
      carry: "m",
      weight: 5,
    };

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: ["date_of_birth is required"],
    };

    const response = await supertest(app).post(url).send(createPet);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
});
