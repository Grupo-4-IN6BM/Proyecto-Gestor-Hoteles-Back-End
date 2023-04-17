const { request, response } = require('express');
const Reservacion = require('../models/reservacion');
const Usuario = require('../models/usuario');
const Habitacion = require('../models/habitacion');
const Servicio = require('../models/servicio');
const Evento = require('../models/evento');
const Hotel = require('../models/hotel');


const getReservaciones = async (req = request, res = response) => {

    const listaReservaciones = await Promise.all([
        Reservacion.countDocuments(),
        Reservacion.find().populate('usuario', 'nombre')
            .populate('habitaciones', 'numero costo')
            .populate('servicios', 'nombre precio descripcion')
            .populate('eventos', 'nombre precio')

    ]);

    res.status(201).json(listaReservaciones);

}



const getReservacionesPorNombre = async (req = request, res = response) => {
    const { nombre } = req.params;
    const query = { personaReserva: nombre };

    const listaReservaciones = await Promise.all([
        Reservacion.countDocuments(query),
        Reservacion.find(query).populate('usuario', 'nombre')
            .populate('habitaciones', 'numero costo')
            .populate('servicios', 'nombre precio descripcion')
            .populate('eventos', 'nombre precio')
    ]);

    res.status(201).json(listaReservaciones);

}

const getReservacionPorId = async (req = request, res = response) => {
    const id = req.usuario._id;
    const reservaById = await Reservacion.findOne({ usuario: id }).populate('usuario', 'nombre')
        .populate('habitaciones', 'numero costo')
        .populate('servicios', 'nombre precio descripcion')
        .populate('eventos', 'nombre precio')
    res.status(201).json(reservaById);
}


const postReservacion = async (req = request, res = response) => {
    const id = req.usuario.id;
    const { habitaciones, servicios, eventos, fechaInicio, fechaFinal, cantidadPersonas, personaReserva,
        dias_habitaciones, ...body } = req.body;

    // VALIDACION
    for (let i = 0; i < habitaciones.length; i++) {
        const compruebaCapacidad = await Habitacion.findById(habitaciones[i]);
        if (compruebaCapacidad.capacidad < cantidadPersonas) {
            res.status(404).json({
                msg: `La capacidad de la habitacion es de ${compruebaCapacidad.capacidad}`
            })
        }
    }

    // OBTENER EL TOTAL
    let totalH = 0;
    let totalE = 0;
    let totalS = 0;
    let totalDias = 0;
    let totalFinal = 0;
    let todoBien = true;
    for (let h = 0; h < habitaciones.length; h++) {
        for (let d = 0; d < dias_habitaciones.length; d++) {
            totalDias = + dias_habitaciones[d]
        }
        const habitacionPrecio = await Habitacion.findById(habitaciones[h])
        if (habitacionPrecio.disponibilidad === true) {
        totalH = + habitacionPrecio.costo * totalDias
        const cambioEstadoHabitacion = await Habitacion.findByIdAndUpdate(habitacionPrecio._id, { disponibilidad: false })
        todoBien = true;
        } else {
         todoBien=false;
        }
        if (eventos != null) {
            for (let e = 0; e < eventos.length; e++) {
                const eventoPrecio = await Evento.findById(eventos[e])
                totalE = + eventoPrecio.precio * cantidadPersonas
            }
        }

        if (servicios != null) {
            for (let s = 0; s < servicios.length; s++) {
                const servicioPrecio = await Servicio.findById(servicios[s])
                totalS = + servicioPrecio.precio
            }
        }
        totalFinal = totalH + totalE + totalS
    }


    // ID DEL HOTEL
    const hotelId = await Hotel.findOne({ habitaciones: { $in: [habitaciones] } });
    if(todoBien === true){
    const reservar = await Reservacion({
        usuario: req.usuario.id,
        cantidadPersonas: cantidadPersonas,
        personaReserva: personaReserva.toUpperCase(),
        habitaciones: habitaciones,
        eventos: eventos,
        total: totalFinal,
        servicios: servicios,
        fechaFinal: fechaFinal,
        fechaInicio: fechaInicio,
        dias_habitaciones: dias_habitaciones,
        hotel: hotelId
    });
    const reservacionUsuario = Usuario.findByIdAndUpdate(id, { reservacion: reservar._id })
    const aumentaReservacion = Hotel.findByIdAndUpdate(hotelId, { reservaciones: hotelId.reservaciones + 1 })
    await reservar.save();
    res.status(201).json(reservar);
    }else{
        res.status(400).json({
            msg: 'La habitacion no esta disponible'
        })
    }

}

