import { pool } from '../config/db.js';

export const obtenerEstadoPulsera = async (req, res) => {
  const { pulsera_uuid } = req.params;
  if (!pulsera_uuid) {
    return res.status(400).json({ message: 'Debe proporcionar el UUID de la pulsera' });
  }
  try {
    const [rows] = await pool.query(  
      `SELECT estado FROM pulseras WHERE uuid = ?`,
      [pulsera_uuid]  
    );
    if (rows.length === 0) {    
      return res.status(404).json({ message: 'Pulsera no encontrada' });
    }
    if (rows[0].estado !== 'activa') {
      return res.status(403).json({ message: 'Pulsera inactiva.' });
    }
    const estado = rows[0].estado;
    return res.json({ pulsera_uuid, estado });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al obtener el estado de la pulsera' });
  }
};

export const actualizarEstadoPulsera = async (req, res) => {
  const { pulsera_uuid } = req.params;
  const { estado } = req.body;

  if (!pulsera_uuid || !estado) {
    return res.status(400).json({ message: 'UUID de pulsera y estado requeridos' });
  }
  if (!['activa', 'inactiva'].includes(estado)) {
    return res.status(400).json({ message: 'Estado inválido. Debe ser "activa" o "inactiva"' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE pulseras SET estado = ? WHERE uuid = ?`,
      [estado, pulsera_uuid]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pulsera no encontrada' });
    }

    return res.json({ message: 'Estado de la pulsera actualizado correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al actualizar el estado de la pulsera' });
  }
}
