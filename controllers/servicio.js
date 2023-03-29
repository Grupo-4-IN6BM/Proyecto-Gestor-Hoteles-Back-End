<<<<<<< Updated upstream
=======
const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const Servicio = require('../models/servicio');


const getServicio = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

    const listaServicios = await Promise.all([
        Servicio.countDocuments(query),
        Servicio.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador servicio',
        listaServicio
    });

}

const postServicio = async (req = request, res = response) => {

    //Desestructuración
    const { nombre, precio } = req.body;
    const servicioGuardadoDB = new Servicio({ nombre, precio,});

    //Guardar en BD
    await servicioGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Servicio',
        servicioGuardadoDB
    });

}


const putServicio = async (req = request, res = response) => {

    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;
    const { _id, ...resto } = req.body;

    //Editar al usuario por el id
    const servicioEditado = await Servicio.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT editar servicio',
        servicioEditado
    });

}

const deleteServicio = async(req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;

    //Eliminar fisicamente de la DB
    const servicioEliminado = await Servicio.findByIdAndDelete( id);

    //Eliminar cambiando el estado a false
   

    res.json({
        msg: 'DELETE eliminar servicio',
        servicioEliminado
    });
}

module.exports = {
    getServicio,
    postServicio,
    putServicio,
    deleteServicio
}
>>>>>>> Stashed changes
