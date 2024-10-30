import "reflect-metadata";
import { DeletePetService } from "@modules/pets/services/DeletePetService";
import { datasource } from "@shared/infra/typeorm/dataSource";
import { DatabaseSeedsQueryBuilder } from "tests/utils/DatabaseSeedsQueryBuilder";
import { container } from "tsyringe";
import supertest from "supertest";
import { app } from "@shared/infra/http/app";
import {
  IHttpNotFoundException,
  IHttpValidationException,
} from "tests/utils/errors.interfaces";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { HttpStatusResponse } from "@shared/enums/HttpStatusResponse";
import { PET_NOT_FOUND } from "@shared/consts/PetErrorMessageConsts";
import { INVALID_REQUEST_DATA } from "@shared/consts/GenericErrorMessageConsts";

const tutors = [
  {
    id: 17,
    name: "Pedro",
    phone: "21933445566",
    email: "pedro@email.com",
    date_of_birth: "1985-11-02 09:15",
    zip_code: "34567890",
  },
  {
    id: 19,
    name: "Ana",
    phone: "21955667788",
    email: "ana@email.com",
    date_of_birth: "1992-01-30 14:45",
    zip_code: "45678901",
  },
  {
    id: 20,
    name: "Carlos",
    phone: "21977889900",
    email: "carlos@email.com",
    date_of_birth: "1988-07-25 18:30",
    zip_code: "56789012",
  },
];

const pets = [
  {
    id: 153,
    tutor_id: 17,
    name: "Rex",
    species: "dog",
    carry: "m",
    weight: 14,
    date_of_birth: "2018-04-20 08:00",
  },
  {
    id: 154,
    tutor_id: 19,
    name: "Sophie",
    species: "cat",
    carry: "f",
    weight: 4,
    date_of_birth: "2019-09-14 15:10",
  },
  {
    id: 155,
    tutor_id: 20,
    name: "Lola",
    species: "rabbit",
    carry: "f",
    weight: 3,
    date_of_birth: "2022-06-05 12:30",
  },
  {
    id: 156,
    tutor_id: 17,
    name: "Buddy",
    species: "dog",
    carry: "m",
    weight: 11,
    date_of_birth: "2017-12-11 10:00",
  },
  {
    id: 157,
    tutor_id: 19,
    name: "Ginger",
    species: "cat",
    carry: "f",
    weight: 6,
    date_of_birth: "2020-03-18 13:45",
  },
  {
    id: 158,
    tutor_id: 20,
    name: "Snowball",
    species: "rabbit",
    carry: "m",
    weight: 2,
    date_of_birth: "2023-01-01 09:30",
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

describe("DeletePetsController", async () => {
  let deletePetService: DeletePetService;
  const url = "/api/v1/pets";

  beforeEach(async () => {
    deletePetService = container.resolve(DeletePetService);
  });

  it("Should be able to delete a pet that exists", async () => {
    const id = 154;

    const response = await supertest(app).delete(`${url}/${id}/tutor/19`);

    expect(response.status).toEqual(204);
  });

  it("Should not be able to delete a pet that not exists", async () => {
    const id = 9999;

    const expectedResponse: IHttpNotFoundException = {
      code: HttpStatusCode.NOT_FOUND,
      status: HttpStatusResponse.NOT_FOUND,
      message: PET_NOT_FOUND,
    };

    const response = await supertest(app).delete(`${url}/${id}/tutor/20`);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to delete a pet without a valid id", async () => {
    const id = "asdsadasdas";

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: ["id must be a number"],
    };

    const response = await supertest(app).delete(`${url}/${id}/tutor/17`);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
});
