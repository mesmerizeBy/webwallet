const http=require('http');
const https=require('https');
const express             = require('express');
const app                 = express();
const path                = require('path'); 
var qs = require('querystring'); 
const randomBytes = require('randombytes')
const BigInteger = require('bigi')
const ecurve = require('ecurve')
const crypto = require('crypto')
const cs = require('coinstring')
const ec = require('ecdsa')
const sha3=require('sha3')
const secp256k1=require('secp256k1')
const createKeccakHash=require('keccak')
const nodersa=require('node-rsa');
var bip39 = require('bip39')
var hdkey = require('ethereumjs-wallet/hdkey')
var util = require('ethereumjs-util')
const bodyParser=require('body-parser');
const fs=require('fs')
var multiparty= require('connect-multiparty');



// var mutipartMiddeware = mutipart();
const bitcoin = require('bitcoinjs-lib');



app.set('views', path.join(__dirname, '/public')); 
app.set("view engine","html") 
app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.json());//数据JSON类型
// app.use(bodyParser({uploadDir:'./public'}));
app.use(bodyParser.urlencoded({ extended: false }));//解析post请求数据
app.use(multiparty({uploadDir:"./public"}));
// var mnemonic = bip39.generateMnemonic()
// var seed = bip39.mnemonicToSeed(mnemonic)
// var hdWallet = hdkey.fromMasterSeed(seed)
// var key1 = hdWallet.derivePath("m/44'/0'/0'/0/0")
// var address1 = util.pubToAddress(key1._hdkey._publicKey, true)
// address1 = util.toChecksumAddress(address1.toString('hex'))
// console.log(key1._hdkey._privateKey.toString('hex'))

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/public/" + "main.html" );
})

app.get('/createUsdt', function (req, res) {
	var key=new nodersa({b:1024});
	key.setOptions({encryptionScheme: 'pkcs1'})
	var pubkey=key.exportKey('pkcs8-public');
	var prikey=key.exportKey('pkcs8-private');

	var data = { 
	    'publickey': pubkey};//这是需要提交的数据 
	var content=qs.stringify(data); 
	// get 请求外网
	var options = {
	    hostname: '47.94.218.86',  
	    port: 80,
	    path: '/home/ajax/apiNewUsdtAccount',  
	    method: 'POST', 
	    headers:{
			'Content-Type':'application/x-www-form-urlencoded',
			'Content-Length':content.length
		}
	};
	var reqq = http.request(options, function (ress) {  
	    ress.setEncoding('utf8');
	    ress.on('data', function (chunk) { 
	    	// console.log(chunk)
	    	chunk=JSON.parse(chunk); 
	    	var address=JSON.parse(key.decrypt(chunk[0],'utf8')).address;
	    	var privatekey=JSON.parse(key.decrypt(chunk[0],'utf8')).privateKey;
	        res.json({
	        	"address":address,
	        	"privateKey":privatekey
	        });
	    });
	}); 
	reqq.write(content);  

	reqq.end(); 
    
})

app.get('/getBtcBalance', function (req, res) { 
	// get 请求外网
	var options = {
	    hostname: 'blockchain.info',  
	    port: 443,
	    path: '/q/addressbalance/'+req.query.address,  
	    method: 'GET', 
	};
	var reqq = https.request(options, function (ress) {  
	    
	    ress.setEncoding('utf8');
	    ress.on('data', function (chunk) { 
	    	res.json({
	    		"balance":parseInt(chunk)/1e8
	    	})
	    });
	});
	reqq.end();
})

app.get('/getUsdtBalance', function (req, res) { 
	// get 请求外网
	var options = {  
	    hostname: '47.94.218.86',  
	    port: 80,
	    path: '/home/ajax/getAccountBalance?address='+req.query.address,  
	    method: 'GET', 
	};
	var reqq = http.request(options, function (ress) {  
	    ress.setEncoding('utf8');
	    ress.on('data', function (chunk) { 
	    	res.json(
	    		JSON.parse(chunk)
	    	)
	    });  
	}); 
	reqq.end();
})
var pubKey = new nodersa("-----BEGIN PUBLIC KEY-----"+
"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvC37ZyxnMdSBP5Lthbgb"+
"BQAvMli8Do7rFFQBAfHgVeI0wo5JNZ6NyAR9SNb71Gsms3deBManCpJsyXqImC+e"+
"OmPvSmIMzbaFSOcJN09AbrGTYe6ph58l9aNtXZhpdCSrvaoCSH6Z6K5Gt7ww9KAH"+
"6eCClwQswxMgIlewJgB2R57+avZDtEPkHVQHnjKPWDOtjTSzo/FwZtXQuSRQt2Wu"+
"horRXpI6vSpz4a/AK6EhITzc4B8WQ+tfk5VxXdYMCw2a4fRbaYN1bQo0o/qE9QUW"+
"VCagx6nOlVr0RfZBewAIsRw5G8E7SBrLgCqP1AopdtDZJ61TSXQ/9Ey5MSI3S/Vb"+
"VQIDAQAB"+
"-----END PUBLIC KEY-----",'pkcs8-public');//导入公钥
pubKey.setOptions({encryptionScheme: 'pkcs1'})

