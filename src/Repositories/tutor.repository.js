const tutorModel = require('../Infrastructure/database/Models/tutor.model');
const { Op }     = require('sequelize')
const petModel = require('../Infrastructure/database/Models/pet.model');

class TutorRepository {

  static async createTutorRepository(tutor) {
    return await tutorModel.create(tutor)
  }

  static async getTutorById(id) {
    return await tutorModel.findOne({ where: { id: id },
      include: petModel
    } )

  }

  static async getTutorData(tutor) {

    return await tutorModel.findOne(
      {
        where: {
          [Op.or]: [
            { email: tutor.email },
            { phone: tutor.phone }
          ]
        }
      }
    )
  }
  static async getAllTutors() {

    return await tutorModel.findAll({include: petModel})
  }

  static async updateTutor(tutor, id) {
    return await tutorModel.update(tutor, { where: { id: id } })

  }
  static async deleteTutor(id) {
    await petModel.destroy({ where: { tutorId: id } });
    return await tutorModel.destroy({ where: { id: id } })
  }
}

module.exports = TutorRepository