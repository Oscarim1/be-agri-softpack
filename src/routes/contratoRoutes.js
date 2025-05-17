import express from 'express';
import {
  crearContrato,
  listarContratos,
  obtenerContrato,
  actualizarContrato,
  eliminarContrato,
  exportarContratosPDF
} from '../controllers/contratoController.js';

import { verificarToken } from '../middlewares/authMiddleware.js';
import { tieneRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.post('/', tieneRol('admin', 'supervisor'), crearContrato);
router.get('/', listarContratos);
router.get('/:id', obtenerContrato);
router.put('/:id', tieneRol('admin', 'supervisor'), actualizarContrato);
router.delete('/:id', tieneRol('admin'), eliminarContrato);
router.get('/exportar/pdf', exportarContratosPDF);

export default router;

// Swagger documentation for Contrato routes
/**
 * @swagger
 * tags:
 *   name: Contratos
 *   description: Endpoints para la gestión de contratos laborales
 */

/**
 * @swagger
 * /contratos:
 *   post:
 *     summary: Crear un nuevo contrato
 *     tags: [Contratos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contratista_id
 *               - documento
 *               - fecha
 *             properties:
 *               contratista_id:
 *                 type: integer
 *                 example: 1
 *               documento:
 *                 type: string
 *                 example: "Contrato-2025-001"
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-20"
 *               documentacion:
 *                 type: string
 *                 example: "URL o descripción de documentación adjunta"
 *     responses:
 *       201:
 *         description: Contrato creado correctamente
 *       400:
 *         description: Campos obligatorios faltantes
 *       500:
 *         description: Error al crear contrato
 */

/**
 * @swagger
 * /contratos:
 *   get:
 *     summary: Listar todos los contratos
 *     tags: [Contratos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contratos
 *       500:
 *         description: Error al listar contratos
 */

/**
 * @swagger
 * /contratos/{id}:
 *   get:
 *     summary: Obtener contrato por ID
 *     tags: [Contratos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: Detalles del contrato
 *       404:
 *         description: Contrato no encontrado
 *       500:
 *         description: Error al obtener contrato
 */

/**
 * @swagger
 * /contratos/{id}:
 *   put:
 *     summary: Actualizar contrato por ID
 *     tags: [Contratos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contratista_id:
 *                 type: integer
 *                 example: 2
 *               documento:
 *                 type: string
 *                 example: "Contrato-2025-002"
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-01"
 *               documentacion:
 *                 type: string
 *                 example: "Documento actualizado"
 *     responses:
 *       200:
 *         description: Contrato actualizado correctamente
 *       404:
 *         description: Contrato no encontrado
 *       500:
 *         description: Error al actualizar contrato
 */

/**
 * @swagger
 * /contratos/{id}:
 *   delete:
 *     summary: Eliminar contrato por ID
 *     tags: [Contratos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contrato eliminado correctamente
 *       404:
 *         description: Contrato no encontrado
 *       500:
 *         description: Error al eliminar contrato
 */

/**
 * @swagger
 * /contratos/exportar/pdf:
 *   get:
 *     summary: Exportar todos los contratos a PDF
 *     tags: [Contratos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No hay contratos registrados
 *       500:
 *         description: Error al generar PDF
 */
