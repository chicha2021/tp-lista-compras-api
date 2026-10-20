const { createApp } = require('./app');

const PORT = Number(process.env.PORT) || 3000;

createApp().listen(PORT, '0.0.0.0', () => {
  console.log(`Lista de compras API escuchando en el puerto ${PORT}`);
});
