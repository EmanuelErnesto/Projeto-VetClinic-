const PetRepository = require('../Repositories/pet.repository')
const tutorRepository = require('../Repositories/tutor.repository')

class PetService {

  static async createPetService(pet) {
    const tutorId = pet.tutorId
    const data = await PetRepository.getPetData(pet)

    if (data !== null) {
      throw new Error("O pet que você está tentando criar já existe.")
    }

    const tutor = await tutorRepository.getTutorById(tutorId)

    if(tutor === null){
      throw new Error("O tutor que você tentou associar o pet não existe.")
    }
    return await PetRepository.createPetRepository(pet)
  }

  static async updatePetService(pet, tutorId) {
    const check = await PetRepository.getPetById(pet.id)
    if (check === null) {
      throw new Error("O pet que você tentou atualizar não existe.");
    }
    const tutor = await tutorRepository.getTutorById(tutorId)
    if (tutor === null) {
      throw new Error("O tutor passado na requisição não existe.")
    }
    // checa se os dados enviados para atualização são iguais aos do pet 
    const validatePet = await PetRepository.getPetData(pet)
    if(validatePet !== null){
      throw new Error("Os dados que você está tentando passar para uma atualização do pet já foram enviados anteriormente.")
    }
    return PetRepository.updatePetRepository(pet)
  }

  static async deletePetService(pet){
    const check = await PetRepository.getPetById(pet)
    if(check === null){
      throw new Error("O pet que você tentou apagar não existe")
    }
    const tutor = await tutorRepository.getTutorById(pet.tutorId)
    if(tutor === null){
      throw new Error("O id do tutor informado na requisição é inválido.");
    }
    return PetRepository.deletePetRepository(id)
  }
}

module.exports = PetService