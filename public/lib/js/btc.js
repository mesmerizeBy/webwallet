var Buffer =require('Buffer').Buffer
var randomBytes = require('randombytes')
var BigInteger = require('bigi')
var ecurve = require('ecurve')
var Crypto = require('crypto')
var cs = require('coinstring')
var secp256k1=require('secp256k1')
var createKeccakHash=require('keccak')
const bitcoin = require('bitcoinjs-lib');

  //   	$.ajax({
		// 	type:'GET',
		// 	url:'createBtcAddress',
		// 	dataType:"jsonp",
		// 	jsonpCallback:'well',
		// 	success:function(data){
		// 		console.log(data);
		// 	}
		// })

function createBtcAccount(){//https://blockchain.info/q/addressbalance/12HnmPpLomtPL53Q4s6xEqRB4wkMHi5GEZ
	   console.log(Buffer)
		var secp256k1 = ecurve.getCurveByName('secp256k1')
		var randombytes = randomBytes(32).toString('hex')
		var privatekey = new Buffer(randombytes, 'hex')
		var privateKey=privatekey;
		privateKey = Buffer.concat([privateKey, new Buffer([0x01])]);
		// console.log("转换成wif格式"+cs.encode(privateKey, 0x80)) 
		console.log("新地址私钥"+cs.encode(privateKey, 0x80)); 
		// privateKey=new Buffer.from(cs.decode(cs.encode(privateKey, 0x80)).toString('hex'),"hex");
		var ecparams = ecurve.getCurveByName('secp256k1')
		var curvePt = ecparams.G.multiply(BigInteger.fromBuffer(privatekey))
		var x = curvePt.affineX.toBuffer(32)
		var y = curvePt.affineY.toBuffer(32)
		var publicKey = Buffer.concat([new Buffer([0x04]), x, y])
		// console.log("从私钥得到的标准未压缩公钥:" + publicKey.toString('hex'))
		//compressed
		publicKey = curvePt.getEncoded(true) //true forces compressed public key
		// console.log("公钥压缩之后:" + publicKey.toString('hex'))
		var sha = Crypto.createHash('sha256').update(publicKey).digest()
		var pubkeyHash = Crypto.createHash('rmd160').update(sha).digest()
		// pubkeyHash of compressed public key
		// console.log("pubkeyHash:" + pubkeyHash.toString('hex'))
		// address of compressed public key
		console.log("新地址" + cs.encode(pubkeyHash, 0x0)) //-- 0x0 is for public addresses
		method.add({
			"address":cs.encode(pubkeyHash, 0x0),
			"privateKey":cs.encode(privateKey, 0x80)
		},"btc")
}

console.log(bitcoin);
function exportAddress(dbname){
	var prikey=document.getElementById(dbname+"privateKey").value;
  if(prikey.length==64){
    var privatekey = new Buffer(prikey, 'hex')
    var privateKey=privatekey;
    privateKey = Buffer.concat([privateKey, new Buffer([0x01])]);
    // console.log("转换成wif格式"+cs.encode(privateKey, 0x80)) 
    console.log("新地址私钥"+cs.encode(privateKey, 0x80)); 
    // privateKey=new Buffer.from(cs.decode(cs.encode(privateKey, 0x80)).toString('hex'),"hex");
    var ecparams = ecurve.getCurveByName('secp256k1')
    var curvePt = ecparams.G.multiply(BigInteger.fromBuffer(privatekey))
    var x = curvePt.affineX.toBuffer(32)
    var y = curvePt.affineY.toBuffer(32)
    var publicKey = Buffer.concat([new Buffer([0x04]), x, y])
    // console.log("从私钥得到的标准未压缩公钥:" + publicKey.toString('hex'))
    //compressed
    publicKey = curvePt.getEncoded(true) //true forces compressed public key
    // console.log("公钥压缩之后:" + publicKey.toString('hex'))
    var sha = Crypto.createHash('sha256').update(publicKey).digest()
    var pubkeyHash = Crypto.createHash('rmd160').update(sha).digest()
    // pubkeyHash of compressed public key
    // console.log("pubkeyHash:" + pubkeyHash.toString('hex'))
    // address of compressed public key
    console.log("新地址" + cs.encode(pubkeyHash, 0x0)) //-- 0x0 is for public addresses
    method.add({
      "address":cs.encode(pubkeyHash, 0x0),
      "privateKey":cs.encode(privateKey, 0x80)
    },dbname)
  }
  else{
    var keyPair = bitcoin.ECPair.fromWIF(prikey)
    method.add({
      "address":keyPair.getAddress(),
      "privateKey":prikey 
      },dbname)
  }
	
}

function getbtcInfo(s,o){
	$.ajax({
     type:'GET',
     url:'/getBtcBalance',
     data:{
     	"address":s
     },
     success:function(data){
     	$(".btc").removeClass("active");
        $(o).addClass("active");
       $("#btcBalance").html(data.balance);
     }
    })
}

function sendBtc(o){
  var faddress=$(".btc.active").attr("id");
  var id=$(".btc.active").attr("key");
  var balance=$("#btcBalance").text();
  var obj={
    "tname":"比特币",
    "balance":balance,
    "tSymbol":"BTC",
    "address":faddress,
    "id":id
  }
  var t=$("#transactUsdt").html();
    $("#tx").html(t.temp(obj))
    $("#sendtok").on("click",obj,sendBTC)
}

function sendBTC(o){
  var id=o.data.id;
  var address=o.data.address;
  var value=$("#value").val();
  var to=$("#to").val();
  console.log(id,address,value,to);
  method.find(id,"btc").then(function (res){
  	var obj={
      "privateKey":res.privateKey,
      "address":address,
      "to":to,
      "val":value
    };
    console.log(obj)
    $.ajax({
     type:'POST',
     url:'/sendBTC',
     data:obj,
     success:function(data){
      console.log(data)
     }
    })
  })
}
// var str=document.getElementById("btcprivateKey").value;
// 	var priKey=cs.decode(str).toString("hex");
// 	console.log(priKey);
// 	priKey=priKey.substr(2,64)
// 	console.log(priKey);
// 	// privateKey=new Buffer.from(priKey,"hex");
// 	// privateKey = Buffer.concat([privateKey, new Buffer([0x01])]);

// 	var ecparams = ecurve.getCurveByName('secp256k1')
// 	var curvePt = ecparams.G.multiply(BigInteger.fromBuffer(new Buffer(priKey,'hex')))
// 	var x = curvePt.affineX.toBuffer(32)
// 	var y = curvePt.affineY.toBuffer(32)

// 	var publicKey = Buffer.concat([new Buffer([0x04]), x, y])


// 	//compressed
// 	publicKey = curvePt.getEncoded(true) //true forces compressed public key


// 	var sha = Crypto.createHash('sha256').update(publicKey).digest()
// 	var pubkeyHash = Crypto.createHash('rmd160').update(sha).digest()

// 	// pubkeyHash of compressed public key


// 	// address of compressed public key
// 	var address=cs.encode(pubkeyHash, 0x0);
// 	method.add({
// 		"address":address,
// 		"privateKey":str
// 	},"btc")