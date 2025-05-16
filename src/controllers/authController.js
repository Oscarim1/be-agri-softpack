import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE correo = ? LIMIT 1',
      [correo]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    await pool.query('UPDATE usuarios SET token_sesion = ?, expira_token = NOW() + INTERVAL 8 HOUR WHERE id = ?', [token, user.id]);

    res.json({ token, usuario: { id: user.id, nombre: user.nombre, rol: user.rol } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const register = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;

  if (!nombre || !correo || !password || !rol)
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });

  try {
    const [existe] = await pool.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (existe.length > 0)
      return res.status(409).json({ message: 'El correo ya está registrado' });

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(`
      INSERT INTO usuarios (nombre, correo, password_hash, rol, creado_en, actualizado_en)
      VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [nombre, correo, passwordHash, rol]
    );

    const userId = result.insertId;

    const token = jwt.sign({ id: userId, rol }, process.env.JWT_SECRET, { expiresIn: '8h' });

    await pool.query(`
      UPDATE usuarios SET token_sesion = ?, expira_token = NOW() + INTERVAL 8 HOUR WHERE id = ?`,
      [token, userId]
    );

    res.status(201).json({
      token,
      usuario: {
        id: userId,
        nombre,
        correo,
        rol
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

