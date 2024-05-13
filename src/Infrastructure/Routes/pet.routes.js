const idValidation = require('../../Middlewares/pet/idValidation.middleware');
const nameValidation = require('../../Middlewares/generic/nameValidation.middleware');
const speciesValidation = require('../../Middlewares/pet/speciesValidation.middleware');
const carryValidation   = require('../../Middlewares/pet/carryValidation.middleware');
const weightValidation  = require('../../Middlewares/pet/weightValidation.middleware');
const date_of_birthValidation = require('../../Middlewares/generic/date_of_birthValidation.middleware');
const PetController = require('../../Controllers/pet.controller');


const petRoutes = require('express').Router()

petRoutes
.route('/pet/:tutorId')
.post(
  idValidation,
  nameValidation,
  speciesValidation,
  carryValidation,
  weightValidation,
  date_of_birthValidation,
  PetController.create
)



petRoutes
.route('/pet/:petId/tutor/:tutorId')
.put(
  idValidation,
  nameValidation,
  speciesValidation,
  carryValidation,
  date_of_birthValidation,
  PetController.update
)

petRoutes
.route('/pet/:petId/tutor/:tutorId')
.delete(
  idValidation,
  PetController.delete
)

module.exports = petRoutes