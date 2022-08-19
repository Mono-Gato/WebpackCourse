const path = require('path');
//utiliza un require que ayuda a traer el elemento path, path ya esta dentro de node entonces no se necesita instalar una dependencia
// traemos el plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
//traemos el recurso
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//Traemos los recursos
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
//traemos el recurso clean
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

//creamos un modulo que va a tener las configuraciones deseadas
module.exports = {
    // Entry nos permite decir el punto de entrada de nuestra aplicación
    entry: './src/index.js',
    // Output nos permite decir hacia dónde va enviar lo que va a preparar webpacks
    output: {
        // path es donde estará la carpeta donde se guardará los archivos
        // Con path.resolve podemos decir dónde va estar la carpeta y la ubicación del mismo
        path: path.resolve(__dirname, 'dist'),
        // filename le pone el nombre al archivo final
        //cambiamos el contenido de filename para que traiga el nombre, el hash con el que se identifica esa build y la extension
	    filename: '[name].[contenthash].js',
        //agregamos el path en donde va a vivir estas imagenes y la estructura del nombre
		assetModuleFilename: 'assets/images/[hash][ext][query]'
    },
    resolve: {
        // establecemos el tipo de extensiones que tiene que identificar webpack para que pueda leer los archivos que estan dentro de nuestro proyecto
        extensions: [".js"],
        alias: {
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images/'),
          }
    },
    module: {
        rules: [
            {
                // Test declara que extensión de archivos aplicara el loader
                test: /\.m?js$/,
                // Exclude permite omitir archivos o carpetas especificas
                exclude: /node_modules/,
                // Use es un arreglo u objeto donde dices que loader aplicaras
                use: {
                    loader: "babel-loader"
                }
            },
             //creamos una nueva regla para poder reconocer el css
			{
                //declaramos la extension del archivo que va a reconocer el loader
                test: /\.css$/i,
                //se puede utilizar use con un objeto o un arreglo, le pasamos los loaders a utilizar
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
             },
             //creamos nueva regla para reconocer las imagenes
             {
                //declaramos las extensiones de los archivos a manejar
                test: /\.png/,
                type: 'asset/resource'
              },
               //creamos nueva regla para reconocer las fuentes
              {
                test: /\.(woff|woff2)$/i,  // Tipos de fuentes a incluir
                type: 'asset/resource',  // Tipo de módulo a usar (este mismo puede ser usado para archivos de imágenes)
                generator: {
                    filename: 'assets/fonts/[hash][ext][query]',  // Directorio de salida
                },
              },
        ]
    },
    //seccion de plugins
	plugins: [
		// configuracion del pluginm
		new HtmlWebpackPlugin({
			// incersion de los elementos
			inject:true,
			// ruta del template html
			template:'./public/index.html',
			//nombre del archivo output
			filename:'./index.html'
		}),
        // utilizamos el plugin
		//a nuestro extractor de css tambien le podemos pasar una configuracion para que el nombre del archivo lo arroje con el hash, aprovechamos para ponerlo dentro del path que queramos
		new MiniCssExtractPlugin({
			filename: 'styles/[name].[contenthash].css',
		}),
        //utilizamos el plugin para que limpie cada vez que vayamos a modo produccion
        new CleanWebpackPlugin(),
	],
    optimization: {
        minimize: true,
            //le decimos que para la minificacion utilice los dos plugins que agregamos, CssMinimizerPlugin() es para el Css y TerserPlugin() es para Js
        minimizer: [
            new CssMinimizerPlugin(), 
            new TerserPlugin()
        ],
      },
}