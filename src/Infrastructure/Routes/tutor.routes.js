const tutorRoutes = require('express').Router()
const phoneValidation = require('../../Middlewares/tutor/phoneValidator.middleware');
const emailValidation = require('../../Middlewares/tutor/emailValidation.middleware');
const zip_codeValidation = require('../../Middlewares/tutor/zip_codeValidation.middleware')
const date_of_birthValidation = require('../../Middlewares/generic/date_of_birthValidation.middleware')
const idValidation = require('../../Middlewares/tutor/idValidation.middleware');
const nameValidation = require('../../Middlewares/generic/nameValidation.middleware');


const tutorController = require('../../Controllers/tutor.controller');

tutorRoutes
  .route('/tutor')
  .post(
    nameValidation,
    phoneValidation,
    emailValidation,
    date_of_birthValidation,
    zip_codeValidation,
    tutorController.create
  )

tutorRoutes
  .route('/tutor/:id')
  .get(
    idValidation,
    tutorController.getById
  )

tutorRoutes
  .route('/tutors')
  .get(
    tutorController.getAllTutors
  )

tutorRoutes
  .route('/tutor/:id')
  .put(
    idValidation,
    nameValidation,
    phoneValidation,
    emailValidation,
    date_of_birthValidation,
    zip_codeValidation,
    tutorController.update
  )

tutorRoutes
.route('/tutor/:id')
.delete(
  idValidation,
  tutorController.delete
)


module.exports = tutorRoutes