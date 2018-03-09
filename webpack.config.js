const fs = require('fs-extra');
const path = require('path');
const url = require('url');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
var cheerio = require('cheerio');
const shelljs = require('shelljs');

const pkg = require('./package.json');

var dir = path.parse(__filename).dir;

dir = dir.split(/\\/).pop();

const local_url = pkg['local-url']+dir+'/dist/';

const request = require('request');


const ENV = process.env.npm_lifecycle_event;

// //webpack --config webpack.deploy.js

console.log('ENV:%s',ENV);


// //hmr的文件只存在与缓存中。再开个--watch本地文件才能和hmr同步
var config = {
  publicPath : 'dist/'
  ,path : __dirname+'/dist/'
  //,hmr : 0
  ,hmr :1
  //允许hmr static为空！
  //pkg['local-url']+'dist/'
  //pkg['dev-url']+'dist/'
  ,static_sc:local_url
   //,static_sc:''
   //,static_sc : 'http://static.xyimg.net/gamesite/mu/mufed/mu-17-05-02/dist/'
 // 
  //mikujs中的base 是网站的域名没有完整的（没有img路径）
  //并不是图片配置的完整url
  //这里是完整的图片url 这里还要加上img路径！
  //,static_sc : 'http://192.168.0.105:2333/16-winter/mu-16-12-26/dist/'
  //
  ,plugins:[]
  ,port:2333

  ,filename:ENV!=='pro'? 'scripts/[name].js':'scripts/[name].js'
  ,chunkFilename:ENV!=='pro'?'scripts/chunk/[name]-[id].js':'scripts/chunk/[name]-[id].js'


}


config.plugins.push(function(){
  
  // this.plugin('emit',function(compilation,callback){
  //   console.log('emit!!!')
  //   callback();

  // })
  this.plugin('done',function(stats){

    //热替换和hash后缀同时存在。
    //如清空之前的hash文件，将导致热替换不成功。
    //不能和hash后缀同时使用！
    try{
      if(fs.exists('src/common/img/_wxicon.jpg')){
        fs.copySync('src/common/img/_wxicon.jpg','dist/img/_wxicon.jpg');
      }


      fs.readdirSync('./').filter(s=>/\.html$/.test(s)).forEach(sss=>{

        fs.readFile(sss, 'utf-8', (err, data) => {

          const $ = cheerio.load(data, {
            decodeEntities: false
          });

          try{
            const json = fs.readJsonSync('./assets.json');
            const nodes = Object.keys(json).filter(s=>!(/metadata/.test(s)) ).map(s=>{
              var replacelist = [
                {tag:'script',name:s,attr:'src',val:json[s].js } 
                ,{tag:'css',name:s,attr:'href',val:json[s].css}
              ]
              replacelist.forEach(o=>{
                if(!o.val) return;     
                $(`${o.tag}[src*=${o.name}]`).attr(o.attr,o.val);
                //console.log(`${o.tag}[src*=${o.name}]`,o.attr,o.val);
              })
            })
          }catch(e){console.error(e);}
      
          
          request('http://'+pkg.local+'common/_publish.json', (error, response, body)=>{

            var obj = JSON.parse(body);

            {/*<script src="//192.168.84.91:7878/common/mu-mobile/mu-mobile-d43b4da7.js"></script>*/}
            
            const rg = (prefix,s)=> s.match(new RegExp(`\\/[\\w-]+\\/([\\w-]+?)(-\\w{6,8})?\\.${prefix}$`));

            $('script[src*=mu-mobile]').each((i,el)=>{
              var s = el.attribs.src;
              //js/mu-mobile-5485c64c.js
              //js/mu-mobile.js
              // //192.168.84.91:7878/common/mu-mobile/mu-mobile-1ddb274a.js
              // //static.xyimg.net/gamesite/mu/mufed/
              const ar = rg('js',s);


              $(el).attr('src' , 'http://'+(ENV==='pro'?pkg['pro-url']:pkg.local)+`common/${ar[1]}/${obj[ar[1]+'.js'].buildname}`);

              //console.log('//'+(ENV==='pro'?pkg['pro-url']:pkg.local)+`common/${ar[1]}/${obj[ar[1]+'.js'].buildname}`);
            });


            $('link[href*=mu-mobile]').each((i,el)=>{

              var s = el.attribs.href;
              const ar = rg('css',s);
             
              $(el).attr('href' , 'http://'+(ENV==='pro'?pkg['pro-url']:pkg.local)+`common/${ar[1]}/${obj[ar[1]+'.css'].buildname}`);

              //console.log('//'+(ENV==='pro'?pkg['pro-url']:pkg.local)+`common/${ar[1]}/${obj[ar[1]+'.css'].buildname}`);
              
            });

           
          });



          {
            const rg = /common\/(css|js)\/(.+)\.(js|css)$/;

            $('link[href*=normalize]').each(function(i,el){
              var s = el.attribs.href;
              const ar = s.match(rg);
              //console.log(`//${ENV==='dev'?pkg['dev-url']:pkg.local}common/${ar[1]}/${ar[2]}.${ar[3]}`);
              $(this).attr('href',`http://${ENV==='pro'?pkg['pro-url']:pkg.local}common/${ar[1]}/${ar[2]}.${ar[3]}`);

              //console.log(`//${ENV==='dev'?pkg['dev-url']:pkg.local}common/${ar[1]}/${ar[2]}.${ar[3]}`);
            });
           

            $('script[src*=jquery],script[src*=polyfill]').each(function(i,el){
              var s = el.attribs.src;

              if(!s) return;

              const ar = s.match(rg);
              if(!ar) return;
              //console.log(`//${ENV==='dev'?pkg['dev-url']:pkg.local}common/${ar[1]}/${ar[2]}.${ar[3]}`);
              $(this).attr('src',`http://${ENV==='pro'?pkg['pro-url']:pkg.local}common/${ar[1]}/${ar[2]}.${ar[3]}`);

            });
          }


          setTimeout(()=>{
            
            fs.writeFile(sss, $.html(), err => {
             //console.log('###');
            })
          },123);


        })
      })
    }catch(e){console.error(e);}
    
    

  })
});

