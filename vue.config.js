const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: '.htaccess', // Asegúrate de que este archivo está en la raíz
            to: '', // Copia a la raíz de dist
            noErrorOnMissing: true, // Evita errores si no se encuentra el archivo
            globOptions: {
              dot: true // Permite copiar archivos que comienzan con un punto
            }
          }
        ]
      })
    ]
  }
};