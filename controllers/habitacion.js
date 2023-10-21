const {response, request} = require('express');

const Habitacion = require('../models/habitacion');
const Hotel = require('../models/hotel');

const getHabitaciones = async (req = request, res = response) => {
    const habitaciones = await Habitacion.find({disponibilidad: true}).populate('hotel', 'nombre')
    res.status(201).json(habitaciones);

}
const getHabitacionesPorIdHotel = async (req, res) => {
    try {
      const { id } = req.params;
      const hotel = await Hotel.findById(id);
      if (!hotel) {
        return res.status(404).json({ error: 'Hotel no encontrado' });
      }
      const habitaciones = await Habitacion.find({ hotel: id, disponibilidad:true });
      res.status(201).json(habitaciones);
    } catch (error) {
      console.error('Error al obtener las habitaciones del hotel:', error);
      res.status(500).json({ error: 'Error del servidor' });
    }
  };

const getHabitacionesPorId = async (req = request, res = response) => {
    const {id} = req.params;
    const habitacionId = await Habitacion.findById(id).populate('hotel', 'nombre')
    res.status(201).json(habitacionId);
}

const postHabitacionAdmin = async (req = request, res = response) => {
    const id = req.usuario.id
    const { numero, costo, descripcion, capacidad, ...resto} = req.body;
    const hotel_id = await Hotel.findOne({administrador: id});
    const buscar = await Habitacion.findOne({ numero: numero })
    var hotel = hotel_id._id;
    if (buscar) {
        return res.status(400).json({
            msg: `La habitacion con el numero ${buscar.numero} ya existe en la DB`
        })
    }else{
    const habitacionGuardadaDB = new Habitacion({numero, costo, hotel, descripcion, capacidad, ...resto});
    const hotelGuardaHabitacion = await Hotel.findByIdAndUpdate(hotel_id._id, {$push:{habitaciones: [habitacionGuardadaDB._id]}})
    await habitacionGuardadaDB.save();
    
    res.json({
        habitacionGuardadaDB
    });
    }

}
const postHabitacionSuperAdmin = async (req = request, res = response) => {
    const habitacionAgregada = req.body;
    const buscar = await Habitacion.findOne({ numero: habitacionAgregada.numero })
    if (buscar) {
        return res.status(400).json({
            msg: `La habitacion con el numero ${buscar.habitacionAgregada.numero} ya existe en la DB`
        })
    }else{
    const habitacionGuardadaDB = new Habitacion({
        numero: habitacionAgregada.numero, 
        costo: habitacionAgregada.costo, 
        hotel: habitacionAgregada.hotel, 
        descripcion: habitacionAgregada.descripcion, 
        capacidad: habitacionAgregada.cantidad_personas,
        tipo: habitacionAgregada.tipo_habitacion});
   
    await habitacionGuardadaDB.save();
    
    res.json({
        habitacionGuardadaDB
    });
    }

}

const putHabitacion = async (req = request, res = response) => {
    const { id } = req.params;
    const habitacionEditada = req.body
    const buscar = await Habitacion.findOne({ numero: habitacionEditada.numero })
    if (buscar) {
        return res.status(400).json({
            msg: `La habitacion con el numero ${buscar.numero} ya existe en la DB`
        })
    }else{
        const habitacionEditada = await Habitacion.findByIdAndUpdate(id, {
            numero: habitacionEditada.numero, 
            descripcion: habitacionEditada.descripcion,
            costo: habitacionEditada.costo,
            img: habitacionEditada.img,
        }, {new: true});
        res.status(201).json({
            habitacionEditada
        });
    }
}


const deleteHabitacionAdmin = async(req = request, res = response) => {
    const { id } = req.params;
    const id_A = req.usuario.id
    const habitacionEliminada = await Habitacion.findByIdAndDelete(id, {new: true});
    const hotel_id = await Hotel.findOne({administrador: id_A});
    if(habitacionEliminada != null){
        const hotelEliminarHabitacion = await Hotel.findByIdAndUpdate(hotel_id._id, {$pull:{habitaciones: habitacionEliminada._id}})
    }
    res.json({
        msg: 'DELETE eliminar user',
        habitacionEliminada
    });
}

const deleteHabitacionSuperAdmin = async(req = request, res = response) => {
    const { id, hotel } = req.params;
    const habitacionEliminada = await Habitacion.findByIdAndDelete(id, {new: true});
    if(habitacionEliminada != null){
        const hotelEliminarHabitacion = await Hotel.findByIdAndUpdate(hotel, {$pull:{habitaciones: habitacionEliminada._id}})
    }
    res.json({
        msg: 'DELETE eliminar user',
        habitacionEliminada
    });
}

module.exports = {
    getHabitaciones,
    getHabitacionesPorId,
    postHabitacion: postHabitacionAdmin,
    postHabitacionSuperAdmin,
    getHabitacionesPorIdHotel,
    putHabitacion,
    deleteHabitacion: deleteHabitacionAdmin,
    deleteHabitacionSuperAdmin
}