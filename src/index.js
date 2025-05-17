import express from 'express';
import authRoutes from './routes/authRoutes.js';
import trabajadorRoutes from './routes/trabajadorRoutes.js';
import procesoRoutes from './routes/procesoRoutes.js';
import asistenciaRoutes from './routes/asistenciaRoutes.js';
import cuadrillaTrabajoRoutes from './routes/cuadrillaTrabajoRoutes.js';
import cuadrillaRoutes from './routes/cuadrillaRoutes.js';
import cuadrillaTrabajadorRoutes from './routes/cuadrillaTrabajadorRoutes.js';
import cuartelRoutes from './routes/cuartelRoutes.js';
import empresaRoutes from './routes/empresaRoutes.js';
import contratistaRoutes from './routes/contratistaRoutes.js';
import contratoRoutes from './routes/contratoRoutes.js';
import contratoTrabajadorRoutes from './routes/contratoTrabajadorRoutes.js';
import liquidacionRoutes from './routes/liquidacionRoutes.js';
import setupSwagger from './config/swagger.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

setupSwagger(app);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/trabajadores', trabajadorRoutes);
app.use('/api/procesos', procesoRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/cuadrilla-trabajo', cuadrillaTrabajoRoutes);
app.use('/api/cuadrillas', cuadrillaRoutes);
app.use('/api/cuadrilla-trabajador', cuadrillaTrabajadorRoutes);
app.use('/api/cuarteles', cuartelRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/contratistas', contratistaRoutes);
app.use('/api/contratos', contratoRoutes);
app.use('/api/contratos-trabajador', contratoTrabajadorRoutes);
app.use('/api/liquidaciones', liquidacionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
