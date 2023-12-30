const { request, response } = require('express');
const Reservacion = require('../models/reservacion');
const Usuario = require('../models/usuario');
const Habitacion = require('../models/habitacion');
const Servicio = require('../models/servicio');
const Evento = require('../models/evento');
const Hotel = require('../models/hotel');


const getReservaciones = async (req = request, res = response) => {
    const listaReservaciones = await Reservacion.find().populate('usuario', 'img nombre')
    .populate('habitaciones', 'img tipo numero costo descripcion')
    .populate('servicios', 'img nombre precio descripcion')
    .populate('eventos', 'img nombre precio descripcion');
    res.status(201).json(listaReservaciones);
}

const getReservaPorHotel = async (req = request, res = response) => {
    const { id } = req.params;
    try {
      const buscaHotel = await Hotel.findById(id);
      if (!buscaHotel) {
        return res.status(404).json({ mensaje: 'Hotel no encontrado' });
      }
      // Obtener los IDs de los usuarios del arreglo de clientes del hotel
      const usuariosIds = buscaHotel.clientes.map(cliente => cliente._id);
      // Buscar las reservaciones correspondientes a los usuarios encontrados
      const reservaciones = await Reservacion.find({ usuario: { $in: usuariosIds } });
      // Obtener la información completa de los usuarios de las reservaciones
      const reservacionesConUsuarios = await Promise.all(reservaciones.map(async reservacion => {
        const usuario = await Usuario.findById(reservacion.usuario);
        return {
          ...reservacion.toObject(),
          usuario: usuario.toObject()
        };
      }));
      res.status(200).json(reservacionesConUsuarios);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener las reservaciones' });
    }
  };


const getMiReservacion = async (req = request, res = response) => {
    const id = req.usuario.id;
    const reservacion = await Reservacion.findOne({ usuario: id }).populate('usuario', 'nombre')
        .populate('habitaciones', 'img tipo numero costo descripcion')
        .populate('servicios', 'img nombre precio descripcion')
        .populate('eventos', 'img nombre precio descripcion');
    res.status(201).json(reservacion);
}

const getReservacionesPorNombre = async (req = request, res = response) => {
    const { nombre } = req.params;
    const query = { personaReserva: nombre };

    const listaReservaciones = await Reservacion.find(query).populate('usuario', 'nombre')
            .populate('habitaciones', 'tipo numero costo descripcion')
            .populate('servicios', 'nombre precio descripcion')
            .populate('eventos', 'nombre precio descripcion')


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
    const { id } = req.params;
    const idReservacion = await Reservacion.findOne({ usuario: idUsuario })
    const agregaHabitacion = await Reservacion.findByIdAndUpdate(idReservacion._id, { $push: { habitaciones: [id] } })
    const cambioEstadoHabitacion = await Habitacion.findByIdAndUpdate(id, { disponibilidad: false })
    const buscaHotel = await Hotel.findOne({ habitaciones: id })
    const aumentaReservacion = await Hotel.findByIdAndUpdate(buscaHotel._id, { reservaciones: buscaHotel.reservaciones + 1 })
    const clienteAdd = await Hotel.findByIdAndUpdate(buscaHotel._id, { $push: { clientes: idUsuario } });
    clienteAdd.save();
    res.status(201).json(agregaHabitacion)
}

const agregarServicio = async (req, res) => {
    const idUsuario = req.usuario.id;
    const { id } = req.params;
    const idReservacion = await Reservacion.findOne({ usuario: idUsuario })
    const agregaServicio = await Reservacion.findByIdAndUpdate(idReservacion._id, { $push: { servicios: [id] } }, {new: true})
    let totalS = parseFloat(0);
    for (let i = 0; i < agregaServicio.servicios.length; i++) {
        const servicioPrecio = await Servicio.findById(agregaServicio.servicios[i])
        totalS = + servicioPrecio.precio 
    }

    const actualizarPrecio = await Reservacion.findByIdAndUpdate(idReservacion._id, { $inc: { total: parseFloat(totalS) } })

    res.status(201).json(actualizarPrecio)
}