// 启用热加载时 html中的‘／xx.js’引用服务器根目录，一定要改成绝对的"http://xxx.js"
if(ENV==='dev-hmr'){
  // config.plugins.push(new webpack.HotModuleReplacementPlugin());
  // Object.keys(config.entry).forEach((s)=>{
  //   config.entry[s].unshift('webpack/hot/dev-server');
  // });
  

} 

//每次重新启动webpack命令才会清空dist目录重新构建，就算用watch也没用！！
//启动了hmr，配置static_sc的话会情况目录导致错误！为了避免！

if(ENV==='pro'){
 

  config.filename='scripts/[name]-[chunkhash:6].js';
  //config.filename='scripts/[name].js';
  
  //config.plugins.push( new CleanPlugin(['dist/*/*.*']));
  config.plugins.push( new CleanPlugin(['dist/**/*']));
 
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));

  //////////////
  config.publicPath =  '//'+pkg['pro-url']+dir+'/dist/';
  ///////////////
  //config.publicPath =  'dist/';
  // console.log(`config.publicPath:${config.publicPath}`);

  
  console.log(2888);
}

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
 new WebpPlugin()
 //,new webpack.NamedModulesPlugin()
 //new webpack.NoErrorsPlugin()
 ,new webpack.BannerPlugin(`@author  ${pkg.name}<${pkg.email}>\r\n@lastest ${new Date}}`)

//  ,new webpack.optimize.CommonsChunkPlugin({
//     names: 'vendor' // 指定公共 bundle 的名字。
//     ,minChunks: Infinity
//     ,names: ['vendor','manifest'] // 指定公共 bundle 的名字。
//   })
 ,new AssetsPlugin({
  fullPath: true
  ,filename:'assets.json'
  ,metadata: {version: 1}
  ,processOutput: function (assets) {
    return JSON.stringify(assets);
  }
})
 // ,new HtmlWebpackPlugin({
 //    //相对根目录
 //    template:'index.ejs'
 //    //相对dist目录
 //    ,filename:'../index.html'
 //    ,hash:false 
 //    ,inject:'body'
 //    //,excludeChunks:['manifest']
 //    ,googleAnalytics: {
 //      trackingId: 'c0535183dd0a1fac13b1983d4c4bb6dd',
 //      pageViewOnLoad: true,
 //      ssss:'xxxxx'
 //    }
  
 //  })
  ,new webpack.DefinePlugin({
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
    
    //,'root':[__dirname+'modules_nodules']
    
    ,alias: {
       //相对src中"某个目录"引入文件 而且一定得加上“./” ？
      //jq:'.3.1.1@jquery/dist/jquery.js'
      // Xpages:'./Xpages/Xpages'
      // ,MainLong:'./MainLong/MainLong'
      // 
      // XButton:'/src/Common/XButton/XButton'
     
     XButton: '../Common/XButton/XButton'
   
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
       // {
       //  test:/\.(css|less)$/,
       //   use: ExtractTextPlugin.extract({
       //    fallback: 'style-loader',
       //    //resolve-url-loader may be chained before sass-loader if necessary
       //    use: ['css-loader', 'less-loader']
       //  })
       // },
  
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
       //  
       // {
       //  test: /\.(png|jpg|gif|webp)$/,
       //  对处理webp有问题
       //  image/webp
       //  use: [
       //    {
       //      loader: 'url-loader',
       //      options: {
       //        limit: 1024*8
       //        ,name :'img/[name]-[hash:6].[ext]'
       //      }
       //    }
       //  ]
       // },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          //presets: ['es2015','react']
          //babel-preset-env
          //babel-preset-stage-0
          presets: ['env', 'stage-3', 'react']
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
      },
      {
         test: /\.json$/ ,
         use:['json-loader']
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

///////////////////
