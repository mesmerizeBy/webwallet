     // 数据库名称
    var dbName = 'wallet';
    // 版本
    var version = 1;
    // 数据库数据结果
    var db;
    // 打开数据库
    var DBOpenRequest = window.indexedDB.open(dbName, version);
    
    // 如果数据库打开失败
    DBOpenRequest.onerror = function(event) {
        alert('数据库打开失败');
    };
    
    DBOpenRequest.onsuccess = function(event) {        
        // 存储数据结果
        db    = DBOpenRequest.result;
        method.show("eth");
    };
    
    // 下面事情执行于：数据库首次创建版本，或者window.indexedDB.open传递的新版本（版本数值要比现在的高）
    DBOpenRequest.onupgradeneeded = function(event) {
        var db = event.target.result;
     
        db.onerror = function(event) {
            alert('数据库打开失败');
        };
    
        // 创建一个数据库存储对象
        var objectStore = db.createObjectStore('eth', { 
            keyPath: 'id',
            autoIncrement: true
        });
    
        // 定义存储对象的数据项
        objectStore.createIndex('id', 'id', {
            unique: true    
        });
        objectStore.createIndex('address', 'address');
        objectStore.createIndex('privateKey', 'privateKey');

        // 创建一个数据库存储对象
        var objectStore = db.createObjectStore('btc', { 
            keyPath: 'id',
            autoIncrement: true
        });
    
        // 定义存储对象的数据项
        objectStore.createIndex('id', 'id', {
            unique: true    
        });
        objectStore.createIndex('address', 'address');
        objectStore.createIndex('privateKey', 'privateKey');

        var objectStore = db.createObjectStore('usdt', { 
            keyPath: 'id',
            autoIncrement: true
        });
    
        // 定义存储对象的数据项
        objectStore.createIndex('id', 'id', {
            unique: true    
        });
        objectStore.createIndex('address', 'address');
        objectStore.createIndex('privateKey', 'privateKey');

        var objectStore = db.createObjectStore("token", { keyPath: "id" ,autoIncrement: true});
        objectStore.createIndex('id', 'id', {
            unique: true    
        });
        objectStore.createIndex('tokenAddress', 'tokenAddress');
    };



// web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/VGuDEFSHKL1G1RLEfqhq"));
// 简易模板方法
String.prototype.temp = function(obj) {
    return this.replace(/\$\w+\$/gi, function(matchs) {        
        return obj[matchs.replace(/\$/g, "")] || '';
    });
};

var method = {
        add: function (obj,dbname) {
            // j=JSON.parse(JSON.stringify(account));坑死人
            console.log(obj);
            var transaction = db.transaction([dbname], "readwrite");
            // 打开已经存储的数据对象
            var objectStore = transaction.objectStore(dbname);
            // 添加到数据对象中
            var objectStoreRequest = objectStore.add(obj);        
            objectStoreRequest.onsuccess = function(event) {
                method.show(dbname);
            };
        },
        addtoken:function(){
            var address=document.getElementById("tokenaddress").value;
            var j={
             "tokenAddress":address
            };
            // if(address.substr(0,2)=="0x"){
            //     alert("")
            // }
            j=JSON.parse(JSON.stringify(j));
            var transaction = db.transaction(["token"], "readwrite");
            // 打开已经存储的数据对象
            var objectStore = transaction.objectStore(["token"]);
            // 添加到数据对象中
            var objectStoreRequest = objectStore.add(j);   
            var address=$(".eth.active").attr("id");
            if(address)
            method.showtoken(address)
        },
        find:function(id,dbname){
            var p = new Promise(function(resolve, reject){
                var objectStore =db.transaction([dbname], "readwrite").objectStore([dbname]);
                var request = objectStore.get(Number(id));
                request.onsuccess = function(e) {
                    var res = e.target.result; //查找成功时候返回的结果对象
                    console.log(res);                    
                    if (res) {                        
                        resolve(res) ;
                    }
                    else{
                        reject("查找失败")
                    }
                }
            })
            return p;
            
        },
        edit: function (id, data) {
            // 编辑数据
            var transaction = db.transaction([dbName], "readwrite");
            // 打开已经存储的数据对象
            var objectStore = transaction.objectStore(dbName);
            // 获取存储的对应键的存储对象
            var objectStoreRequest = objectStore.get(id);
            // 获取成功后替换当前数据
            objectStoreRequest.onsuccess = function(event) {
                // 当前数据
                var myRecord = objectStoreRequest.result;
                // 遍历替换
                for (var key in data) {
                    if (typeof myRecord[key] != 'undefined') {
                        myRecord[key] = data[key];
                    }
                }
                // 更新数据库存储数据                
                objectStore.put(myRecord);
            };
        },
        del: function (id,dbname) {
            // 打开已经存储的数据对象
            var objectStore = db.transaction([dbname], "readwrite").objectStore(dbname);            
            // 直接删除            
            var objectStoreRequest = objectStore.delete(id);
            // 删除成功后
            objectStoreRequest.onsuccess = function() {
                method.show(dbname);
            };
        },
        show: function (dbname) {
            // 最终要展示的HTML数据
            var htmlProjectList = '';
            // 打开对象存储，获得游标列表
            var objectStore = db.transaction([dbname]).objectStore(dbname);
            var strTplList=document.getElementById("tplList").innerHTML;
            objectStore.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                // 如果游标没有遍历完，继续下面的逻辑
                if (cursor) {
                    var prefix="";
                    if(dbname=="eth"){
                         prefix+="0x";
                    }
                    var o={
                            "raddress":prefix+cursor.value.address.substr(0,8)+"..."+cursor.value.address.slice(-10),
                            "address":prefix+cursor.value.address,
                            "privateKey":cursor.value.privateKey,
                            "name":dbname,
                            "id":cursor.value.id
                        }
                    console.log(dbname)
                    htmlProjectList = htmlProjectList + strTplList.temp(o);            
                    // 继续下一个游标项
                    cursor.continue();
                // 如果全部遍历完毕
                } else {
                    // logInfo('');
                    // eleTbody.innerHTML = htmlProjectList;

                    $("#"+dbname+"addresses").html(htmlProjectList);
                    if (htmlProjectList == '') {
                        $("#"+dbname+"addresses").html('暂无账户');    
                    }
                    else{

                    }
                }
            }
        },
        showtoken:function(address){
            // 打开对象存储，获得游标列表
            $("#tlist").html("");
            var objectStore = db.transaction("token").objectStore("token");
            objectStore.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                // 如果游标没有遍历完，继续下面的逻辑
                if (cursor) {
                    var tokenAddress=cursor.value.tokenAddress;
                    getTokenInfo(address,tokenAddress);
                    cursor.continue();
                // 如果全部遍历完毕
                } else {
                    // logInfo('');
                    // eleTbody.innerHTML = htmlProjectList;
                }
            }
        }
    };

   function getethInfo(address,o){
        $(".eth").removeClass("active");
        $(o).addClass("active");
        getAccountEandS(address);
        method.showtoken(address);
   }

   function exportKey(id,dbname){
    method.find(id,dbname).then(function(res){
        window.location.href="/exportKeyStore?"+"address="+res.address+"&privateKey="+res.privateKey
    })
   }

   function importkey(dbname){
var formData = new FormData(document.getElementById(dbname+"file"));alert("")
    $.ajax({
        type : 'POST',
        url : '/importkey',
        data: formData ,
        processData:false,
        async:false,
        cache: false, 
        contentType: false, 
        success:function(re){
            console.log(re)
          method.add(JSON.parse(JSON.stringify(re)),dbname)
        },
        error:function(re){
          console.log(re);
        }
      });  

}