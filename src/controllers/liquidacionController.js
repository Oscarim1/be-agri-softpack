import { pool } from '../config/db.js';
import { generarPDFLiquidacion, generarLiquidacionHTML } from '../services/pdfService.js';
import puppeteer from 'puppeteer';

export const crearLiquidacion = async (req, res) => {
  const {
    contrato_trabajador_id, fecha_liquidacion, dias_trabajados,
    sueldo_base, gratificacion, colacion, asignacion_gastos,
    cotizacion_prevision, cotizacion_salud, seguro_cesantia, impuesto_unico,
    otros_descuentos, afp_nombre, salud_nombre,
    total_haberes, total_descuentos, liquido_final
  } = req.body;

  if (!contrato_trabajador_id || !fecha_liquidacion) {
    return res.status(400).json({ message: 'contrato_trabajador_id y fecha_liquidacion son obligatorios' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO liquidaciones (
        contrato_trabajador_id, fecha_liquidacion, dias_trabajados,
        sueldo_base, gratificacion, colacion, asignacion_gastos,
        cotizacion_prevision, cotizacion_salud, seguro_cesantia, impuesto_unico,
        otros_descuentos, afp_nombre, salud_nombre,
        total_haberes, total_descuentos, liquido_final
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        contrato_trabajador_id, fecha_liquidacion, dias_trabajados,
        sueldo_base, gratificacion, colacion, asignacion_gastos,
        cotizacion_prevision, cotizacion_salud, seguro_cesantia, impuesto_unico,
        otros_descuentos, afp_nombre, salud_nombre,
        total_haberes, total_descuentos, liquido_final
      ]
    );

    res.status(201).json({ id: result.insertId, message: 'Liquidación creada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear la liquidación' });
  }
};

export const listarLiquidaciones = async (_req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM liquidaciones ORDER BY fecha_liquidacion DESC`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar liquidaciones' });
  }
};

export const obtenerLiquidacion = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`SELECT * FROM liquidaciones WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Liquidación no encontrada' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener liquidación' });
  }
};

export const actualizarLiquidacion = async (req, res) => {
  const { id } = req.params;
  const {
    contrato_trabajador_id, fecha_liquidacion, dias_trabajados,
    sueldo_base, gratificacion, colacion, asignacion_gastos,
    cotizacion_prevision, cotizacion_salud, seguro_cesantia, impuesto_unico,
    otros_descuentos, afp_nombre, salud_nombre,
    total_haberes, total_descuentos, liquido_final
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE liquidaciones SET
        contrato_trabajador_id = ?, fecha_liquidacion = ?, dias_trabajados = ?,
        sueldo_base = ?, gratificacion = ?, colacion = ?, asignacion_gastos = ?,
        cotizacion_prevision = ?, cotizacion_salud = ?, seguro_cesantia = ?, impuesto_unico = ?,
        otros_descuentos = ?, afp_nombre = ?, salud_nombre = ?,
        total_haberes = ?, total_descuentos = ?, liquido_final = ?
      WHERE id = ?`,
      [
        contrato_trabajador_id, fecha_liquidacion, dias_trabajados,
        sueldo_base, gratificacion, colacion, asignacion_gastos,
        cotizacion_prevision, cotizacion_salud, seguro_cesantia, impuesto_unico,
        otros_descuentos, afp_nombre, salud_nombre,
        total_haberes, total_descuentos, liquido_final,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Liquidación no encontrada' });
    }

    res.json({ message: 'Liquidación actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar la liquidación' });
  }
};

export const eliminarLiquidacion = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(`DELETE FROM liquidaciones WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Liquidación no encontrada' });
    }
    res.json({ message: 'Liquidación eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar la liquidación' });
  }
};

