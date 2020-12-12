var express = require('express');
var router = express.Router();

var dbget = require('../db/get.js');
var dball = require('../db/all.js');
var dbdo = require('../db/exec.js');

// 環境変数 TEST=true だった場合にはテストとみなし id=1 のユーザーとしてログイン済みとするための処理
router.use(function (req, res, next) {
  const isTest = process.env.TEST === "true";
  if (isTest) {
    req.session.login = {id: 1}
  }
  next();
});

// GET http://localhost:3000/api/hello/
router.get('/api/hello',function(req,res){
    res.json({
        message:"Hello,world"
    });
});

/* User Home */
router.get('/api/index', async function(req, res, next) {
  //loginが定義されていない場合、ログイン画面に戻す
  if(req.session.login == undefined) {
    res.redirect('/users/login');
  }
  console.log('req.session.login.id:'+req.session.login.id);
console.log('req.session.login.id='+ req.session.login.id);
  let sql =  "select *,datetime(finished,'+9 hours') from todo where user_id="+req.session.login.id+ ' and checked = 0 and finished > CURRENT_TIMESTAMP order by finished asc limit 10';
  let records = await dball.getAllRows(sql);
  let sql2 =  "select *,datetime(finished,'+9 hours') from todo where user_id="+req.session.login.id+ ' and checked = 0 and finished < CURRENT_TIMESTAMP order by finished asc limit 10';;
  let records2 = await dball.getAllRows(sql2);

  //console.log(data[i]["datetime(finished,'+9 hours')"] + ' '+data[i].title);

  res.json({
    title:'ToDo',
    login:req.session.login,
    data: records,
    data2: records2,
  });
});

/* Add New ToDo */
router.get('/api/add', function(req, res, next) {
  //loginが定義されていない場合、ログイン画面に戻す
  if(req.session.login == undefined){
    res.redirect('/users/login');
  }
  res.json({
    title: 'Add ToDo',
    login:req.session.login,
  });
});

router.post('/api/add',async function(req,res,next){
  let uid = req.session.login.id;
  let title = req.body.title;
  let memo = req.body.memo;
  let finished = req.body.finished;
  let sql = "insert into todo (user_id,title,memo,finished) values("+ uid + ",'" + title + "','" + memo+"',datetime('"+finished+"','-9 hours'))";
  await dbdo.exec(sql);
  res.status(201).json();
});

/* View ToDo Detail */

router.get('/api/view',async function(req,res,next){
  if(req.session.login == undefined){
    res.redirect('/users/login');
  }
  let uid = req.session.login.id;
  console.log('uid='+ uid);
  let id = req.query.id;
  console.log('id='+id);
  let sql = "select *,datetime(finished,'+9 hours') from todo where user_id =" + uid + " and checked=0 and id="+id;
  console.log(sql);
  let records = await dbget.getRow(sql);

  console.log(records);
  res.json({
    title: 'Show ToDo',
    login: req.session.login,
    data: records,
  });
});

/* Set checked to TRUE */
router.get('/api/complete/', async function(req,res,next){
  if(req.session.login == undefined){
    res.redirect('/users/login');
  }
  let uid = req.session.login.id;
  let id = req.query.id;
  let sql = "update todo set checked=1 where user_id=" + uid + " and id =" + id;
  console.log(sql);
  await dbdo.exec(sql);
  res.redirect('/');
});

/* User home */
router.get('/api/user', async function(req,res,next){
  if(req.session.login == undefined){
    res.redirect('/users/login');
  }
  let sql =  "select *,datetime(finished,'+9 hours') from todo where user_id="+req.session.login.id+ ' order by finished asc';
  let records = await dball.getAllRows(sql);
  res.json({
      title:'User Home',
      login:req.session.login,
      data:records,
    });
  });

  router.get('/api/del_todo',async function(req,res,next){
    if(req.session.login == undefined){
      res.redirect('/users/login');
    }
    let uid = req.session.login.id;
    let id = req.query.id;
    let sql = "delete from todo where user_id=" + uid + " and id=" + id;
    console.log(sql);
    await dbdo.exec(sql);
    res.redirect('/user');
  });

module.exports = router;
