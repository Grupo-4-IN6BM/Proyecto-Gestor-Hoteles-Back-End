<<<<<<< Updated upstream
=======
const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const Evento = require('../models/evento');


const getEventos = async (req = request, res = response) => {

  const query = { estado: true };

  const listaEventos = await Promise.all([
    Evento.countDocuments(query),
    Evento.find(query),
  ]);

  res.json({
    msg: "get Api - Controlador Empresa",
    listaEventos,
  });
};

const postEvento = async (req = request, res = response) => {

  //Desestructuración
  const { nombre, horaInicio, horaFinal, descripcion, tipo,  precio } = req.body;
  const eventoGuardadoDB = new Evento({ nombre, horaInicio, horaFinal, descripcion, tipo, precio });

  //Guardar en BD
  await eventoGuardadoDB.save();

  res.json({
    msg: 'Post Api - Agregando Evento',
    eventoGuardadoDB
  });

}


const putEvento = async (req = request, res = response) => {

    //req.params para ir a traer parametros de las rutas
    const { id } = req.params;
    const { _id, ...resto } = req.body;
    
    //Editar al usuario por el id
    const eventoEditado = await Evento.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'put Api = Editar evento',
        id,
        eventoEditado
    });

}

const deleteEvento = async (req = request, res = response) => {
    
  const {id} = req.params;

  //Eliminando fisicamente de la base de datos
  const eventoEliminado = await Evento.findByIdAndDelete(id)
  
  
  res.json({
      msg: 'delete Api = eliminando Evento',
      eventoEliminado
  })
}



module.exports = {
  getEventos,
  postEvento,
  putEvento,
  deleteEvento
}
>>>>>>> Stashed changes
