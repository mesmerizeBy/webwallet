   


function createUsdtAccount(){
  $.ajax({
     type:'GET',
     url:'/createUsdt',
     success:function(data){
       method.add(data,"usdt");
     }
    })
}

function getusdtInfo(address,o){
  $.ajax({
     type:'GET',
     url:'/getUsdtBalance',
     data:{
      "address":address
     },
     success:function(data){
      $(".usdt").removeClass("active");
        $(o).addClass("active");
       $("#usdtBalance").html(data.balance);
     }
    })
}

function sendUsdt(o){
  var faddress=$(".usdt.active").attr("id");
  var id=$(".usdt.active").attr("key");
  var balance=$("#usdtBalance").text();
  var obj={
    "tname":"泰达币",
    "balance":balance,
    "tSymbol":"USDT",
    "address":faddress,
    "id":id
  }
  var t=$("#transactUsdt").html();
    $("#tx").html(t.temp(obj))
    $("#sendtok").on("click",obj,sendUSDT)
}

function sendUSDT(o){
  var id=o.data.id;
  var address=o.data.address;
  var value=$("#value").val();
  var to=$("#to").val();
  console.log(id,address,value,to);
  method.find(id,"usdt").then(function(res){
    var obj={
      "privateKey":res.privateKey,
      "address":address,
      "to":to,
      "value":value
    };
    console.log(obj)
    $.ajax({
     type:'POST',
     url:'/sendUSDT',
     data:obj,
     success:function(data){
      console.log(data)
     }
    })
  })
  
}

