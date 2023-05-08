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

const getMiReservacion = async (req = request, res = response) => {
    const id = req.usuario.id;
    const reservacion = await Reservacion.find({usuario:id}).populate('usuario', 'nombre')
    .populate('habitaciones', 'img tipo numero costo')
    .populate('servicios', 'img nombre precio descripcion')
    .populate('eventos', 'img nombre precio');
    res.status(201).json(reservacion);
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


const agregarHabitacion = async (req, res) => {
    const idUsuario = req.usuario.id;
    console.log("ID",idUsuario);
    const {id} = req.params;
    const idReservacion = await Reservacion.findOne({usuario: idUsuario})
    console.log("RESERVACION" ,idReservacion)
    const agregaHabitacion = await Reservacion.findByIdAndUpdate(idReservacion._id, {$push:{habitaciones:[id]}})
    const cambioEstadoHabitacion = await Habitacion.findByIdAndUpdate(id, { disponibilidad: false })
    res.status(201).json(agregaHabitacion)
}

const agregarServicio = async (req, res) => {
    const idUsuario = req.usuario.id;
    console.log("ID",idUsuario);
    const {id} = req.params;
    const idReservacion = await Reservacion.findOne({usuario: idUsuario})
    console.log("RESERVACION" ,idReservacion)
    const agregaServicio = await Reservacion.findByIdAndUpdate(idReservacion._id, {$push:{servicios:[id]}})
    res.status(201).json(agregaServicio)
}

const agregarEvento = async (req, res) => {
    const idUsuario = req.usuario.id;
    console.log("ID",idUsuario);
    const {id} = req.params;
    const idReservacion = await Reservacion.findOne({usuario: idUsuario})
    console.log("RESERVACION" ,idReservacion)
    const agregarEvento = await Reservacion.findByIdAndUpdate(idReservacion._id, {$push:{eventos:[id]}})
    res.status(201).json(agregarEvento)
}

const postReservacion = async (req = request, res = response) => {
    const id = req.usuario.id;
    const { habitaciones, servicios, eventos, fechaInicio, fechaFinal, cantidadPersonas, personaReserva, ...body } = req.body;
    const fechaInicio2 = new Date(req.body.fechaInicio);
    const fechaFinal2 = new Date(req.body.fechaFinal);
    const diferenciaFechas = fechaInicio2 - fechaFinal2;
    let diasFechas = Math.floor(diferenciaFechas / (1000 * 60 * 60 * 24));
    if (diasFechas < 0) {
        diasFechas = diasFechas * -1
    }
    console.log('DIAS ', diasFechas)
    let totalH = 0;
    let totalE = 0;
    let totalS = 0;
    let totalDias = 0;
    let totalFinal = 0;
    let hotelId= null;
    let todoBien = true;
    // VALIDACION
    if (habitaciones) {
        hotelId = await Habitacion.findById(habitaciones[0]);
        console.log('HOTEL',hotelId)
        let valorRepetido;
        for (let i = 0; i < habitaciones.length; i++) {
            for (let j = i + 1; j < habitaciones.length; j++) {
                if (habitaciones[i] === habitaciones[j]) {
                    valorRepetido = habitaciones[i];
                    break;
                }
            }
        }
        if (valorRepetido) {
            res.status(400).json(`La habitacion con el id ${valorRepetido} esta repetida`)
            todoBien = false;
        } else {
            for (let i = 0; i < habitaciones.length; i++) {
                const compruebaCapacidad = await Habitacion.findById(habitaciones[i]);
                if (compruebaCapacidad) {
                    if (compruebaCapacidad.capacidad < cantidadPersonas) {
                        res.status(404).json({
                            msg: `La capacidad de la habitacion es de ${compruebaCapacidad.capacidad}`
                        })
                    }
                } else {
                    res.status(404).json({
                        msg: `No existe la habitacion ingresada`
                    })
                    todoBien = false;
                }

            }
            // OBTENER EL TOTAL
            for (let h = 0; h < habitaciones.length; h++) {
                totalDias =+ diasFechas
                const habitacionPrecio = await Habitacion.findById(habitaciones[h])
                if (habitacionPrecio != null) {
                    if (habitacionPrecio.disponibilidad === true) {
                        totalH = + habitacionPrecio.costo * totalDias

                        todoBien = true;
                    } else {
                        res.status(404).json({
                            msg: `La habitacion no esta disponible`
                        })
                        todoBien = false;
                    }
                }
                if (eventos != null) {
                    if (eventos) {
                        let valorRepetido;
                        for (let i = 0; i < eventos.length; i++) {
                            for (let j = i + 1; j < eventos.length; j++) {
                                if (eventos[i] === eventos[j]) {
                                    valorRepetido = eventos[i];
                                    break;
                                }
                            }
                        }
                        if (valorRepetido) {
                            res.status(400).json(`El evento con el id ${valorRepetido} esta repetido`)
                            todoBien = false;
                        } else {
                            for (let e = 0; e < eventos.length; e++) {
                                const eventoPrecio = await Evento.findById(eventos[e])
                                totalE = + eventoPrecio.precio * cantidadPersonas
                            }
                        }
                    }
                }
                if (servicios != null) {
                    if (servicios) {
                        let valorRepetidoS;
                        for (let i = 0; i < servicios.length; i++) {
                            for (let j = i + 1; j < servicios.length; j++) {
                                if (servicios[i] === servicios[j]) {
                                    valorRepetidoS = servicios[i];
                                    break;
                                }
                            }
                        }
                        if (valorRepetidoS) {
                            res.status(400).json(`El servicio con el id: ${valorRepetidoS} esta repetido`)
                            todoBien = false;
                        } else {
                            for (let s = 0; s < servicios.length; s++) {
                                const servicioPrecio = await Servicio.findById(servicios[s])
                                totalS = + servicioPrecio.precio
                            }
                        }
                        }
                    totalFinal = totalH + totalE + totalS
                }
                if (todoBien) {
                    const cambioEstadoHabitacion = await Habitacion.findByIdAndUpdate(habitacionPrecio._id, { disponibilidad: false })
                }
            }
        }
    } else {
        res.status(400).json({
            msg: 'Se necesita tener un dato en habitaciones'
        })
        todoBien = false;
    }
    // ID DEL HOTEL
    if (todoBien === true) {
        const reservar = await new Reservacion({
            usuario: req.usuario.id,
            cantidadPersonas: cantidadPersonas,
            personaReserva: personaReserva.toUpperCase(),
            habitaciones: habitaciones,
            eventos: eventos,
            total: totalFinal,
            servicios: servicios,
            fechaFinal: fechaFinal,
            fechaInicio: fechaInicio,
            dias_habitaciones: diasFechas,
            hotel: hotelId.hotel
        });
        const reservacionUsuario = await Usuario.findByIdAndUpdate(id, { $push: { reservacion: [reservar._id] } })
        console.log('Reserva user ', reservacionUsuario)
        const aumentaReservacion = await Hotel.findByIdAndUpdate(hotelId.hotel, { reservaciones: + 1 })
        console.log('Hotel reservacion ', aumentaReservacion)
        await reservar.save();
        res.status(201).json(reservar);
    } else {
        console.log("Todo mal")
    }

}

const putReservacion = async (req = request, res = response) => {
    const id = req.params;
    const { habitaciones, servicios, eventos, fechaInicio, fechaFinal, cantidadPersonas, personaReserva, ...body } = req.body;
    const fechaInicio2 = new Date(req.body.fechaInicio);
    const fechaFinal2 = new Date(req.body.fechaFinal);
    const diferenciaFechas = fechaInicio2 - fechaFinal2;
    let diasFechas = Math.floor(diferenciaFechas / (1000 * 60 * 60 * 24));
    if (diasFechas < 0) {
        diasFechas = diasFechas * -1
    }
    console.log('DIAS ', diasFechas)
    let totalH = 0;
    let totalE = 0;
    let totalS = 0;
    let totalDias = 0;
    let totalFinal = 0;
    let todoBien = true;
    let hotelId = null;
    if (habitaciones) {
        hotelId = await Habitacion.findById(habitaciones[0]);
        console.log('HOTEL',hotelId)
        let valorRepetido;
        for (let i = 0; i < habitaciones.length; i++) {
            for (let j = i + 1; j < habitaciones.length; j++) {
                if (habitaciones[i] === habitaciones[j]) {
                    valorRepetido = habitaciones[i];
                    break;
                }
            }
        }
        if (valorRepetido) {
            res.status(400).json(`La habitacion con el id ${valorRepetido} esta repetida`)
            todoBien = false;
        } else {
            for (let i = 0; i < habitaciones.length; i++) {
                const compruebaCapacidad = await Habitacion.findById(habitaciones[i]);
                if (compruebaCapacidad) {
                    if (compruebaCapacidad.capacidad < cantidadPersonas) {
                        res.status(404).json({
                            msg: `La capacidad de la habitacion es de ${compruebaCapacidad.capacidad}`
                        })
                    }
                } else {
                    res.status(404).json({
                        msg: `No existe la habitacion ingresada`
                    })
                    todoBien = false;
                }

            }
            for (let h = 0; h < habitaciones.length; h++) {
                totalDias =+ diasFechas
                const habitacionPrecio = await Habitacion.findById(habitaciones[h])
                if (habitacionPrecio != null) {
                    if (habitacionPrecio.disponibilidad === true) {
                        totalH = + habitacionPrecio.costo * totalDias

                        todoBien = true;
                    } else {
                        res.status(404).json({
                            msg: `La habitacion no esta disponible`
                        })
                        todoBien = false;
                    }
                }
                if (eventos != null) {
                    if (eventos) {
                        let valorRepetido;
                        for (let i = 0; i < eventos.length; i++) {
                            for (let j = i + 1; j < eventos.length; j++) {
                                if (eventos[i] === eventos[j]) {
                                    valorRepetido = eventos[i];
                                    break;
                                }
                            }
                        }
                        if (valorRepetido) {
                            res.status(400).json(`El evento con el id ${valorRepetido} esta repetido`)
                            todoBien = false;
                        } else {
                            for (let e = 0; e < eventos.length; e++) {
                                const eventoPrecio = await Evento.findById(eventos[e])
                                totalE = + eventoPrecio.precio * cantidadPersonas
                            }
                        }
                    }
                }

                if (servicios != null) {
                    if (servicios) {
                        let valorRepetidoS;
                        for (let i = 0; i < servicios.length; i++) {
                            for (let j = i + 1; j < servicios.length; j++) {
                                if (servicios[i] === servicios[j]) {
                                    valorRepetidoS = servicios[i];
                                    break;
                                }
                            }
                        }
                        if (valorRepetidoS) {
                            res.status(400).json(`El servicio con el id: ${valorRepetidoS} esta repetido`)
                            todoBien = false;
                        } else {
                            for (let s = 0; s < servicios.length; s++) {
                                const servicioPrecio = await Servicio.findById(servicios[s])
                                totalS = + servicioPrecio.precio
                            } 
                        } 
                    }
                    totalFinal = totalH + totalE + totalS
                }
            }
        }
    } else {
        res.status(400).json({
            msg: 'Se necesita tener un dato en habitaciones'
        })
        todoBien = false;
    }
    // ID DEL HOTEL
    

    if (todoBien === true) {
        const reservacionActualizada = await Reservacion.findByIdAndUpdate(id, {
            cantidadPersonas: cantidadPersonas,
            personaReserva: personaReserva.toUpperCase(),
            habitaciones: habitaciones,
            eventos: eventos,
            total: totalFinal,
            servicios: servicios,
            fechaFinal: fechaFinal,
            fechaInicio: fechaInicio,
            dias_habitaciones: diasFechas,
            hotel: hotelId.hotel
        })

        res.status(201).json({
            msg: 'Editar reservacion',
            reservacionActualizada
        })
    } else {

    }
}

const putMiReservacion = async (req = request, res = response) => {
    const id = req.usuario.id;
    const { habitaciones, servicios, eventos, fechaInicio, fechaFinal, cantidadPersonas, personaReserva, ...body } = req.body;
    const fechaInicio2 = new Date(req.body.fechaInicio);
    const fechaFinal2 = new Date(req.body.fechaFinal);
    const hotelId = await Hotel.findOne({ habitaciones: { $in: [habitaciones] } });
    const diferenciaFechas = fechaInicio2 - fechaFinal2;
    let diasFechas = Math.floor(diferenciaFechas / (1000 * 60 * 60 * 24));
    if (diasFechas < 0) {
        diasFechas = diasFechas * -1
    }
    console.log('DIAS ', diasFechas)
    let totalH = 0;
    let totalE = 0;
    let totalS = 0;
    let totalDias = 0;
    let totalFinal = 0;
    let todoBien = true;
    if (habitaciones) {
        const hotelId = await Habitacion.findById(habitaciones[0]);
        console.log('HOTEL',hotelId)
        let valorRepetido;
        for (let i = 0; i < habitaciones.length; i++) {
            for (let j = i + 1; j < habitaciones.length; j++) {
                if (habitaciones[i] === habitaciones[j]) {
                    valorRepetido = habitaciones[i];
                    break;
                }
            }
        }
        if (valorRepetido) {
            res.status(400).json(`La habitacion con el id ${valorRepetido} esta repetida`)
            todoBien = false;
        } else {
            for (let i = 0; i < habitaciones.length; i++) {
                const compruebaCapacidad = await Habitacion.findById(habitaciones[i]);
                if (compruebaCapacidad) {
                    if (compruebaCapacidad.capacidad < cantidadPersonas) {
                        res.status(404).json({
                            msg: `La capacidad de la habitacion es de ${compruebaCapacidad.capacidad}`
                        })
                    }
                } else {
                    res.status(404).json({
                        msg: `No existe la habitacion ingresada`
                    })
                    todoBien = false;
                }

            }
            for (let h = 0; h < habitaciones.length; h++) {
                totalDias = diasFechas
                const habitacionPrecio = await Habitacion.findById(habitaciones[h])
                if (habitacionPrecio != null) {
                    if (habitacionPrecio.disponibilidad === true) {
                        totalH = + habitacionPrecio.costo * totalDias

                        todoBien = true;
                    } else {
                        res.status(404).json({
                            msg: `La habitacion no esta disponible`
                        })
                        todoBien = false;
                    }
                }
                if (eventos != null) {
                    if (eventos) {
                        let valorRepetido;
                        for (let i = 0; i < eventos.length; i++) {
                            for (let j = i + 1; j < eventos.length; j++) {
                                if (eventos[i] === eventos[j]) {
                                    valorRepetido = eventos[i];
                                    break;
                                }
                            }

                        }
                        if (valorRepetido) {
                            res.status(400).json(`El evento con el id ${valorRepetido} esta repetido`)
                            todoBien = false;
                        } else {
                            for (let e = 0; e < eventos.length; e++) {
                                const eventoPrecio = await Evento.findById(eventos[e])
                                totalE = + eventoPrecio.precio * cantidadPersonas

                            }
                        }
                    }
                }

                if (servicios != null) {
                    if (servicios) {
                        let valorRepetidoS;
                        for (let i = 0; i < servicios.length; i++) {
                            for (let j = i + 1; j < servicios.length; j++) {
                                if (servicios[i] === servicios[j]) {
                                    valorRepetidoS = servicios[i];
                                    break;
                                }
                            }
                        }
                        if (valorRepetidoS) {
                            res.status(400).json(`El servicio con el id: ${valorRepetidoS} esta repetido`)
                            todoBien = false;
                        } else {
                            for (let s = 0; s < servicios.length; s++) {
                                const servicioPrecio = await Servicio.findById(servicios[s])
                                totalS = + servicioPrecio.precio
                            }
                        }

                        }
                    totalFinal = totalH + totalE + totalS
                }
            }
        }
    } else {
        res.status(400).json({
            msg: 'Se necesita tener un dato en habitaciones'
        })
        todoBien = false;
    }

    const idReserva = await Reservacion.findOne({ usuario: id })

    if (todoBien) {
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
                dias_habitaciones: diasFechas,
                hotel: hotelId.hotel
            })

            res.status(201).json({
                msg: 'Editar reservacion',
                reservacionActualizada
            })
        } else {
            res.status(400).json({ msg: 'El usuario no tiene reservaciones' })
        }
    }
}

const deleteReservacion = async (req = request, res = response) => {
    const { id } = req.params;
    const reservacionCancelada = await Reservacion.findByIdAndDelete(id, { new: true });
    res.status(201).json({
        msg: 'Eliminar reservacion',
        reservacionCancelada
    })
}


const deleteMiReservacion = async (req = request, res = response) => {
    const id = req.usuario.id;
    const reservacionCancelada = await Reservacion.findOne({ usuario: id });
    if (reservacionCancelada != null) {
        const eliminarReservacion = await Reservacion.findByIdAndDelete(reservacionCancelada._id)
        res.status(201).json({
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
    agregarHabitacion,
    putReservacion,
    deleteReservacion,
    deleteMiReservacion,
    getReservacionesPorNombre,
    putMiReservacion,
    agregarServicio,
    agregarEvento,
    getMiReservacion
}