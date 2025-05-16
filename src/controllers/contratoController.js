import { pool } from '../config/db.js';
import { generarPDFContratos } from '../services/pdfService.js';

export const crearContrato = async (req, res) => {
  const { contratista_id, documento, fecha, documentacion } = req.body;

  if (!contratista_id || !documento || !fecha) {
    return res.status(400).json({ message: 'contratista_id, documento y fecha son obligatorios' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO contratos (contratista_id, documento, fecha, documentacion)
       VALUES (?, ?, ?, ?)`,
      [contratista_id, documento, fecha, documentacion || null]
    );

    res.status(201).json({ id: result.insertId, message: 'Contrato creado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear contrato' });
  }
};

export const listarContratos = async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, ct.razon_social AS contratista
      FROM contratos c
      JOIN contratistas ct ON c.contratista_id = ct.id
      ORDER BY c.fecha DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar contratos' });
  }
};

export const obtenerContrato = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(`SELECT * FROM contratos WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Contrato no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener contrato' });
  }
};

export const actualizarContrato = async (req, res) => {
  const { id } = req.params;
  const { contratista_id, documento, fecha, documentacion } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE contratos
       SET contratista_id = ?, documento = ?, fecha = ?, documentacion = ?
       WHERE id = ?`,
      [contratista_id, documento, fecha, documentacion || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Contrato no encontrado' });
    }

    res.json({ message: 'Contrato actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar contrato' });
  }
};

export const eliminarContrato = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(`DELETE FROM contratos WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Contrato no encontrado' });
    }

    res.json({ message: 'Contrato eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar contrato' });
  }
};

export const exportarContratosPDF = async (_req, res) => {
  try {
    const [contratos] = await pool.query(`
      SELECT c.*, ct.razon_social AS contratista
      FROM contratos c
      JOIN contratistas ct ON c.contratista_id = ct.id
      ORDER BY c.fecha DESC
    `);

    if (contratos.length === 0) {
      return res.status(404).json({ message: 'No hay contratos registrados' });
    }

    const pdfBuffer = await generarPDFContratos(contratos);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="contratos.pdf"',
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al generar PDF de contratos' });
  }
};
