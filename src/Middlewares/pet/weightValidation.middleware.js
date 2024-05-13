const { body, validationResult } = require('express-validator')

module.exports = [
  body('weight')
    .trim()
    .notEmpty()
    .withMessage("O peso não pode estar vazio")
    .isString()
    .withMessage("O peso está em um formato inválido.")
    .isNumeric()
    .withMessage("O peso informado não é um número.")
    .matches(/^\d{1,3}$/)
    .withMessage("O peso informado não segue o padrão estabelecido.")
  ,
  (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
    }
    next()
  }

]