const { body, validationResult } = require('express-validator')

module.exports = [
  body('species')
    .trim()
    .notEmpty()
    .withMessage("A espécie do animal não pode estar vazia.")
    .isString()
    .withMessage("A espécie recebida não está em um formato válido.")
    .isAlpha()
    .withMessage("A espécie deve estar em formato de texto.")
    .matches(/^(dog|cat|bird|fish|cachorro|gato|passaro|peixe|pássaro)$/)
    .withMessage("A espécie informada não está entre as válidas.")
  ,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }

]