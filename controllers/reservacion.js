const { request, response, json } = require('express');
const Reservacion = require('../models/reservacion');

const getReservaciones = async (req = request, res = response) => {
    const query = { estado: true };

    const listaReservaciones = await Promise.all([
        Reservacion.countDocuments(query),
        Reservacion.find(query).populate('usuario', 'nombre').populate('habitacion', 'numero')
    ]);

    res.json({
        msg: 'Lista de reservaciones',
        listaReservaciones
    });

}


const getReservacionPorId = async (req = request, res = response) => {
    const { id } = req.params;
    const reservaById = await Reservacion.findById(id).populate('usuario', 'nombre')
        .populate('habitacion', 'numero');

    res.status(201).json(reservaById);
}


const postReservacion = async (req = request, res = response) => {
    const { usuario, fechaHora, ...body } = req.body;

    const reservaDB = await Reservacion.findOne({ personaReserva: body.personaReserva });

    if (reservaDB) {
        return res.status(400).json({
            msg: `La reservacion de ${reservaDB.personaReserva}, ya existe en la DB`
        });
    }

    const data = {
        ...body,
        personaReserva,
        usuario: req.usuario._id
    }

    const reservar = await Reservacion(data);

    await reservar.save();

    res.status(201).json(reservar);

}


const putAgregarPersona = async (req = request, res = response) => {
    const { id } = req.params;
    const { personaReserva, usuario, habitacion, ...resto } = req.body;

    const personaAgregada = await Reservacion.findByIdAndUpdate(
        id,
        { $push: { personaReserva } },
        { new: true }
    );

    res.status(201).json(personaAgregada);

};


const putReservacion = async (req = request, res = response) => {
    const { id } = req.params;
    const { usuario, ...restoDatos } = req.body;

    if (restoDatos.personaReserva) {
        restoDatos.personaReserva;
        restoDatos.usuario = req.usuario._id;
    }

    const reservacionActualizada = await Reservacion.findByIdAndUpdate(id, restoDatos);

    res.status(201).json({
        msg: 'Editar reservacion',
        reservacionActualizada
    })
}

const deleteReservacion = async (req = request, res = response) => {
    const { id } = req.params;

    const reservacionCancelada = await Reservacion.findByIdAndDelete(id);

    res.json({
        msg: 'Eliminar reservacion',
        reservacionCancelada
    })

}


module.exports = {
    getReservaciones,
    getReservacionPorId,
    postReservacion,
    putAgregarPersona,
    putReservacion,
    deleteReservacion
}