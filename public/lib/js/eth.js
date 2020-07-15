var abi={
  "getName":"0x06fdde03",
  "getSymbol":"0x95d89b41",
  "getDecimals":"0x313ce567",
  "getTotalSupply":"0x18160ddd",
  "transfer":"0xa9059cbb",
  "transferfrom":"0x23b872dd"
}
var net="mainnet";
web3 = new Web3(new Web3.providers.HttpProvider("https://"+net+".infura.io/VGuDEFSHKL1G1RLEfqhq"));

var Crypto = require('crypto')
var secp256k1=require('secp256k1')
var createKeccakHash=require('keccak')
function createEthAccount(){
    	var privateKey=Crypto.randomBytes(32);//new Buffer('dee1ee5e5543e7d198b2ca374250410400691ca710dfa06785f69e97b3f12e37','hex');
		var pubKey=secp256k1.publicKeyCreate(privateKey,false).slice(1);
		var address =createKeccakHash('keccak256').update(pubKey).digest().slice(-20);
		address = web3.utils.toChecksumAddress(address.toString('hex'));


		console.log(privateKey.toString('hex'));
		console.log(address.toString('hex'));
		method.add({
			"address":address.substr(2),
			"privateKey":privateKey.toString('hex')
		},"eth");
}

function getAccountEandS(address){
	Promise.all([web3.eth.getBalance(address),getBalance(address,"0x3109Af90eeDBeEbA9Df921a23dc6aC45188b4366"),getDecimals("0x3109Af90eeDBeEbA9Df921a23dc6aC45188b4366")]).then(
		function(res){
			$("#sowBalance").html((res[1]/Math.pow(10,res[2])).toFixed(2));
			$("#ethBalance").html(Number(web3.utils.fromWei(res[0],'ether')).toFixed(2));
			var faddress=$(".eth.active").attr("id");
			var id=$(".eth.active").attr("key")
			if(!faddress){
				faddress="请选择一个交易账户"
			}
			var obj={
		      "balance":(res[1]/Math.pow(10,res[2])).toFixed(2),
		      "tSymbol":"SOW",
		      "address":faddress,
		      "tokenAddress":"0x3109Af90eeDBeEbA9Df921a23dc6aC45188b4366",
		      "tname":"Seed of wisdom",
		      "id":id,
		      "Decimals":res[2]
		    }
		    var ebj={
		      "balance":Number(web3.utils.fromWei(res[0],'ether')).toFixed(2),
		      "tSymbol":"ETH",
		      "address":faddress,
		      // "tokenAddress":"0x3109Af90eeDBeEbA9Df921a23dc6aC45188b4366",
		      "tname":"Ethereum",
		      "id":id,
		      "Decimals":18
		    }

		    // obj['data']=JSON.stringify(obj);
		    $("#sowt").find("img").attr("data",JSON.stringify(obj));
		    $("#etht").find("img").attr("data",JSON.stringify(ebj));
			return {
				"eth":res[0],
				"sow":res[1]
			}
		}
	)
	
}

function getTokenInfo(address,tokenAddress){
  Promise.all([getSymbol(tokenAddress),getDecimals(tokenAddress),getBalance(address,tokenAddress),getName(tokenAddress), gettotalSupply(tokenAddress)]).then(function(res){
    var faddress=$(".eth.active").attr("id");
	if(!faddress){
		faddress="请选择一个交易账户"
	}
	var id=$(".eth.active").attr("key")
    var obj={
      "balance":(res[2]/Math.pow(10,res[1])).toFixed(2),
      "tSymbol":res[0],
      "address":faddress,
      "totalSupply":res[4],
      "tname":res[3],
      "tokenAddress":tokenAddress,
      "id":id,
      "Decimals":res[1]
    }
    obj['data']=JSON.stringify(obj);
    // console.log(obj);
    var tokenList=$("#tkList").html();
    $("#tlist").append($(tokenList.temp(obj)));
    // $("#"+tokenAddress).tooltip();
  });
}



function getDecimals(tokenAddress){
  var p = new Promise(function(resolve, reject){
      var text=abi.getDecimals;
      web3.eth.call({
          to: tokenAddress, // contract address
          data: text
      },function(err,rest){
        if(!err){
          if(rest!="0x"){
            var str=web3.eth.abi.decodeParameter('uint256', rest);
            resolve(str);
          }else{
            reject("获取失败，请确认合约是否存在于此网络");
          }
          
        }
      })
  });
  return p;  
}


function gettotalSupply(tokenAddress){
	var p = new Promise(function(resolve, reject){
      var text=abi.getTotalSupply;
      web3.eth.call({
          to: tokenAddress, // contract address
          data: text
      },function(err,rest){
        if(!err){
          if(rest!="0x"){
          	
            var str=web3.eth.abi.decodeParameter('uint256', rest);
            resolve (str);
          }else{
            reject("获取失败，请确认合约是否存在于此网络");
          }
          
        }
      })
  });      
  return p;
}

function getName(tokenAddress){
    var p = new Promise(function(resolve, reject){
      var text=abi.getName;
      web3.eth.call({
          to: tokenAddress, // contract address
          data: text
      },function(err,rest){
        if(!err){
          if(rest!="0x"){
            var str=web3.eth.abi.decodeParameter('string', rest);
            resolve (str);
          }else{
            reject("获取失败，请确认合约是否存在于此网络");
          }
          
        }
      })
  });      
  return p;  
}


