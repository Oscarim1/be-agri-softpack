import { pool } from '../config/db.js';
import { generarPDFContratoTrabajador } from '../services/pdfService.js';

export const asignarContrato = async (req, res) => {
  const { contrato_id, trabajador_id, fecha_inicio, fecha_termino, estado } = req.body;

  if (!contrato_id || !trabajador_id || !fecha_inicio) {
    return res.status(400).json({ message: 'contrato_id, trabajador_id y fecha_inicio son obligatorios' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO contrato_trabajador (contrato_id, trabajador_id, fecha_inicio, fecha_termino, estado)
       VALUES (?, ?, ?, ?, ?)`,
      [contrato_id, trabajador_id, fecha_inicio, fecha_termino || null, estado || 'activo']
    );

    res.status(201).json({ id: result.insertId, message: 'Contrato asignado al trabajador correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al asignar contrato' });
  }
};

export const listarContratosTrabajador = async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ct.*, t.nombres AS trabajador, c.documento AS contrato
      FROM contrato_trabajador ct
      JOIN trabajadores t ON ct.trabajador_id = t.id
      JOIN contratos c ON ct.contrato_id = c.id
      ORDER BY ct.fecha_inicio DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar contratos de trabajadores' });
  }
};

export const obtenerAsignacionContrato = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(`SELECT * FROM contrato_trabajador WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Asignación no encontrada' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener asignación' });
  }
};

export const actualizarAsignacionContrato = async (req, res) => {
  const { id } = req.params;
  const { contrato_id, trabajador_id, fecha_inicio, fecha_termino, estado } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE contrato_trabajador
       SET contrato_id = ?, trabajador_id = ?, fecha_inicio = ?, fecha_termino = ?, estado = ?
       WHERE id = ?`,
      [contrato_id, trabajador_id, fecha_inicio, fecha_termino, estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Asignación no encontrada' });
    }

    res.json({ message: 'Asignación actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar asignación' });
  }
};

export const eliminarAsignacionContrato = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(`DELETE FROM contrato_trabajador WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Asignación no encontrada' });
    }

    res.json({ message: 'Asignación eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar asignación' });
  }
};

export const exportarContratoTrabajadorPDF = async (req, res) => {
  const { contrato_id, trabajador_id } = req.query;

  let query = `
    SELECT ct.*, t.nombres AS trabajador, c.documento AS contrato
    FROM contrato_trabajador ct
    JOIN trabajadores t ON ct.trabajador_id = t.id
    JOIN contratos c ON ct.contrato_id = c.id
    WHERE 1 = 1
  `;
  const params = [];

  if (contrato_id) {
    query += ` AND ct.contrato_id = ?`;
    params.push(contrato_id);
  }

  if (trabajador_id) {
    query += ` AND ct.trabajador_id = ?`;
    params.push(trabajador_id);
  }

  try {
    const [asignaciones] = await pool.query(query + ' ORDER BY ct.fecha_inicio DESC', params);

    if (asignaciones.length === 0) {
      return res.status(404).json({ message: 'No se encontraron asignaciones' });
    }

    const titulo = trabajador_id
      ? `Contratos asignados al trabajador ID ${trabajador_id}`
      : `Trabajadores asignados al contrato ID ${contrato_id}`;

    const pdfBuffer = await generarPDFContratoTrabajador(asignaciones, titulo);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="asignaciones_contrato_trabajador.pdf"',
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al generar PDF de asignaciones' });
  }
};