const agregarEvento = async (req, res) => {
    const idUsuario = req.usuario.id;
    const { id } = req.params;
    const idReservacion = await Reservacion.findOne({ usuario: idUsuario })
    const agregarEvento = await Reservacion.findByIdAndUpdate(idReservacion._id, { $push: { eventos: [id] } }, {new: true})
    let totalE = 0;
    for (let i = 0; i < agregarEvento.eventos.length; i++) {
        const eventoPrecio = await Evento.findById(agregarEvento.eventos[i])
        totalE = + eventoPrecio.precio 
    }

    const actualizarPrecio = await Reservacion.findByIdAndUpdate(idReservacion._id, { $inc: { total: parseFloat(totalE) } })
    res.status(201).json(agregarEvento)
}

const deleteHabitacion = async (req = request, res = response) => {
    const idUsuario = req.usuario.id;
    let totalH = 0;
    const { id } = req.params;
    try {
      const habitacion = await Habitacion.findById(id);
      if (!habitacion) {
        return res.status(404).json({ mensaje: 'Habitación no encontrada' });
      }
      const idReserva = await Reservacion.findOne({ usuario: idUsuario });
      let dias = idReserva.dias_habitaciones;
      totalH = parseFloat(habitacion.costo) * parseFloat(dias);
      const eliminarRegistro = await Reservacion.findByIdAndUpdate(
        idReserva._id.toString(),
        { $pull: { habitaciones: id }, $inc: { total: -parseFloat(totalH) } },
        { new: true }
      );
      const cambioEstadoHabitacion = await Habitacion.findByIdAndUpdate(
        id,
        { disponibilidad: true },
        { new: true }
      );
      await cambioEstadoHabitacion.save();
      res.status(201).json(eliminarRegistro);
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
  };
  
  const deleteServicio = async (req, res) => {
    const idUsuario = req.usuario.id;
    let totalS = 0;
    const { id } = req.params;
    const servicio = await Servicio.findById(id);
    const idReserva = await Reservacion.findOne({ usuario: idUsuario });
    totalS = parseFloat(servicio.precio);
    const eliminarServicio = await Reservacion.findByIdAndUpdate(
      idReserva,
      { $pull: { servicios: id }, $inc: { total: -totalS } },
      { new: true }
    );
    const cambioEstadoServicio = await Servicio.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );
      await cambioEstadoServicio.save();
    res.status(201).json(eliminarServicio);
  };
  
  const deleteEvento = async (req, res) => {
    const idUsuario = req.usuario.id;
    let totalE = 0;
    const { id } = req.params;
    const evento = await Evento.findById(id);
    const idReserva = await Reservacion.findOne({ usuario: idUsuario });
    totalE = parseFloat(evento.precio);
    const eliminarServicio = await Reservacion.findByIdAndUpdate(
      idReserva,
      { $pull: { eventos: id }, $inc: { total: -totalE } },
      { new: true }
    );
    const cambioEstadoEvento = await Evento.findByIdAndUpdate(
        id,
        { disponibilidad: true },
        { new: true }
      );
      await cambioEstadoEvento.save();
    res.status(201).json(eliminarServicio);
    };


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
        await reservar.save();
        res.status(201).json(reservar);
    } else {
        console.log("Todo mal")
    }

}

