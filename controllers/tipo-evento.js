const {response, request} = require('express');

const Tipo = require('../models/tipo-evento');

const getTipos = async (req = request, res = response) => {

    const listaTipos = await Promise.all([
        Tipo.countDocuments(),
        Tipo.find()
    ]);

    res.json({
        listaTipos
    });

}
const postTipos = async (req = request, res = response) => {
    const { tipo } = req.body;
    const tipoGuardado = new Tipo({tipo});

    await tipoGuardado.save();

    res.json({
        tipoGuardado
    });

}

const putTipo = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body;

    const tipoEditado = await Tipo.findByIdAndUpdate(id, resto, {new: true});

    res.json({
        tipoEditado
    });

}

const deleteTipo = async(req = request, res = response) => {
    const { id } = req.params;
  
    const tipoEliminado = await Tipo.findByIdAndDelete(id, {new: true});
    res.json({
        tipoEliminado
    });
}

module.exports = {
    getTipos,
    postTipos,
    putTipo,
    deleteTipo
}