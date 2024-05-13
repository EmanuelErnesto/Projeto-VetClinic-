const { body, validationResult } = require('express-validator')

module.exports = [
  body('carry')
    .trim()
    .notEmpty()
    .withMessage("O tamanho do animal não pode estar vazio.")
    .isString()
    .withMessage("O tamanho informado está em formato inválido.")
    .matches(/^[pmg]$/i)
    .withMessage("O tamanho informado deve ser P, M ou G.")

  ,
  (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
    }
    next()
  }
]