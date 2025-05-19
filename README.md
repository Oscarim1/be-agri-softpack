# 🧾 Sistema Agrícola - Backend

Este es el backend de la plataforma de gestión agrícola, desarrollado en **Node.js + Express**, que permite administrar:

* Trabajadores y cuadrillas
* Empresas y contratistas
* Contratos y liquidaciones
* Registros de asistencia y procesos con pulsera NFC

## 🚀 Tecnologías

* Node.js
* Express.js
* MySQL
* JWT para autenticación
* Swagger para documentación
* Puppeteer para generación de PDFs

---

## 📁 Estructura principal

```
├── src
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middlewares/
│   ├── config/
│   └── index.js
├── package.json
├── .env
├── swagger.json (generado automáticamente)
```

---

## ⚙️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Oscarim1/be-agri-softpack
cd backend-agricola

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env
# Edita .env con tus credenciales de base de datos y JWT_SECRET
```

### 🔑 Archivo `.env` de ejemplo

```
DB_HOST=mysql://usuario:password@localhost:3306/nombre_db
DB_USER=user
DB_PASSWORD=pass
DB_NAME=nombre db
JWT_SECRET=secreto_super_seguro
```

---

## ▶️ Ejecución

```bash
# En desarrollo
npm run dev

# En producción
npm start
```

---

## 📚 Documentación Swagger

Una vez el servidor esté corriendo, accede a:

📄 [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

Aquí puedes explorar y probar todos los endpoints.

---

## 📄 Funcionalidades principales

* Autenticación con JWT
* Asignación de contratos y pulseras a trabajadores
* Registros de asistencia y procesos diarios
* Generación de reportes en PDF
* Panel Swagger interactivo para pruebas

---

## ✅ Testing

*(Próximamente: integración con Jest y pruebas de endpoints)*

---

## 👨‍💻 Autor

Desarrollado por **Oscar Reyes** como parte del proyecto de sistema agrícola realizado por **Softpack.cl**.

---

## 🛡️ Licencia

Este proyecto se entrega bajo licencia MIT.
