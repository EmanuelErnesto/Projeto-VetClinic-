const { body, validationResult } = require('express-validator');

module.exports = [

  body('email')
    .trim()
    .isEmail()
    .withMessage("O email inserido é inválido.")
    .isLength({ min: 10, max: 200 })
    .withMessage("O email deve ter entre 10 e 200 caracteres."),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }
    next();
  }
];
