const path = require('path');
const url = require('url');
const webpack = require('webpack');
// const fs = require('fs-extra');
// const CleanPlugin = require('clean-webpack-plugin');
// const AssetsPlugin = require('assets-webpack-plugin');
// const shelljs = require('shelljs');

const pkg = require('./package.json');

// var dir = path.parse(__filename).dir;

// dir = dir.split(/\\/).pop();



;(function(){

  // return;

  const ENV = process.env.npm_lifecycle_event;

  //webpack --config webpack.deploy.js


  var config = {
  
    entry : { main1 : './example/src/main1.js'}

    ,output: {
      //console.log(path.join(__dirname,'/dist/scripts'));
      path: __dirname+'/example/dist/'
    
      ,publicPath :'example/dist/'

      //相对path
      ,chunkFilename:ENV!=='pro'?'scripts/chunk/[name]-[id].js':'scripts/chunk/[name]-[id].js'
      ,filename: ENV!=='pro'? 'scripts/[name].js':'scripts/[name].js'

    }
    
    ,plugins:[]

    ,filename:ENV!=='pro'? 'scripts/[name].js':'scripts/[name].js'
    ,chunkFilename:ENV!=='pro'?'scripts/chunk/[name]-[id].js':'scripts/chunk/[name]-[id].js'


  }

  if(ENV!='example'){
    Object.assign(config.output,{
      path : __dirname+'/dist/'
      ,publicPath : 'dist/'
      ,library: 'EmojiOvO'
      ,libraryTarget: 'umd'
    });
    config.entry = {main1 : './src/main1.js'}
  }




  config.plugins.push(
    new webpack.DefinePlugin({
    // __DEV__: JSON.stringify(process.env.npm_lifecycle_event),
      'process.env.NODE_ENV': JSON.stringify(ENV==='pro'?'production':'development')
    })

  );

    
  module.exports = {
    // entry: config.entry
    entry: config.entry
    ,devtool: ENV==='pro'?'source-map':'eval-source-map'
    
    ,output : config.output

    ,resolve: {

      extensions: ['.js', '.jsx', '.css','.png','.jpg','.less', '.gif','.webp']     
      ,alias: {
      }
    }
    ,module: {
      
      rules: [
        {
          test: /\.(css|less)$/,
          use: [
            //  'style-loader',
            //  'css-loader',
            //  //'postcss-loader',
            //  'less-loader'

            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: ()=>[require('autoprefixer')]
              }},   
            'less-loader'
          ]
        },
      
    
        {
          test: /\.(png|jpg|jpeg|gif|webp)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                publicPath:''
              ,name :'img/[name].[ext]?[hash:6]'

              }
            }
          ]
          },
        
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            //presets: ['es2015','react']
            //babel-preset-env
            //babel-preset-stage-0
            presets: ['env']
            // plugins: [
            //     'transform-es3-property-literals',
            //     'transform-es3-member-expression-literals'
            // ]
          }
        },
  
        {
          test: /\.(mp3|aac|ogg|mp4|wav)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name:'media/[name].[ext]?[hash:6]'
                
              }  
            }
          ]
        },
        {
          test: /\.(ttf|otf|svg)$/,
          use : [
            {
              loader:'file-loader',
              options: {
                name:'font/[name].[ext]?[hash:6]'
              }
            }

          ]
        }
        
      ]
    }

    ,externals: {
        
    }
    ,plugins:config.plugins
    ,stats: {
      // Nice colored output
      colors: true
    }
    ,devServer: {
    //  hot: true
    // ,inline: true
      contentBase: path.join(__dirname)
    }
  }

})();