const postReservacionUsuario = async (req = request, res = response) => {
    try {
    const id = req.usuario.id
    const reservacionEditada = req.body

    const fechaInicio2 = new Date(reservacionEditada.fechaInicio);
    const fechaFinal2 = new Date(reservacionEditada.fechaFinal);
    const diferenciaFechas = fechaFinal2 - fechaInicio2;
    let diasFechas = Math.floor(diferenciaFechas / (1000 * 60 * 60 * 24));
    if (diasFechas < 0) {
        diasFechas = diasFechas * -1
    }

    const reservaciones = await Reservacion.findOne({ usuario: id })
    let totalH = 0;
    let totalDias = 0;
    let totalFinal = 0;
    for (let i = 0; i < reservaciones.habitaciones.length; i++) {
        totalDias =+ diasFechas
        const habitacionPrecio = await Habitacion.findById(reservaciones.habitaciones[i])
        if (habitacionPrecio) {
        totalH =+ habitacionPrecio.costo * totalDias
        totalFinal =+ totalH
        }else{
           return
        }
    }
    const actualizaReservacion = await Reservacion.findByIdAndUpdate(reservaciones[0]._id, {
        fechaInicio: reservacionEditada.fechaInicio,
        fechaFinal: reservacionEditada.fechaFinal,
        dias_habitaciones: diasFechas,
        cantidadPersonas: reservacionEditada.cantidadPersonas,
        total: totalFinal
    },{new: true})
    res.status(201).json(actualizaReservacion)
} catch (error) {
    res.status(404).json(error);
}
}

const putReservacion = async (req = request, res = response) => {
    const id = req.params;
    const { habitaciones, servicios, eventos, fechaInicio, fechaFinal, cantidadPersonas, personaReserva, ...body } = req.body;
    const fechaInicio2 = new Date(req.body.fechaInicio);
    const fechaFinal2 = new Date(req.body.fechaFinal);
    const diferenciaFechas = fechaFinal2 - fechaInicio2;
    let diasFechas = Math.floor(diferenciaFechas / (1000 * 60 * 60 * 24));
    if (diasFechas < 0) {
        diasFechas = diasFechas * -1
    }
    let totalH = 0;
    let totalE = 0;
    let totalS = 0;
    let totalDias = 0;
    let totalFinal = 0;
    let todoBien = true;
    let hotelId = null;
    if (habitaciones) {
        hotelId = await Habitacion.findById(habitaciones[0]);
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
                totalDias = + diasFechas
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
    let totalH = 0;
    let totalE = 0;
    let totalS = 0;
    let totalDias = 0;
    let totalFinal = 0;
    let todoBien = true;
    if (habitaciones) {
        const hotelId = await Habitacion.findById(habitaciones[0]);
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
    const reservacionCancelada = await Reservacion.findOne({ usuario: id });
    if (reservacionCancelada != null) {
        const habitacionesIds = reservacionCancelada.habitaciones.map(habitacion => habitacion._id);
    
        await Habitacion.updateMany({ _id: { $in: habitacionesIds } }, { disponibilidad: true });
    
        const eliminarReservacion = await Reservacion.findByIdAndDelete(reservacionCancelada._id);
    
        res.status(201).json({
          msg: 'Reservación eliminada',
          eliminarReservacion
        });
      } else {
        res.status(400).json({ msg: 'La reservación no existe' });
      }
}


const deleteMiReservacion = async (req = request, res = response) => {
    const id = req.usuario.id;
    const reservacionCancelada = await Reservacion.findOne({ usuario: id });
  
    if (reservacionCancelada != null) {
      const habitacionesIds = reservacionCancelada.habitaciones.map(habitacion => habitacion._id);
  
      await Habitacion.updateMany({ _id: { $in: habitacionesIds } }, { disponibilidad: true });
  
      const eliminarReservacion = await Reservacion.findByIdAndDelete(reservacionCancelada._id);
  
      res.status(201).json({
        msg: 'Reservación eliminada',
        eliminarReservacion
      });
    } else {
      res.status(400).json({ msg: 'La reservación no existe' });
    }
  };
module.exports = {
    getReservaciones,
    getReservacionPorId,
    postReservacion,
    postReservacionUsuario,
    agregarHabitacion,
    putReservacion,
    deleteReservacion,
    deleteMiReservacion,
    getReservacionesPorNombre,
    putMiReservacion,
    agregarServicio,
    deleteHabitacion,
    agregarEvento,
    getMiReservacion,
    deleteEvento, 
    deleteServicio,
    getReservaPorHotel
}