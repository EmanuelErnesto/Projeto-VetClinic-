const petModel = require('../Infrastructure/database/Models/pet.model');
const { Op } = require('sequelize');

class PetRepository {

  static async createPetRepository(pet, tutorId) {
    return await petModel.create(pet, tutorId)
  }

  static async getPetById(id) {
    return await petModel.findByPk(id)
  }

  static async getPetData(pet) {
    return await petModel.findOne({
      where: {
        name: pet.name,
        species: pet.species,
        carry: pet.carry,
        weight: pet.weight,
        date_of_birth: pet.date_of_birth
      }
    })
  }

  static async updatePetRepository(pet, tutorId) {
    return await petModel.update(pet, { where: { id: pet.id } })
  }

  static async deletePetRepository(id){
   return await petModel.destroy({where: {id: id}})
  }

}
module.exports = PetRepository