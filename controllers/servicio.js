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
  var hotel = hotel_id._id;
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

  res.json({
    msg: "Post Api - Post Servicio",
    servicioGuardadoDB,
  });
};

const putServicio = async (req = request, res = response) => {
  const idHotel = req.usuario.id;
  //Req.params sirve para traer parametros de las rutas
  const { id } = req.params;
  const { _id, nombre, precio, descripcion } = req.body;

  //Editar al usuario por el id
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

  res.json({
    msg: "PUT editar servicio",
    servicioEditado,
  });
};

const deleteServicio = async (req = request, res = response) => {
  //Req.params sirve para traer parametros de las rutas
  const { id } = req.params;
  const id_A = req.usuario.id;
  //Eliminar fisicamente de la DB
  const servicioEliminado = await Servicio.findByIdAndDelete(id, { new: true });
  const hotel_id = await Hotel.findOne({ administrador: id_A });
  if (servicioEliminado != null) {
    const hotelEliminarHabitacion = await Hotel.findByIdAndUpdate(
      hotel_id._id,
      { $pull: { servicios: servicioEliminado._id } }
    );
  }
  //Eliminar cambiando el estado a false

  res.json({
    msg: "DELETE eliminar servicio",
    servicioEliminado,
  });
};

module.exports = {
  getServicio,
  postServicio,
  putServicio,
  deleteServicio,
};
