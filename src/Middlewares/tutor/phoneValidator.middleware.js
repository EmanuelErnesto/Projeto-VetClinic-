const { body, validationResult } = require('express-validator');
module.exports = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage("O número informado não pode estar vazio.")
    .isString()
    .withMessage("O número inserido está em formato inválido")
    .matches(/^\d{11}$/)
    .withMessage("O número informado possui alguma letra ou não está no formato válido.")

    ,
    (req, res, next) => {
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
      }
      next()
    }

]


