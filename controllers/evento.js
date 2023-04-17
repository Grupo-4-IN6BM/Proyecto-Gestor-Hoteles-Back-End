const { response, request } = require('express');
//Importación del modelo
const Evento = require('../models/evento');
const Hotel = require('../models/hotel');

const getEventos = async (req = request, res = response) => {

  const query = { disponibilidad: true };

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
  const id = req.usuario.id;
  const { nombre, fechaInicio, fechaFinal, descripcion, tipo, precio } = req.body;
  const eventoGuardadoDB = new Evento({ nombre, fechaInicio, fechaFinal, descripcion, tipo, precio });
  const hotel_id = await Hotel.findOne({ administrador: id });
  var hotel = hotel_id._id;
  const hotelGuardaEvento = await Hotel.findByIdAndUpdate(hotel_id._id, {
    $push: { eventos: [eventoGuardadoDB._id] },
  });
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
    const eventoEditado = await Evento.findByIdAndUpdate(id, resto, {new: true});

    res.json({
        msg: 'put Api = Editar evento',
        id,
        eventoEditado
    });

}

const deleteEvento = async (req = request, res = response) => {
  const id_A = req.usuario.id;
  const {id} = req.params;
  const eventoEliminado = await Evento.findByIdAndDelete(id, {new: true})
  const hotel_id = await Hotel.findOne({ administrador: id_A });
  if (eventoEliminado != null) {
    const hotelEliminarHabitacion = await Hotel.findByIdAndUpdate(
      hotel_id._id,
      { $pull: { eventos: eventoEliminado._id } }
    );
  }
  
  res.json({
      eventoEliminado
  })
}



module.exports = {
  getEventos,
  postEvento,
  putEvento,
  deleteEvento
}