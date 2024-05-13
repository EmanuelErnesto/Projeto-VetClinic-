const { body, validationResult } = require('express-validator');
module.exports = [
  body('name')
    .notEmpty()
    .withMessage("O campo nome não pode estar vazio.")
    .isString()
    .withMessage("O nome informado está em formato inválido")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("O nome informado deve ser composto apenas por letras.")
,
 (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
  }
  next()
 }
]

