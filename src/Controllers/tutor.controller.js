const tutorService = require("../Services/tutor.services");

function HandleTutorData(Request) {
  return {
    name: Request.body.name,
    email: Request.body.email,
    phone: Request.body.phone,
    zip_code: Request.body.zip_code,
    date_of_birth: Request.body.date_of_birth,

  }
}

class TutorController {

  static async create(req, res) {
    try {
      const data = HandleTutorData(req)
      await tutorService.createTutorService(data)
      res.status(201).json({ data, msg: "Tutor criado com sucesso." })
    } catch (error) {
      return res.status(400).json({ msg: "Não foi possível criar o tutor. " + error })
    }
  }

  static async getById(req, res) {
    try {
      const id = req.params.id
      const data = await tutorService.getTutorService(id)
      res.status(200).json({ data, msg: "Tutor retornado com sucesso." })
    } catch (error) {
      return res.status(404).json({ msg: error.message })
    }
  }

  static async getAllTutors(req, res) {
    try {
      const data = await tutorService.getAllTutors()
      res.status(200).json({ data, msg: "Tutores retornados com sucesso." })
    } catch (error) {
      return res.status(404).json({ msg: error.message })
    }
  }
  static async update(req, res) {
    try {
      const tutor = HandleTutorData(req)
      const id = req.params.id
      await tutorService.updateTutor(tutor, id)
      res.status(201).json({ tutor, msg: "tutor atualizado com sucesso." })
    } catch (error) {
      return res.status(404).json({ msg: error.message })
    }
  }
  static async delete(req, res){
    try {
      const id = req.params.id
      await tutorService.deleteTutor(id)
      res.status(204).json({msg: `Tutor de id ${id} deletado com sucesso.`});
    } catch (error) {
      return res.status(404).json({ msg: error.message })
    }
  }
}

module.exports = TutorController