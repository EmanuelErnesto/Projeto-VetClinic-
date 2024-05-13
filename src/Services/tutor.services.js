const tutorRepository = require('../Repositories/tutor.repository')

class TutorService {
  static async createTutorService(tutor) {

    const data = await tutorRepository.getTutorData(tutor)
    if (data !== null) {
      throw new Error('O tutor que você tentou criar já está cadastrado no sistema.')
    }
    return await tutorRepository.createTutorRepository(tutor)
  }

  static async getTutorService(id) {

    const data = await tutorRepository.getTutorById(id)
    if (data === null) {
      throw new Error('O tutor que você está buscando não pôde ser encontrado.')
    }
    return data
  }

  static async getAllTutors() {
    const data = await tutorRepository.getAllTutors()
    if (data === null || data.length === 0) {
      throw new Error("Não foi possível encontrar nenhum tutor.")
    }
    return data
  }
  static async updateTutor(tutor, id) {
    // valida se o tutor já existe
    const check = await tutorRepository.getTutorById(id)
    if (check === null) {
      throw new Error("O tutor que você tentou atualizar não existe.")
    }
    return tutorRepository.updateTutor(tutor, id)
  }
  static async deleteTutor(id) {
    const check = await tutorRepository.getTutorById(id)
    if (check === null) {
      throw new Error("O tutor que você tentou deletar não existe.")
    }
    return tutorRepository.deleteTutor(id);
  }
}

module.exports = TutorService