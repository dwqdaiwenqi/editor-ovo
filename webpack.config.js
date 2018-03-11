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
    publicPath : 'dist/'
    ,path : __dirname+'/dist/'
    //,hmr : 0
    ,hmr :1
    
    ,plugins:[]

    ,filename:ENV!=='pro'? 'scripts/[name].js':'scripts/[name].js'
    ,chunkFilename:ENV!=='pro'?'scripts/chunk/[name]-[id].js':'scripts/chunk/[name]-[id].js'


  }


  config.plugins.push(function(){
    

    this.plugin('done',function(stats){


    })
  });



  {
    var WebpPlugin = function(){
      this.startTime = Date.now();
      this.prevTimestamps = {};
      this.chunkVersions = {};
    }

    WebpPlugin.prototype.apply = function(compiler) {
      compiler.plugin('emit', function(compilation, callback) {
        //console.log('emit......')
        var changedChunks = compilation.chunks.filter(function(chunk) {
          var oldVersion = this.chunkVersions[chunk.name];
          this.chunkVersions[chunk.name] = chunk.hash;
          return chunk.hash !== oldVersion;
        }.bind(this));
        console.log('changedChunks length %s',changedChunks.length);
        if(changedChunks.length>0){
      
          shelljs.exec('gulp webp',err=>{
          
            if(err) console.error(err);
          })
        }
        callback();
      }.bind(this));

    }
  }

  config.plugins.push(
  // new WebpPlugin()
  //,new webpack.NamedModulesPlugin()
  //new webpack.NoErrorsPlugin()
 // ,new webpack.BannerPlugin(`@author  ${pkg.name}<${pkg.email}>\r\n@lastest ${new Date}}`)

  
    new webpack.DefinePlugin({
    // __DEV__: JSON.stringify(process.env.npm_lifecycle_event),
      'process.env.NODE_ENV': JSON.stringify(ENV==='pro'?'production':'development')
    })

  );

  //相对path 单独生成css 
  //////
  //config.plugins.push(new ExtractTextPlugin("css/[name].[contenthash:6].css"));

  ///

    
  module.exports = {
    // entry: config.entry
    entry:{
      main1:'./src/main1.js'
      //,vendor: ['miku-tween']
      //,vendor: ['miku-css-normalize','miku-tween']
    }
    ,devtool: ENV==='pro'?'source-map':'eval-source-map'
    ,output: {
      //console.log(path.join(__dirname,'/dist/scripts'));
      path: config.path
    
      ,publicPath : config.publicPath

      //相对path
      ,chunkFilename:config.chunkFilename
      ,filename: config.filename
      ,library:  'EmojiOvO'
      ,libraryTarget: 'umd'
    }

    ,resolve: {

      extensions: ['.js', '.jsx', '.css','.png','.jpg','.less', '.gif','.webp']     
      ,alias: {
        //相对src中"某个目录"引入文件 而且一定得加上“./” ？
        //jq:'.3.1.1@jquery/dist/jquery.js'
        // Xpages:'./Xpages/Xpages'
        // ,MainLong:'./MainLong/MainLong'
        // 
        // XButton:'/src/Common/XButton/XButton'
      
    
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





// const webpack = require('webpack'); // 用于访问内置插件
// const path = require('path');
// // const CleanPlugin = require('clean-webpack-plugin');
// const AssetsPlugin = require('assets-webpack-plugin');

// const config = {
//   entry: './src/scripts/main1.js',
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: 'my-first-webpack.bundle.js',
//     publicPath: "dist/"
//   },
//   module: {
//    rules:[
//      { test: /\.(png|jpe?g|gif|svg)$/,use: 'file-loader?limit=8192&name=img/[name].[ext]'}
//    ]
//   },
//   plugins: [
    
//   ]
// };

// module.exports = config;