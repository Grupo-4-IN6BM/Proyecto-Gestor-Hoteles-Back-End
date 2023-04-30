const {response, request} = require('express');

const Habitacion = require('../models/habitacion');
const Hotel = require('../models/hotel');

const getHabitaciones = async (req = request, res = response) => {

    //condiciones del get
    const query = { disponibilidad: true };

    const listaHabitaciones = await Promise.all([
        Habitacion.countDocuments(query),
        Habitacion.find(query).populate('hotel', 'nombre')
    ]);

    res.json({
        listaHabitaciones
    });

}
const getHabitacionesPorId = async (req = request, res = response) => {
    const {id} = req.params;
    const hotelId = await Habitacion.findById(id).populate('hotel', 'nombre')
    res.status(201).json(hotelId);

}
const postHabitacion = async (req = request, res = response) => {
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

const putHabitacion = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body;
    const buscar = await Habitacion.findOne({ numero: numero })

    if (buscar) {
        return res.status(400).json({
            msg: `La habitacion con el numero ${buscar.numero} ya existe en la DB`
        })
    }else{
        const habitacionEditada = await Habitacion.findByIdAndUpdate(id, resto, {new: true});

        res.status(201).json({
            habitacionEditada
        });
    }
    

}

const deleteHabitacion = async(req = request, res = response) => {
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


module.exports = {
    getHabitaciones,
    getHabitacionesPorId,
    postHabitacion,
    putHabitacion,
    deleteHabitacion
}