function getSymbol(tokenAddress){
  var p = new Promise(function(resolve, reject){
      var text=abi.getSymbol;
      web3.eth.call({
          to: tokenAddress, // contract address
          data: text
      },function(err,rest){
        if(!err){
          if(rest!="0x"){
            var str=web3.eth.abi.decodeParameter('string', rest);
            resolve(str);
          }else{
            reject("获取失败，请确认合约是否存在于此网络");
          }
          
        }
      })
  });
  return p;  
}


function getBalance(address,tokenAddress){
  var p = new Promise(function(resolve, reject){
        var text=web3.eth.abi.encodeFunctionCall({
             name: 'balanceOf',
             type: 'function',
             inputs: [{
                 type: 'address',
                 name: '_owner'
             }]
         }, [address]);
        
        web3.eth.call({
            to: tokenAddress, // contract address
            data: text
        },function(err,rest){
          if(!err){
            if(rest!="0x"){
              var str=web3.eth.abi.decodeParameter('uint', rest);
              resolve(str) ;
            }else{
              reject("获取失败，请确认合约是否存在于此网络");
            }
            
          }
        })
    });
       
  
  return p;    
}

function getEthaddress(){
	var privateKey=new Buffer(document.getElementById("ethprivateKey").value,"hex");//new Buffer('dee1ee5e5543e7d198b2ca374250410400691ca710dfa06785f69e97b3f12e37','hex');
	var pubKey=secp256k1.publicKeyCreate(privateKey,false).slice(1);
	var address =createKeccakHash('keccak256').update(pubKey).digest().slice(-20);
	address = web3.utils.toChecksumAddress(address.toString('hex'));


	console.log(privateKey.toString('hex'));
	console.log(address.toString('hex'));
	method.add({
		"address":address.substr(2),
		"privateKey":privateKey.toString('hex')
	},"eth");
}

function sendtoken(str){
	var s=$(str).find('img').attr('data')
	s=JSON.parse(s);
	var tokenList=$("#transactTk").html();
    $("#tx").html(tokenList.temp(s))
    $("#sendtok").on("click",s,csend)
}
function sendEth(str){
	var s=$(str).find('img').attr('data')
	s=JSON.parse(s);
	var tokenList=$("#transactTk").html();
    $("#tx").html(tokenList.temp(s))
    $("#sendtok").on("click",s,sendETH)
}

function sendETH(o){
	var address=$("#from").val();
  var recipient=$("#to").val();
  var amount=$("#value").val();
  var gasprice=$("#gas").val();
  id=o.data.id;
decimals=o.data.Decimals;

  Promise.all([web3.eth.getTransactionCount(address),method.find(id,"eth")]).then(function(res){
  	var rawTx = {
      nonce: res[0],
      gasPrice: web3.utils.toHex(web3.utils.toWei('3', 'gwei')),
      gasLimit:web3.utils.toHex(21000),
      to: recipient,
      value: web3.utils.toHex(web3.utils.toWei(amount, 'ether'))
    }
    var privateKey=res[1].privateKey;
    var private=new ethereumjs.Buffer.Buffer(privateKey, 'hex');

    var tx = new ethereumjs.Tx(rawTx); 
    tx.sign(private);
    var serializedTx = tx.serialize();
    $("#pro").addClass("show")
    return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
  }).then(function(res){
    $("#tokenstatus").html("<a href='https://"+net+".etherscan.io/tx/"+res.transactionHash+"'>交易成功,点击查看交易</a>")
    console.log(res);
    $("#pro").removeClass("show")
    web3.eth.getBalance(address).then(function(res){
    	$(".tkbalance").val((res/Math.pow(10,18)).toFixed(2))
    })
  });
}


function csend(o){
contractAddress=o.data.tokenAddress;
id=o.data.id;
decimals=o.data.Decimals;
	$("#pro").addClass("show")
  var address=$("#from").val();
  var toaddress=$("#to").val();
  var value=$("#value").val();
  var gasPrice=$("#gas").val();
  
  console.log(address,toaddress,value)
  var status=$("#tokenstatus");
  x = new BigNumber(Math.pow(10,decimals));
  y = new BigNumber(value);
  value=x.multipliedBy(y);
  

  var text=web3.eth.abi.encodeFunctionCall({
       name: 'transfer',
       type: 'function',
       inputs: [{
        type: 'address',
        name: '_to'
       },{
           type: 'uint256',
           name: '_value'
       }]
   }, [toaddress,value]);

  Promise.all([web3.eth.estimateGas({
    to: toaddress,
    data: text
    }),web3.eth.getTransactionCount(address),method.find(id,"eth")]).then(function(res){
    var privateKey=res[2].privateKey;
    var rawTx = {
      "nonce": res[1],
      "gasPrice": web3.utils.toHex(web3.utils.toWei(gasPrice, 'gwei')),
      "gasLimit":web3.utils.toHex(res[0]+100000),
      "to": contractAddress,
      "value": web3.utils.toHex(0),
      "data":text
    }
    console.log(rawTx);
    var private=new ethereumjs.Buffer.Buffer(privateKey, 'hex');

    var tx = new ethereumjs.Tx(rawTx); 
    tx.sign(private);
    var serializedTx = tx.serialize();
    return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
  }).then(function(res){
    status.html("<a href='https://"+net+".etherscan.io/tx/"+res.transactionHash+"'>交易成功,点击查看交易</a>");
    $("#pro").removeClass("show")
    getBalance(address,contractAddress).then(function(res){
    	$(".tkbalance").val((res/Math.pow(10,decimals)).toFixed(2))
    })
    console.log(res);
  });
}

