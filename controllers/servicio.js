const { response, request } = require("express");
const bcrypt = require("bcryptjs");
//Importación del modelo
const Servicio = require("../models/servicio");
const Hotel = require("../models/hotel");

const getServicio = async (req = request, res = response) => {
  //condiciones del get
  const query = { estado: true };

  const listaServicios = await Promise.all([
    Servicio.countDocuments(query),
    Servicio.find(query),
  ]);

  res.json({
    msg: "get Api - Controlador servicio",
    listaServicios,
  });
};

const postServicio = async (req = request, res = response) => {
  const id = req.usuario.id;
  //Desestructuración
  const { nombre, precio, descripcion } = req.body;
  const hotel_id = await Hotel.findOne({ administrador: id });
  const buscar = await Servicio.findOne({ nombre: nombre });
  var hotel = hotel_id._id;
  if (buscar) {
    return res.status(400).json({
      msg: `El servicio con el nombre ${buscar.nombre} ya existe en la DB`
    })
  } else {
    const servicioGuardadoDB = new Servicio({
      nombre: nombre,
      precio: precio,
      descripcion: descripcion,
      hotel: id,
    });
    const hotelGuardaServicio = await Hotel.findByIdAndUpdate(hotel_id._id, {
      $push: { servicios: [servicioGuardadoDB._id] },
    });
    await servicioGuardadoDB.save();

    res.status(201).json({
      servicioGuardadoDB,
    });
  };
}


const putServicio = async (req = request, res = response) => {
  const idHotel = req.usuario.id;
  //Req.params sirve para traer parametros de las rutas
  const { id } = req.params;
  const { _id, nombre, precio, descripcion } = req.body;
  const buscar = await Servicio.findOne({ nombre: nombre });

  if (buscar) {
    return res.status(400).json({
      msg: `El servicio con el nombre ${buscar.nombre} ya existe en la DB`
    })
  } else {
    const servicioEditado = await Servicio.findByIdAndUpdate(
      id,
      {
        nombre: nombre,
        precio: precio,
        descripcion: descripcion,
        hotel: idHotel,
      },
      { new: true }
    );

    res.status(201).json({
      servicioEditado,
    });
  }

};

const deleteServicio = async (req = request, res = response) => {
  const { id } = req.params;
  const id_A = req.usuario.id;
  const servicioEliminado = await Servicio.findByIdAndDelete(id, { new: true });
  const hotel_id = await Hotel.findOne({ administrador: id_A });
  if (servicioEliminado != null) {
    const hotelEliminarHabitacion = await Hotel.findByIdAndUpdate(
      hotel_id._id,
      { $pull: { servicios: servicioEliminado._id } }
    );
  }

  res.status(201).json({
    servicioEliminado,
  });
};

module.exports = {
  getServicio,
  postServicio,
  putServicio,
  deleteServicio,
};
