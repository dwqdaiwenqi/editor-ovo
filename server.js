var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var fs = require('fs');

var app = require('express')();

var http = require('http');
var request = require('request');
var colors = require('colors');
var cookieParser = require('cookie-parser');
app.use(require('cookie-parser')());


//nodemon --watch server.js server.js

// request('http://192.168.84.91:1234/api/aaa', function (error, response, body) {
// 	console.log(body);
//   //console.log(body);
// });
 
// //http://api/
// request.post({url:'http://192.168.84.91:1234/api/bbb', formData: {}}, function optionalCallback(err, httpResponse, body) {
//   if (err) {
//     return console.error('upload failed:', err);
//   }
//   console.log('Upload successful!  Server responded with:', body);
// });


app.use('/dist',express.static(__dirname + '/dist/'));
app.use('/src',express.static(__dirname + '/src/'));
app.use('/img',express.static(__dirname + '/img/'));
app.use('/music',express.static(__dirname + '/music/'));
app.use('/upload',express.static(__dirname + '/upload/'));

app.use(
	bodyParser.urlencoded({extended: true ,limit: '10mb'})
);

app.get('/', function (req, res) {
  //res.send('niconiconi !!!niconiconi !!niconiconi ');
  res.sendFile(__dirname+'/index.html');
});

var setRndCookie = (res,prefix)=>{
	var v = `${prefix}`+(Math.random()*10000|0);
	res.cookie(v,1);
}

var Cache = {};

//那个域名下跨域请求
//请求api并携带了Credentials：true,cookie是存在在与浏览器中
//前后端的cookie被独立设置了，前后端无法共享
//后端如果响应头带了Credentials：true那么那些后端api cookie可共享
app.get('/api/getindexvideo',(req,res)=>{


	res.end(
		JSON.stringify({
			error:0
			,data:{target:'http://www.baidu.com',link:'...'}
		})

	);
	


})

app.get('/api/getindexvideoa',(req,res)=>{


	//"Access-Control-Allow-Credentials", "true"
	//"Access-Control-Allow-Origin", 'https://www.google.com'

	res.header('Access-Control-Allow-Origin', 'http://niconiconi.cn'); 
	res.header('Access-Control-Allow-Credentials', 'true'); 

	setRndCookie(res,'bed-videoa-cross-');

	console.log(
		'videoa cross-------'.yellow
		,Object.keys(req.cookies).map(k=>{
			return k;
		})
		,'-------videoa cross end---'.yellow
		
	);

	const o = {
		data:{
		
		}
	}

	//console.log(req.cookies);

	if(req.cookies.aa){
		o.data.hasCookie=true;
		o.data.cookies = req.cookies.aa;
	}else{
		o.data.hasCookie=false;
		o.data.cookies = req.cookies.aa;
	
	}

	res.end(JSON.stringify(o));
})
app.post('/api/posted',(req,res)=>{
	////encodeURIComponent(req.query.html);
	////console.log(Cache['html']);

	if(Cache['html']){
		res.end(  JSON.stringify({ cache:true,  html:Cache['html']} ) );
		return;
	}
	
	var o = {html:req.body.html};

	Cache['html'] = o.html;
	res.end(JSON.stringify(o));

	////////////////////////////////////////
	// var o = {html:req.body.html};

	// res.end(JSON.stringify(o));
})

//mu.xy.com/mufed/repo/xxx.html
//===>proxy
//mu.xy.com/weixin/api
//api.mu.xy.com/xxxxx

//host
//192.168.84.91 mu.xy.com 
//[get] host+'/weixin/api/repo/fed-kickstart/rankInclude'
app.get('/weixin/api/repo/:name/rankInclude',function(req,res){
	res.header('Access-Control-Allow-Origin', '*'); 

	console.log('repo_name:',req.params.name);
	console.log('someone openid:',req.query.openid);
	//res.json({ user: 'tobi' });
	const o = {
		message:{}
		,data:{
			thatone:{score:'23'}
			,list:[{openid:'openid-xxx3',score:80},{openid:'openid-xxx3434',score:10}]
		}
	}
	res.end(JSON.stringify(o));
});

app.get('/weixin/api/statistics/:repo_name',function(req,res){
	
	res.header('Access-Control-Allow-Origin', '*'); 

	res.end(JSON.stringify( { message:'statistics!' ,data:{repo:req.params.repo_name}} ));

})

app.get('/weixin/api/pv/:repo_name',function(req,res){
	res.header('Access-Control-Allow-Origin', '*'); 
	res.end(JSON.stringify( {message:'statistics pv!!!!'}  ));
});


app.get('/weixin/api/playerGetReward/:openid',function(req,res){
	res.header('Access-Control-Allow-Origin', '*');

	setTimeout(()=>{
		res.end(JSON.stringify( {message:'get jf ok'}  ));
	},566);
	

})

app.get('/weixin/api/playerInfo/:openid',function(req,res){
	res.header('Access-Control-Allow-Origin', '*');

	setTimeout(()=>{
		res.end(JSON.stringify( {
			message:'playerInfo'
			,canplay:true
			,exist_jf:false
			//,exist_jf:true
		} ));
	},566)
	//res.end(JSON.stringify( {message:'playerInfo'} ));
	
})




app.post('/upload', function(req, res){
	res.header('Access-Control-Allow-Origin', '*');
	//接收前台POST过来的base64
	var imgData = req.body.base64;
	var suff = req.body.suff;
	//过滤data:URL
	var base64Data = imgData.replace(/^data:image\/\w+;base64,/, '');
	var dataBuffer = new Buffer(base64Data, 'base64');
	var img_name = `image-${Date.now()}.${suff}`;

	fs.writeFile(`upload/${img_name}`, dataBuffer, function(err) {
			var resx = {
				attr:{
					url:`upload/${img_name}`
				}
				
			}
	    if(err){
				var resx = {
					attr:{
						url:`upload/${img_name}`
					}
				}
				//console.log(resx);
	      res.send('fail!');
	    }else{ 
	      res.end( `(${JSON.stringify(resx)})` );
	    }
	});
 
});

app.get('/posting',function(req,res){
	
	console.log(req.query);
	//res.send('success!');
	res.jsonp({status:'jsonp'});
	//fs.writeFile('./try4.txt', req.query.text, {encoding :'utf8mb4' }, function(err) {
	fs.writeFile('./try4.txt', req.query.text, {encoding :'utf-8' }, function(err) {
    if (err) {
        console.log(err);
    }

});


});

app.get('/x',(req,res)=>{

	for(var i = 1;i<51;i++){
		;(function(i){
			request({url:`https://tb2.bdstatic.com/tb/editor/images/client/image_emoticon${i}.png`,encoding:null},(err,response,buffer)=>{
				var idx = i<10?('0'+i):i;
				fs.writeFile(`./src/common/img/smile/popo_2adefed_${idx}.png`, buffer, function(err) {
					if (err) {
						console.log(err);
					}


				}); 
			});
		})(i);
		
	}



});


var server = app.listen(82, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('listening at:%s', port);
});