app.post('/sendUSDT', function (req, res){
	

	var encrypted = pubKey.encrypt(req.body.privateKey, 'base64');
	console.log(encrypted)
	var data = { 
		"from":req.body.address,
		"to":req.body.to,
		"num":req.body.value,
	    "vv": encrypted
	};//这是需要提交的数据 
	console.log(data);
	var content=qs.stringify(data); 
	var options = {  
	    hostname: '47.94.218.86',  
	    port: 80,
	    path: '/home/ajax/sendtransaction',  
	    method: 'POST', 
	    headers:{
			'Content-Type':'application/x-www-form-urlencoded',
			'Content-Length':content.length
		}
	};
	var reqq = http.request(options, function (ress) {  
	    
	    ress.setEncoding('utf8');
	    ress.on('data', function (chunk) { 
	    	res.json(
	    		JSON.parse(chunk)
	    	)
	    });  
	}); 
	reqq.write(content);
	reqq.end();
})

app.get('/exportKeyStore', function (req, res) {

   var fileName = "keystore.txt";   
   var filePath = path.join(__dirname, "public/"+fileName);   
   fs.writeFileSync(filePath,JSON.stringify(req.query));
   var stats = fs.statSync(filePath);    
   if(stats.isFile()){
       res.set({     
       	'Content-Type': 'application/octet-stream',     
       	'Content-Disposition': 'attachment; filename='+fileName,     
       	'Content-Length': stats.size    
       });    
       fs.createReadStream(filePath).pipe(res);   
   } else {
       res.end(404);   
   }  
})

app.post('/importkey',function (req, res) {
	
    console.log(req.files.fileimport)

    var filePath = req.files.fileimport.path;
    console.log(filePath)
    var data = fs.readFileSync(filePath, 'utf8');
    fs.unlinkSync(filePath)
    res.json(JSON.parse(data))
})

app.post('/sendBTC',function(req,res){
	
	var data = { 
		"from":req.body.address,
		"to":req.body.to,
		"num":req.body.val,
	    "privateKey": req.body.privateKey
	};
	var content=qs.stringify(data); 
	var options = {  
	    hostname: 'blockchain.info',  
	    port: 443,
	    path: '/unspent?active='+req.body.address,  
	    method: 'GET', 
	};


	var s="";
	var reqq = https.request(options, function (ress) {  
	    
	    ress.setEncoding('utf8');
	    ress.on('data', function (chunk) {
		    
	    	s+=chunk;
	    });  
	    ress.on("end", function () {
	    	if(ress.statusCode=200) {
		    	sendbitcoin(JSON.parse(s).unspent_outputs,data.num*1e8,data.privateKey,data.to,data.from,res)
		    }
        	// res.send(s)//得到body
    	});
	}); 
	reqq.end();
})

function sendbitcoin(tx,amount,privatekey,toaddress,from,res){
	
	var alice = bitcoin.ECPair.fromWIF(privatekey);

	var txb = new bitcoin.TransactionBuilder();

	amount+=1e3;
	txb.setVersion(1);
	 // Alice's previous transaction output, has 15000 satoshis
	 var tot=0;
	for(var i=0;i<tx.length;i++){
			txb.addInput(tx[i].tx_hash_big_endian, tx[i].tx_output_n);
			tot+=tx[i].value
			console.log("1");
	}
	
	console.log(amount,tot)
	txb.addOutput(toaddress, amount-1e3);
	txb.addOutput(from, tot-amount); 
	for(var i=0;i<tx.length;i++){
		txb.sign(i, alice);
		console.log(i)
	}
	// (in)15000 - (out)12000 = (fee)3000, this is the miner fee
	var tx=txb.build().toHex();
	console.log(tx)
	var data = { 
		"tx":tx
	};
	var content=qs.stringify(data); 
	var options = {  
	    hostname: 'blockchain.info',  
	    port: 443,
	    path: '/pushtx',  
	    method: 'POST', 
	    headers:{
			'Content-Type':'application/x-www-form-urlencoded',
			'Content-Length':content.length
		}
	};


	var s="";
	var reqq = https.request(options, function (ress) {  
	    
	    ress.setEncoding('utf8');
	    ress.on('data', function (chunk) {
	    	s+=chunk;
	    });  
	    ress.on("end", function () {
	    	console.log(s);
        	res.send(s);
    	});
	}); 
	reqq.write(content);
	reqq.end();
}


// app.get('/createWallet', repos.create)

var server = app.listen(3000, function () {
 
  var host = server.address().address;
  var port = server.address().port;
 
  console.log("mypage，访问地址为 http://%s:%s", host, port);
 
})