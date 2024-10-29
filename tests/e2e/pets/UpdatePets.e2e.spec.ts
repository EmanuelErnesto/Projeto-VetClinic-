import "reflect-metadata";
import { UpdatePetService } from "@modules/pets/services/UpdatePetService";
import { datasource } from "@shared/infra/typeorm/dataSource";
import { DatabaseSeedsQueryBuilder } from "tests/utils/DatabaseSeedsQueryBuilder";
import { container } from "tsyringe";
import supertest from "supertest";
import { app } from "@shared/infra/http/app";
import {
  IHttpBadRequestException,
  IHttpNotFoundException,
  IHttpValidationException,
} from "tests/utils/errors.interfaces";
import { HttpStatusCode } from "@shared/enums/HttpStatusCode";
import { HttpStatusResponse } from "@shared/enums/HttpStatusResponse";
import {
  PET_ALREADY_EXISTS,
  PET_NOT_FOUND,
} from "@shared/consts/PetErrorMessageConsts";
import { INVALID_REQUEST_DATA } from "@shared/consts/GenericErrorMessageConsts";
import { TUTOR_NOT_FOUND } from "@shared/consts/TutorErrorMessageConsts";

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

describe("UpdatePetsController", async () => {
  let updatePetService: UpdatePetService;
  const url = "/api/v1/pets";

  beforeEach(async () => {
    updatePetService = container.resolve(UpdatePetService);
  });

  it("Should be able to update an existing pet", async () => {
    const id = 154;

    const updatedPet = {
      name: "Sophie",
      tutor_id: 19,
      species: "cat",
      carry: "f",
      weight: 5,
      date_of_birth: "2019-09-14 15:10",
    };

    const response = await supertest(app)
      .put(`${url}/${id}/tutor/19`)
      .send(updatedPet);

    expect(response.status).toEqual(HttpStatusCode.Ok);
    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toEqual(id);
    expect(response.body.name).toEqual(updatedPet.name);
    expect(response.body.species).toEqual(updatedPet.species);
    expect(response.body.weight).toEqual(updatedPet.weight);
  });

  it("Should not be able to update a pet that does not exist", async () => {
    const id = 9999;

    const updatedPet = {
      name: "Sophie",
      species: "cat",
      tutor_id: 19,
      carry: "f",
      weight: 5,
      date_of_birth: "2019-09-14 15:10",
    };

    const expectedResponse: IHttpNotFoundException = {
      code: HttpStatusCode.NOT_FOUND,
      status: HttpStatusResponse.NOT_FOUND,
      message: PET_NOT_FOUND,
    };

    const response = await supertest(app)
      .put(`${url}/${id}/tutor/19`)
      .send(updatedPet);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to update a pet that tutor does not exists", async () => {
    const id = 154;

    const updatedPet = {
      name: "Sophie",
      species: "cat",
      tutor_id: 9999,
      carry: "f",
      weight: 5,
      date_of_birth: "2019-09-14 15:10",
    };

    const expectedResponse: IHttpNotFoundException = {
      code: HttpStatusCode.NOT_FOUND,
      status: HttpStatusResponse.NOT_FOUND,
      message: TUTOR_NOT_FOUND,
    };

    const response = await supertest(app)
      .put(`${url}/${id}/tutor/9999`)
      .send(updatedPet);

    expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to update a pet with exact data of other pet", async () => {
    const id = 154;

    const updatedPet = {
      name: "Lola",
      tutor_id: 20,
      species: "rabbit",
      carry: "f",
      weight: 3,
      date_of_birth: "2022-06-05 12:30",
    };

    const expectedResponse: IHttpBadRequestException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: PET_ALREADY_EXISTS,
    };

    const response = await supertest(app)
      .put(`${url}/${id}/tutor/20`)
      .send(updatedPet);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to update a pet with an empty request body", async () => {
    const id = 154;

    const updatedPet = {};

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

    const response = await supertest(app)
      .put(`${url}/${id}/tutor/19`)
      .send(updatedPet);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to update a pet with request body that has empty property values", async () => {
    const id = 154;

    const updatedPet = {
      name: "",
      species: "",
      tutor_id: "",
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

    const response = await supertest(app)
      .put(`${url}/${id}/tutor/19`)
      .send(updatedPet);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to update a pet with request body that has name but other empty props", async () => {
    const id = 154;

    const updatedPet = {
      name: "Sophie",
      species: "",
      tutor_id: "",
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
        "species is not allowed to be empty",
        "carry is not allowed to be empty",
        "weight must be a number",
        "date_of_birth is not allowed to be empty",
      ],
    };

    const response = await supertest(app)
      .put(`${url}/${id}/tutor/19`)
      .send(updatedPet);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to update a pet with request body that has name and species, but other empty props", async () => {
    const id = 154;

    const updatedPet = {
      name: "Sophie",
      species: "cat",
      tutor_id: "",
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
        "carry is not allowed to be empty",
        "weight must be a number",
        "date_of_birth is not allowed to be empty",
      ],
    };

    const response = await supertest(app)
      .put(`${url}/${id}/tutor/19`)
      .send(updatedPet);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to update a pet with request body that has name, species, and carry, but other empty props", async () => {
    const id = 154;

    const updatedPet = {
      name: "Sophie",
      species: "cat",
      tutor_id: 19,
      carry: "f",
      weight: "",
      date_of_birth: "",
    };

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: [
        "weight must be a number",
        "date_of_birth is not allowed to be empty",
      ],
    };

    const response = await supertest(app)
      .put(`${url}/${id}/tutor/19`)
      .send(updatedPet);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to update a pet with request body that has weight empty", async () => {
    const id = 154;

    const updatedPet = {
      name: "Sophie",
      species: "cat",
      tutor_id: 19,
      carry: "f",
      weight: "",
      date_of_birth: "2019-09-14 15:10",
    };

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: ["weight must be a number"],
    };

    const response = await supertest(app)
      .put(`${url}/${id}/tutor/19`)
      .send(updatedPet);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to update a pet with invalid weight", async () => {
    const id = 154;

    const updatedPet = {
      name: "Sophie",
      species: "cat",
      tutor_id: 19,
      carry: "f",
      weight: -1,
      date_of_birth: "2019-09-14 15:10",
    };

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: ["weight must be greater than or equal to 1"],
    };

    const response = await supertest(app)
      .put(`${url}/${id}/tutor/19`)
      .send(updatedPet);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });

  it("Should not be able to update a pet with invalid date_of_birth", async () => {
    const id = 154;

    const updatedPet = {
      name: "Sophie",
      species: "cat",
      tutor_id: 19,
      carry: "f",
      weight: 5,
      date_of_birth: "invalid-date",
    };

    const expectedResponse: IHttpValidationException = {
      code: HttpStatusCode.BAD_REQUEST,
      status: HttpStatusResponse.BAD_REQUEST,
      message: INVALID_REQUEST_DATA,
      details: ["date_of_birth must be in format yyyy-MM-dd HH:MM"],
    };

    const response = await supertest(app)
      .put(`${url}/${id}/tutor/19`)
      .send(updatedPet);

    expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(expectedResponse);
  });
});
