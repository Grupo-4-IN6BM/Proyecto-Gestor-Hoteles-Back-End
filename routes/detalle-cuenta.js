<<<<<<< Updated upstream
=======
const { Router } = require("express");
const { check } = require("express-validator");
const { getDetalle_cuenta, postDetalle_cuenta } = require("../controllers/detalle-cuenta")

const { validarCampos } = require("../middlewares/validar-campos");
const {
    validarJWT
} = require("../middlewares/validar-jwt");
const { tieneRole } = require("../middlewares/validar-roles");

const router = Router();

router.get("/mostrar", getDetalle_cuenta);
router.post( "/agregarcuenta", [
        validarJWT,
        tieneRole("CLIENT_ROLE"),
        validarCampos
    ],
    postDetalle_cuenta
);

// router.put(
//   "/editar/:id",
//   [
//     validarJWT,
//     tieneRole("CLIENT_ROLE"),
//     check("carrito", "El nombre es obligatorio").not().isEmpty(),
//     check('id', 'No es un ID válido').isMongoId(),
//     check('id').custom( existeCarritoPorId ),
//     validarCampos,
//   ],
//   putCarrito
// );

// router.delete("/eliminarCarrito/:id", [
//     validarJWT,
//     tieneRole("CLIENT_ROLE"),
//     check('id', 'No es un ID válido').isMongoId(),
//     check('id').custom( existeCarritoPorId ),
//     validarCampos,
// ], deleteCarrito);

module.exports = router;
>>>>>>> Stashed changes
