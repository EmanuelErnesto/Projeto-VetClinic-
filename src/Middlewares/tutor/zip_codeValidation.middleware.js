const { body, validationResult } = require('express-validator');
module.exports = [
  body('zip_code')
    .trim()
    .notEmpty()
    .withMessage('O CEP não pode estar vazio.')
    .isString()
    .withMessage('O CEP está em formato inválido.')
    .matches(/^\d{8}$/)
    .withMessage("O CEP informado possui alguma letra ou está em formato inválido.")
  ,

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }


]



