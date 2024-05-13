const { param, validationResult } = require('express-validator');
module.exports = [
  param('tutorId')
    .trim()
    .notEmpty()
    .withMessage("O ID não pode estar vazio.")
    .isString()
    .withMessage('O ID está em formato inválido.')
    .isNumeric()
    .withMessage("O ID deve ser um número.")
  ,

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()})
    }
    next()
  }
]
