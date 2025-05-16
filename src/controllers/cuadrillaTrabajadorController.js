import { pool } from '../config/db.js';

// ✅ Crear asignación
export const asignarTrabajadorCuadrilla = async (req, res) => {
  const { cuadrilla_id, pulsera_uuid, cantidad_fruta } = req.body;

  if (!cuadrilla_id || !pulsera_uuid) {
    return res.status(400).json({ message: 'cuadrilla_id y pulsera_uuid son obligatorios' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO cuadrilla_trabajador (cuadrilla_id, pulsera_uuid, cantidad_fruta)
       VALUES (?, ?, ?)`,
      [cuadrilla_id, pulsera_uuid, cantidad_fruta || 0]
    );

    res.status(201).json({ id: result.insertId, message: 'Trabajador asignado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al asignar trabajador' });
  }
};

// ✅ Listar todas las asignaciones
export const listarAsignaciones = async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ct.*, t.nombres AS trabajador_nombre, c.nombre AS cuadrilla_nombre
      FROM cuadrilla_trabajador ct
      JOIN trabajadores t ON t.pulsera_uuid = ct.pulsera_uuid
      JOIN cuadrillas c ON ct.cuadrilla_id = c.id
      ORDER BY ct.id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar asignaciones' });
  }
};

// ✅ Obtener una asignación
export const obtenerAsignacion = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(`SELECT * FROM cuadrilla_trabajador WHERE id = ?`, [id]);

    if (rows.length === 0)
      return res.status(404).json({ message: 'Asignación no encontrada' });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener asignación' });
  }
};

// ✅ Actualizar asignación
export const actualizarAsignacion = async (req, res) => {
  const { id } = req.params;
  const { cuadrilla_id, pulsera_uuid, cantidad_fruta } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE cuadrilla_trabajador
       SET cuadrilla_id = ?, pulsera_uuid = ?, cantidad_fruta = ?
       WHERE id = ?`,
      [cuadrilla_id, pulsera_uuid, cantidad_fruta || 0, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Asignación no encontrada' });

    res.json({ message: 'Asignación actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar asignación' });
  }
};

// ✅ Eliminar asignación
export const eliminarAsignacion = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(`DELETE FROM cuadrilla_trabajador WHERE id = ?`, [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Asignación no encontrada' });

    res.json({ message: 'Asignación eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar asignación' });
  }
};
