var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var fs = require('fs');

var app = require('express')();

var http = require('http');




app.use('/example',express.static(__dirname + '/example/'));
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
  res.sendFile(__dirname+'/example/index.html');
});


app.post('/upload', function(req, res){
	res.header('Access-Control-Allow-Origin', '*');
	//接收前台POST过来的base64
	var imgData = req.body.base64;
	var suff = req.body.suff;
	//过滤data:URL
	var base64Data = imgData.replace(/^data:image\/\w+;base64,/, '');
	var dataBuffer = new Buffer(base64Data, 'base64');
	var img_name = `image-${Date.now()}.${suff}`;

	fs.writeFile(`example/upload/${img_name}`, dataBuffer, function(err) {
			var resx = {
				attr:{
					url:`example/upload/${img_name}`
				}
				
			}

			//console.log(err);

	    if(err){
				var resx = {
					attr:{
						url:`example/upload/${img_name}`
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
	res.send('success!');
	//res.jsonp({status:'jsonp'});


});



var server = app.listen(82, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('listening at:%s', port);
})