export const exportarPDFLiquidacion = async (req, res) => {
  const { id } = req.params;

  try {
    const [liqRows] = await pool.query(`SELECT * FROM liquidaciones WHERE id = ?`, [id]);
    if (liqRows.length === 0) return res.status(404).json({ message: 'Liquidación no encontrada' });
    const liquidacion = liqRows[0];

    const [ct] = await pool.query(`
      SELECT ct.*, t.nombres AS trabajador_nombre, t.rut AS trabajador_rut, t.rol AS trabajador_rol,
             c.documento AS contrato_documento, c.fecha AS fecha_inicio,
             e.contrato AS empresa_contrato
      FROM contrato_trabajador ct
      JOIN trabajadores t ON ct.trabajador_id = t.id
      JOIN contratos c ON ct.contrato_id = c.id
      JOIN contratistas co ON c.contratista_id = co.id
      JOIN empresas e ON co.empresa_id = e.id
      WHERE ct.id = ?
    `, [liquidacion.contrato_trabajador_id]);

    if (ct.length === 0) return res.status(404).json({ message: 'No se encontró información del contrato del trabajador' });

    const datos = {
      ...liquidacion,
      trabajador_nombre: ct[0].trabajador_nombre,
      trabajador_rut: ct[0].trabajador_rut,
      trabajador_rol: ct[0].trabajador_rol,
      fecha_inicio: ct[0].fecha_inicio,
      fecha_termino: ct[0].fecha_termino || null,
      tipo_contrato: 'Indefinido',
      empresa_contrato: ct[0].empresa_contrato
    };

    const pdf = await generarPDFLiquidacion(datos);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="liquidacion_${id}.pdf"`,
      'Content-Length': pdf.length
    });

    res.send(pdf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al generar PDF de liquidación' });
  }
};

export const exportarLiquidacionesPorTrabajadorPDF = async (req, res) => {
  const { trabajador_id, desde, hasta } = req.query;

  if (!trabajador_id) {
    return res.status(400).json({ message: 'Debe enviar el parámetro trabajador_id' });
  }

  try {
    // 1. Consultar liquidaciones del trabajador directamente por contrato_trabajador
    let query = `
      SELECT l.*
      FROM liquidaciones l
      JOIN contrato_trabajador ct ON l.contrato_trabajador_id = ct.trabajador_id
      WHERE ct.trabajador_id = ?
    `;
    const params = [trabajador_id];

    if (desde && hasta) {
      query += ` AND l.fecha_liquidacion BETWEEN ? AND ?`;
      params.push(desde, hasta);
    }

    const [liquidaciones] = await pool.query(query, params);

    if (liquidaciones.length === 0) {
      return res.status(404).json({
        message: `No hay liquidaciones registradas para el trabajador ID ${trabajador_id} entre ${desde || 'inicio'} y ${hasta || 'hoy'}`
      });
    }

    // 2. Obtener datos generales del trabajador
    const [trabajador] = await pool.query(`SELECT * FROM trabajadores WHERE id = ?`, [trabajador_id]);

    // 3. Obtener nombre de la empresa (usando primer contrato_trabajador encontrado)
    const [empresa] = await pool.query(`
      SELECT e.contrato AS empresa_contrato
      FROM contrato_trabajador ct
      JOIN contratos c ON ct.contrato_id = c.id
      JOIN contratistas co ON c.contratista_id = co.id
      JOIN empresas e ON co.empresa_id = e.id
      WHERE ct.trabajador_id = ?
      LIMIT 1
    `, [trabajador_id]);

    // 4. Generar HTMLs de cada liquidación
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    const htmls = await Promise.all(liquidaciones.map(async (liq) => {
      const datos = {
        ...liq,
        empresa_contrato: empresa[0]?.empresa_contrato || 'Empresa',
        trabajador_nombre: trabajador[0]?.nombres,
        trabajador_rut: trabajador[0]?.rut || '',
        trabajador_rol: trabajador[0]?.rol || '',
        fecha_inicio: liq.fecha_liquidacion,
        fecha_termino: null,
        tipo_contrato: 'Indefinido'
      };
      const html = await generarLiquidacionHTML(datos);
      return html;
    }));

    await page.setContent(
      `<html><body>${htmls.join('<div style="page-break-after: always;"></div>')}</body></html>`,
      { waitUntil: 'networkidle0' }
    );

    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="liquidaciones_trabajador_${trabajador_id}.pdf"`,
      'Content-Length': pdf.length
    });

    res.send(pdf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al exportar las liquidaciones' });
  }
};


