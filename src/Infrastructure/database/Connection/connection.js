const config = require('./config');

async function connection(){

  try {

    await config.sync()
    console.log("Conexão com o banco realizada com sucesso!.");

  } catch (err) {
    console.log(`Não foi possível realizar a conexão. Erro: ${err}` )
  }
}



module.exports = connection