const putReservacion = async (req = request, res = response) => {
    const { id } = req.params;
    const { habitaciones, servicios, eventos, fechaInicio, fechaFinal, cantidadPersonas, personaReserva,
        dias_habitaciones, ...body } = req.body;

    // VALIDACION
    for (let i = 0; i < habitaciones.length; i++) {
        const compruebaCapacidad = await Habitacion.findById(habitaciones[i]);
        if (compruebaCapacidad.capacidad < cantidadPersonas) {
            res.status(404).json({
                msg: `La capacidad de la habitacion es de ${compruebaCapacidad.capacidad}`
            })
        }
    }

    // OBTENER EL TOTAL
    let totalH = 0;
    let totalE = 0;
    let totalS = 0;
    let totalDias = 0;
    let totalFinal = 0;

    for (let h = 0; h < habitaciones.length; h++) {
        for (let d = 0; d < dias_habitaciones.length; d++) {
            totalDias = + dias_habitaciones[d]
        }
        const habitacionPrecio = await Habitacion.findById(habitaciones[h])
       
        // if (habitacionPrecio.disponibilidad === true) {
            totalH = + habitacionPrecio.costo * totalDias
            
            const cambioEstadoHabitacion = Habitacion.findByIdAndUpdate(habitacionPrecio._id, { disponibilidad: false })
        // } else {
            // res.status(400).json({ msg: 'Habitacion no disponible' });
        // }
        if (eventos != null) {
            for (let e = 0; e < eventos.length; e++) {
                const eventoPrecio = await Evento.findById(eventos[e])
                totalE = + eventoPrecio.precio * cantidadPersonas
            }
        }

        if (servicios != null) {
            for (let s = 0; s < servicios.length; s++) {
                const servicioPrecio = await Servicio.findById(servicios[s])
                totalS = + servicioPrecio.precio
            }
        }
        totalFinal = totalH + totalE + totalS
    }


    // ID DEL HOTEL
    const hotelId = await Hotel.findOne({ habitaciones: { $in: [habitaciones] } });
    const reservacionActualizada = await Reservacion.findByIdAndUpdate(id, {
        usuario: req.usuario.id,
        cantidadPersonas: cantidadPersonas,
        personaReserva: personaReserva.toUpperCase(),
        habitaciones: habitaciones,
        eventos: eventos,
        total: totalFinal,
        servicios: servicios,
        fechaFinal: fechaFinal,
        fechaInicio: fechaInicio,
        dias_habitaciones: dias_habitaciones,
        hotel: hotelId
    })

    res.status(201).json({
        msg: 'Editar reservacion',
        reservacionActualizada
    })

}

const putMiReservacion = async (req = request, res = response) => {
    const id = req.usuario.id
    const { habitaciones, servicios, eventos, fechaInicio, fechaFinal, cantidadPersonas, personaReserva,
        dias_habitaciones, ...body } = req.body;

    // VALIDACION
    for (let i = 0; i < habitaciones.length; i++) {
        const compruebaCapacidad = await Habitacion.findById(habitaciones[i]);
        if (compruebaCapacidad.capacidad < cantidadPersonas) {
            res.status(404).json({
                msg: `La capacidad de la habitacion es de ${compruebaCapacidad.capacidad}`
            })
        }
    }

    // OBTENER EL TOTAL
    let totalH = 0;
    let totalE = 0;
    let totalS = 0;
    let totalDias = 0;
    let totalFinal = 0;

    for (let h = 0; h < habitaciones.length; h++) {
        for (let d = 0; d < dias_habitaciones.length; d++) {
            totalDias = + dias_habitaciones[d]
        }
        const habitacionPrecio = await Habitacion.findById(habitaciones[h])
        totalH = + habitacionPrecio.costo * totalDias
        const cambioEstadoHabitacion = Habitacion.findByIdAndUpdate(habitacionPrecio.id, { disponibilidad: false })
        if (eventos != null) {
            for (let e = 0; e < eventos.length; e++) {
                const eventoPrecio = await Evento.findById(eventos[e])
                totalE = + eventoPrecio.precio * cantidadPersonas
            }
        }

        if (servicios != null) {
            for (let s = 0; s < servicios.length; s++) {
                const servicioPrecio = await Servicio.findById(servicios[s])
                totalS = + servicioPrecio.precio
            }
        }
        totalFinal = totalH + totalE + totalS
    }


    // ID DEL HOTEL
    const hotelId = await Hotel.findOne({ habitaciones: { $in: [habitaciones] } });


    const idReserva = await Reservacion.findOne({ usuario: id })

    if (idReserva != null) {
        const reservacionActualizada = await Reservacion.findByIdAndUpdate(idReserva, {
            usuario: req.usuario.id,
            cantidadPersonas: cantidadPersonas,
            personaReserva: personaReserva.toUpperCase(),
            habitaciones: habitaciones,
            eventos: eventos,
            total: totalFinal,
            servicios: servicios,
            fechaFinal: fechaFinal,
            fechaInicio: fechaInicio,
            dias_habitaciones: dias_habitaciones,
            hotel: hotelId
        })

        res.status(201).json({
            msg: 'Editar reservacion',
            reservacionActualizada
        })
    } else {
        res.status(400).json({ msg: 'El usuario no tiene reservaciones' })
    }
}

const deleteReservacion = async (req = request, res = response) => {
    const { id } = req.params;
    const reservacionCancelada = await Reservacion.findByIdAndDelete(id, { new: true });
    res.json({
        msg: 'Eliminar reservacion',
        reservacionCancelada
    })
}

const deleteMiReservacion = async (req = request, res = response) => {
    const id = req.usuario.id;
    const reservacionCancelada = await Reservacion.findOne({ usuario: id });
    if (reservacionCancelada != null) {
        const eliminarReservacion = await Reservacion.findByIdAndDelete(reservacionCancelada._id)
        res.json({
            msg: 'Eliminar reservacion',
            eliminarReservacion
        })
    } else {
        res.status(400).json({ msg: 'La reservacion no existe' })
    }

}

module.exports = {
    getReservaciones,
    getReservacionPorId,
    postReservacion,
    putReservacion,
    deleteReservacion,
    deleteMiReservacion,
    getReservacionesPorNombre,
    putMiReservacion,
}