import express from 'express';
import {
  crearEmpresa,
  listarEmpresas,
  obtenerEmpresa,
  actualizarEmpresa,
  eliminarEmpresa,
  exportarEmpresasPDF 
} from '../controllers/empresaController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { tieneRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.post('/', tieneRol('admin'), crearEmpresa);
router.get('/', listarEmpresas);
router.get('/:id', obtenerEmpresa);
router.put('/:id', tieneRol('admin'), actualizarEmpresa);
router.delete('/:id', tieneRol('admin'), eliminarEmpresa);
router.get('/exportar/pdf', exportarEmpresasPDF);

export default router;

// Swagger documentation for Empresa routes
/**
 * @swagger
 * tags:
 *   name: Empresas
 *   description: Gestión de empresas contratistas
 */

/**
 * @swagger
 * /empresas:
 *   post:
 *     summary: Crear una nueva empresa
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos de la empresa
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contrato
 *               - fecha_adjudicacion
 *             properties:
 *               contrato:
 *                 type: string
 *                 example: "Contrato ABC-123"
 *               fecha_adjudicacion:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-01"
 *               fecha_termino_faena:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-01"
 *               documentos:
 *                 type: string
 *                 example: "URL a carpeta Drive o nombre de archivo PDF"
 *     responses:
 *       201:
 *         description: Empresa creada correctamente
 *       400:
 *         description: Campos obligatorios faltantes
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /empresas:
 *   get:
 *     summary: Listar todas las empresas
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empresas
 *       500:
 *         description: Error al listar empresas
 */

/**
 * @swagger
 * /empresas/{id}:
 *   get:
 *     summary: Obtener una empresa por ID
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 4
 *     responses:
 *       200:
 *         description: Empresa encontrada
 *       404:
 *         description: Empresa no encontrada
 *       500:
 *         description: Error al obtener empresa
 */

/**
 * @swagger
 * /empresas/{id}:
 *   put:
 *     summary: Actualizar una empresa existente
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Nuevos datos de la empresa
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contrato:
 *                 type: string
 *                 example: "Contrato actualizado XYZ"
 *               fecha_adjudicacion:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-01"
 *               fecha_termino_faena:
 *                 type: string
 *                 format: date
 *                 example: "2025-10-01"
 *               documentos:
 *                 type: string
 *                 example: "drive/empresa-actualizada"
 *     responses:
 *       200:
 *         description: Empresa actualizada correctamente
 *       404:
 *         description: Empresa no encontrada
 *       500:
 *         description: Error al actualizar empresa
 */

/**
 * @swagger
 * /empresas/{id}:
 *   delete:
 *     summary: Eliminar una empresa por ID
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: Empresa eliminada correctamente
 *       404:
 *         description: Empresa no encontrada
 *       500:
 *         description: Error al eliminar empresa
 */

/**
 * @swagger
 * /empresas/exportar/pdf:
 *   get:
 *     summary: Exportar listado de empresas a PDF
 *     tags: [Empresas]
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
 *         description: No hay empresas registradas
 *       500:
 *         description: Error al generar PDF
 */
