var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Accounts = require('../models/accounts');

mongoose.connect('mongodb://127.0.0.1:27017/password');

mongoose.connection.on("connected", function(){
  console.log("MongoDB connected success");
});

mongoose.connection.on("error", function(){
  console.log("MongoDB connected fail");
});

mongoose.connection.on("disconnected", function(){
  console.log("MongoDB connected disconnected");
});
var modelCallback = function(res, msg, retValue){
  return function fn(err,doc){
    if(!retValue){
      retValue = doc;
    }
    if(!msg){
      msg = '';
    }
    if(err){
      res.json({
        hasError:true,
        message:err.message
      });
    } else {
      res.json({
        hasError:false,
        message:msg,
        content:{
          isSuccess:true,
          retValue:retValue
        }
      });
    }
  }
}
var COMMONMSG = '操作成功';
var validParams = function(res,param, msg){
  if(!param){
    res.json({
      hasError:true,
      message:msg
    });
    return false;
  }
  return true;
}
// 查询商品列表
router.get("/list", function(req,res,next){
  var searchData = JSON.parse(req.param('searchData'));
  for(var key in searchData){
    if(!searchData[key]){
      delete searchData[key];
    }
    if(key == "platform"){
      var value = searchData.platform;
      searchData.platform = { $regex: value + ".+","$options":"i" };
    }
  }
  Accounts.find(searchData,modelCallback(res));
});
// 查看密码验证
router.post("/checkAuthority",function(req,res,next){
  var servicePwd = req.body.servicePwd;
  if(!validParams(res,servicePwd,'验证失败')){
    return;
  }
  const SERVICELIST = ["880213","920219"];
  if(SERVICELIST.indexOf(servicePwd) > -1){
    res.json({
      hasError:false,
      message:'验证成功',
      content:{
        isSuccess:true
      }
    });
  } else {
    res.json({
      hasError:true,
      message:'验证失败'
    });
  }
});

// 新增和修改账户
router.post("/editAccount",function(req,res,next){
  var accountData  = req.body.accountData;
  if(!validParams(res,accountData,'参数不全')){
    return;
  }

  Accounts.find(function(err,doc){
    if(err){
      res.json({
        hasError:true,
        message:err.message
      });
    }else{
      if(accountData._id){
        for(var i=0;i<doc.length;i++){
          if(doc[i]._id == accountData._id){
            Accounts.findByIdAndUpdate(doc[i]._id,accountData,modelCallback(res, COMMONMSG));
            return;
          }
        }
        doc.save(modelCallback(res, COMMONMSG));
      } else {
        //var accountEntity = new Accounts(accountData);
        //accountEntity.save(modelCallback(res, COMMONMSG));
        Accounts.create(accountData,modelCallback(res, COMMONMSG));
      }
    }
  });
});

// 删除账户
router.post("/deleteAccount",function(req,res,next){
  var accountId  = req.body.accountId;
  if(!validParams(res, accountId,'参数不全')){
    return;
  }
  Accounts.findByIdAndRemove(accountId,modelCallback(res, COMMONMSG));
});

module.exports = router;
