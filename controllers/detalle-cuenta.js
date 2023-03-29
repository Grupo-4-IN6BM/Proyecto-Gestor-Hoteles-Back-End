const { response, request } = require("express");
const Servicio = require('../models/servicio');
const Detalle_cuenta = require('../models/detalle-cuenta')
const Eventos = require('../models/evento')

const getDetalle_cuenta = async (req = request, res = response) => {
  //condiciones del get
  const query = { estado: true };

  const listadetalle_cuenta = await Promise.all([
    Detalle_cuenta.countDocuments(query),
    Detalle_cuenta.find(query).populate("usuario", "nombre").populate('eventos')
  ]);

  res.json({
    msg: "get Api - Controlador Detalle_cuenta",
    listaCarritos: listadetalle_cuenta,
  });
};


const postDetalle_cuenta = async (req = request, res = response) => {
  const { eventos } = req.body;
  let cantidad = 1;
  let total = 0;
  let totalFinal = 0;



  for (let i = 0; i < eventos.length ; i++) {

    // const listaServicios = servicios[i];
    const listaEventos = eventos[i];
    // const queryServicios = await Servicio.findById(listaServicios);
    const queryEventos = await Eventos.findById(listaEventos);
    // const precioServicios = queryServicios.precio;
    const precioEventos = queryEventos.precio
    total = precioEventos;
    totalFinal = total + totalFinal;
  }

  const data = {
    usuario: req.usuario._id,
    total: totalFinal,
  };

  const cuentas = new Detalle_cuenta(data);
  cuentas.eventos.push(...req.body.eventos);

  await cuentas.save();
  res.status(201).json(cuentas);
};



module.exports = {
  getDetalle_cuenta,
  postDetalle_cuenta
}