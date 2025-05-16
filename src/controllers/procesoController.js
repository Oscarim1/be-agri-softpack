import { pool } from '../config/db.js';

export const crearProceso = async (req, res) => {
  const { id_pulsera, cantidad_fruta, fecha } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO procesos (id_pulsera, cantidad_fruta, fecha)
       VALUES (?, ?, ?)`,
      [id_pulsera, cantidad_fruta, fecha]
    );

    res.status(201).json({ id: result.insertId, message: 'Proceso creado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear el proceso' });
  }
};

export const listarProcesos = async (_req, res) => {
  try {
    const [procesos] = await pool.query('SELECT * FROM procesos ORDER BY fecha DESC');
    res.json(procesos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener procesos' });
  }
};

export const obtenerProceso = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM procesos WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Proceso no encontrado' });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al buscar el proceso' });
  }
};

export const actualizarProceso = async (req, res) => {
  const { id } = req.params;
  const { id_pulsera, cantidad_fruta, fecha } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE procesos SET id_pulsera = ?, cantidad_fruta = ?, fecha = ? WHERE id = ?`,
      [id_pulsera, cantidad_fruta, fecha, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Proceso no encontrado' });

    res.json({ message: 'Proceso actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar proceso' });
  }
};

export const eliminarProceso = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM procesos WHERE id = ?', [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Proceso no encontrado' });

    res.json({ message: 'Proceso eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar proceso' });
  }
};

export const registrarDesdePulsera = async (req, res) => {
  const { pulsera_uuid, cantidad_fruta } = req.body;

  if (!pulsera_uuid || !cantidad_fruta) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT t.id AS trabajador_id, t.nombres, p.estado
       FROM trabajadores t
       JOIN pulseras p ON t.pulsera_uuid = p.uuid
       WHERE p.uuid = ?`,
      [pulsera_uuid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Pulsera no asociada a trabajador' });
    }

    const trabajador = rows[0];

    if (trabajador.estado !== 'activa') {
      return res.status(403).json({ message: 'Pulsera inactiva. Registro no permitido.' });
    }

    await pool.query(
      `INSERT INTO procesos (id_pulsera, cantidad_fruta, fecha)
       VALUES (?, ?, NOW())`,
      [pulsera_uuid, cantidad_fruta]
    );

    res.status(201).json({ message: `Proceso registrado para ${trabajador.nombres}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar proceso desde pulsera' });
  }
};

export const resumenDiarioPorPulsera = async (req, res) => {
  const { pulsera_uuid } = req.params;
  const { fecha } = req.query;

  if (!fecha) {
    return res.status(400).json({ message: 'La fecha es requerida (formato YYYY-MM-DD)' });
  }

  try {
    // Buscar trabajador asociado a esa pulsera
    const [trabajadorRows] = await pool.query(
      `SELECT id, nombres, rol, contacto, direccion
       FROM trabajadores
       WHERE pulsera_uuid = ?`,
      [pulsera_uuid]
    );

    if (trabajadorRows.length === 0) {
      return res.status(404).json({ message: 'No hay trabajador asociado a esa pulsera' });
    }

    const trabajador = trabajadorRows[0];

    // Obtener resumen de procesos en esa fecha
    const [resumenRows] = await pool.query(
      `SELECT COUNT(*) AS procesos_realizados,
              SUM(cantidad_fruta) AS total_fruta
       FROM procesos
       WHERE pulsera_uuid = ?
         AND DATE(fecha) = ?`,
      [pulsera_uuid, fecha]
    );

    const resumen = resumenRows[0];

    res.json({
      fecha,
      trabajador: {
        nombres: trabajador.nombres,
        rol: trabajador.rol,
        pulsera_uuid
      },
      resumen: {
        procesos_realizados: resumen.procesos_realizados || 0,
        total_fruta: resumen.total_fruta || 0
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al generar resumen' });
  }
};

