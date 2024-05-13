const petService = require('../Services/pet.services')

function HandlePetData(req) {
  return {
    id: req.params.petId,
    name: req.body.name,
    species: req.body.species,
    carry: req.body.carry,
    weight: req.body.weight,
    date_of_birth: req.body.date_of_birth,
    tutorId: req.params.tutorId
  }
}

class PetController {
  static async create(req, res) {
    try {
      const data = HandlePetData(req)
      await petService.createPetService(data)
      res.status(201).json({ data, msg: "Pet criado com sucesso!" })
    } catch (error) {
      res.status(500).json({ errors: error.message })
    }
  }

  static async update(req, res) {
    try {
      const data = HandlePetData(req)
      const tutorId = req.params.tutorId
      await petService.updatePetService(data, tutorId)
      res.status(201).json({ data, msg: "Pet atualizado com sucesso!" })

    } catch (error) {
      res.status(500).json({ errors: error.message })
    }
  }
  static async delete(req, res) {
    try {
      const id = req.params.petId
      const data = await petService.deletePetService(id)
      res.status(200).json({ data, msg: "Pet apagado com sucesso." })
    } catch (error) {
      res.status(500).json({ errors: error.message })
    }
  }
}

module.exports = PetController