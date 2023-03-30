
const {response, request} = require('express');

const Habitacion = require('../models/habitacion');

const getHabitaciones = async (req = request, res = response) => {

    //condiciones del get
    const query = { disponibilidad: true };

    const listaHabitaciones = await Promise.all([
        Habitacion.countDocuments(query),
        Habitacion.find(query)
    ]);

    res.json({
        listaHabitaciones
    });

}
const postHabitacion = async (req = request, res = response) => {
    const { numero, disponibilidad, costo} = req.body;
    const habitacionGuardadaDB = new Habitacion({ numero, disponibilidad, costo });

    await habitacionGuardadaDB.save();

    res.json({
        habitacionGuardadaDB
    });

}

const putHabitacion = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body;

    const habitacionEditada = await Habitacion.findByIdAndUpdate(id, resto, {new: true});

    res.json({
        msg: 'PUT editar user',
        habitacionEditada
    });

}

const deleteHabitacion = async(req = request, res = response) => {
    const { id } = req.params;
  
    const habitacionEliminada = await Habitacion.findByIdAndDelete(id, {new: true});
    res.json({
        msg: 'DELETE eliminar user',
        habitacionEliminada
    });
}

const putAdmin = async (req = request, res = response) => {
    const idAdmin = req.usuario.id;
    const { _id, img, estado, google, ...resto } = req.body;

    if ( resto.password ) {
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    const usuarioEditado = await Usuario.findByIdAndUpdate(idAdmin, resto, {new: true});

    res.json({
        msg: 'PUT editar user',
        usuarioEditado
    });

}

const deleteAdmin = async(req = request, res = response) => {
    const idAdmin = req.usuario.id;
    const { id } = req.params;
    
    //Eliminar cambiando el estado a false
    const usuarioEliminado = await Usuario.findByIdAndUpdate(idAdmin, { estado: false });

    res.json({
        msg: 'DELETE eliminar user',
        usuarioEliminado
    });
}

module.exports = {
    getHabitaciones,
    postHabitacion,
    putHabitacion,
    deleteHabitacion
}
