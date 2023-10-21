const express = require('express');
const passport = require('passport');
const Usuario = require('../models/usuario');
const reservacion = require('../models/reservacion');
const { generarJWT } = require('../helpers/generar-jwt');

const postUsuarioGoogle = async (req = express.request, res = express.response) => {
  const body = req.body;
  
  const validUser = await Usuario.findOne({correo: body.correo})

  if(validUser){
    const token = await generarJWT(validUser._id, validUser.rol)
    res.json({validUser, token})
  }else{
  let newUser = new Usuario({
    nombre: body.nombre,
    correo: body.correo,
    rol: "ROL_CLIENTE",
    img: body.img
  });
  const token = await generarJWT(newUser._id, newUser.rol)
  const reservacionAuto = new reservacion({ usuario: newUser._id })
  await reservacionAuto.save();
  await newUser.save();
  res.json({newUser, token})
}
}

module.exports = {
  postUsuarioGoogle
}