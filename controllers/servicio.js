const { response, request } = require("express");
const bcrypt = require("bcryptjs");
//Importación del modelo
const Servicio = require("../models/servicio");
const Hotel = require("../models/hotel");

const getServicio = async (req = request, res = response) => {
  const servicioId = await Servicio.find({estado: true}).populate('hotel')
  res.status(201).json({
    servicioId
  });
};

const getServicioId = async (req = request, res = response) => {
  const {id} = req.params
  const servicioId = await Servicio.findById(id)
  res.status(201).json(servicioId);
};

const postServicioAdmin = async (req = request, res = response) => {
  const id = req.usuario.id;
  const { nombre, precio, descripcion , img} = req.body;
  const hotel_id = await Hotel.findOne({ administrador: id });
  const buscar = await Servicio.findOne({ nombre: nombre });
  if (buscar) {
    return res.status(400).json({
      msg: `El servicio con el nombre ${buscar.nombre} ya existe en la DB`
    })
  } else {
    const servicioGuardadoDB = new Servicio({
      nombre: nombre,
      precio: precio,
      descripcion: descripcion,
      hotel: hotel_id.id,
      img: img
    });
    const hotelGuardaServicio = await Hotel.findByIdAndUpdate(hotel_id.id, {
      $push: { servicios: [servicioGuardadoDB._id] },
    });
    await servicioGuardadoDB.save();

    res.status(201).json({
      servicioGuardadoDB,
    });
  };
}

const postServicioSuperAdmin = async (req = request, res = response) => {
  const id = req.usuario.id;
  const { nombre, precio, descripcion, hotel , img} = req.body;;
  const buscar = await Servicio.findOne({ nombre: nombre });
  if (buscar) {
    return res.status(400).json({
      msg: `El servicio con el nombre ${buscar.nombre} ya existe en la DB`
    })
  } else {
    const servicioGuardadoDB = new Servicio({
      nombre: nombre,
      precio: precio,
      descripcion: descripcion,
      hotel: hotel,
      img: img
    });
    const hotelGuardaServicio = await Hotel.findByIdAndUpdate(hotel, {
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
      },
      { new: true }
    );

    res.status(201).json({
      servicioEditado,
    });
  }

};

const deleteServicioAdmin = async (req = request, res = response) => {
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

const deleteServicioSuperAdmin = async (req = request, res = response) => {
  const { id, hotel } = req.params;
  const servicioEliminado = await Servicio.findByIdAndDelete(id, { new: true });
  if (servicioEliminado != null) {
    const hotelEliminarHabitacion = await Hotel.findByIdAndUpdate(
      hotel,
      { $pull: { servicios: servicioEliminado._id } }
    );
  }
  res.status(201).json({
    servicioEliminado,
  });
};

module.exports = {
  getServicio,
  getServicioId,
  postServicio: postServicioAdmin,
  postServicioSuperAdmin,
  putServicio,
  deleteServicio: deleteServicioAdmin,
  deleteServicioSuperAdmin
};
