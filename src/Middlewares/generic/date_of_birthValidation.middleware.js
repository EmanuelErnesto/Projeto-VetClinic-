const { body, validationResult } = require('express-validator');
module.exports = [

  body('date_of_birth')
    .trim()
    .notEmpty()
    .withMessage('A data de nascimento não pode estar vazia.')
    .isString()
    .withMessage('A data de nascimento está em formato inválido.')
    .matches(/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{1,2}$/)
    .withMessage('A data de nascimento informada possui alguma letra ou está em formato inválido.')
  ,

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]
