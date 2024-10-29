import { ShowPetService } from "@modules/pets/services/ShowPetService";
import { INVALID_REQUEST_DATA } from "@shared/consts/GenericErrorMessageConsts";
import { PET_NOT_FOUND } from "@shared/consts/PetErrorMessageConsts";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { HttpStatusResponse } from "@shared/enums/HttpStatusResponse";
import { app } from "@shared/infra/http/app";
import { datasource } from "@shared/infra/typeorm/dataSource";
import supertest from "supertest";
import { DatabaseSeedsQueryBuilder } from "tests/utils/DatabaseSeedsQueryBuilder";
import {
  IHttpNotFoundException,
  IHttpValidationException,
} from "tests/utils/errors.interfaces";
import { container } from "tsyringe";

const tutors = [
  {
    id: 15,
    name: "João",
    phone: "21911223344",
    email: "joao@email.com",
    date_of_birth: "1982-04-15 10:30",
    zip_code: "12345679",
  },
  {
    id: 16,
    name: "Carla",
    phone: "21922334455",
    email: "carla@email.com",
    date_of_birth: "1990-08-20 16:00",
    zip_code: "23456780",
  },
  {
    id: 18,
    name: "Juliana",
    phone: "21944556677",
    email: "juliana@email.com",
    date_of_birth: "1995-02-10 08:00",
    zip_code: "45678902",
  },
];

const pets = [
  {
    id: 150,
    tutor_id: 15,
    name: "Bobby",
    species: "dog",
    carry: "m",
    weight: 12,
    date_of_birth: "2016-01-15 09:00",
  },
  {
    id: 151,
    tutor_id: 18,
    name: "Whiskers",
    species: "cat",
    carry: "f",
    weight: 5,
    date_of_birth: "2017-05-22 11:30",
  },
  {
    id: 152,
    tutor_id: 16,
    name: "Thumper",
    species: "rabbit",
    carry: "f",
    weight: 3,
    date_of_birth: "2021-03-12 07:45",
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

describe("ShowPetsController", async () => {
  let showPetsService: ShowPetService;

  const url = "/api/v1/pets";

  beforeEach(async () => {
    showPetsService = container.resolve(ShowPetService);
  });

  it("Should be able to return a pet that exists", async () => {
    const id = 150;

    const expectedResponse = {
      id: 150,
      tutor_id: 15,
      name: "Bobby",
      species: "dog",
      carry: "m",
      weight: 12,
      date_of_birth: "2016-01-15 09:00",
    };

    const response = await supertest(app).get(`${url}/${id}`);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to return a pet that not exists", async () => {
    const id = 200;

    const expectedResponse: IHttpNotFoundException = {
      code: HttpStatusCode.NOT_FOUND,
      status: HttpStatusResponse.NOT_FOUND,
      message: PET_NOT_FOUND,
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
