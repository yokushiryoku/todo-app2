var express = require('express');
var router = express.Router();

var dbget = require('../db/get.js');
var dball = require('../db/all.js');
var dbdo = require('../db/exec.js');


/* User Home */
router.get('/', async function(req, res, next) {
  //loginが定義されていない場合、ログイン画面に戻す
  if(req.session.login == undefined){
    res.redirect('/users/login');
  }
  //console.log('req.session.login.id:'+req.session.login.id);
console.log('req.session.login.id='+req.session.login.id);
  let sql =  "select *,datetime(finished,'+9 hours') from todo where user_id="+req.session.login.id+ ' and checked = 0 and finished > CURRENT_TIMESTAMP order by finished asc limit 10';
  let records = await dball.getAllRows(sql);
  let sql2 =  "select *,datetime(finished,'+9 hours') from todo where user_id="+req.session.login.id+ ' and checked = 0 and finished < CURRENT_TIMESTAMP order by finished asc limit 10';;
  let records2 = await dball.getAllRows(sql2);

  //console.log(data[i]["datetime(finished,'+9 hours')"] + ' '+data[i].title);

  res.render('index',{
    title:'ToDo',
    login:req.session.login,
    data: records,
    data2: records2,
  });
});

/* Add New ToDo */
router.get('/add', function(req, res, next) {
  //loginが定義されていない場合、ログイン画面に戻す
  if(req.session.login == undefined){
    res.redirect('/users/login');
  }
  res.render('add',{
    title: 'Add ToDo',
    login:req.session.login,
  });
});

router.post('/add',async function(req,res,next){
  let uid = req.session.login.id;
  let title = req.body.title;
  let memo = req.body.memo;
  let finished = req.body.finished;
  let sql = "insert into todo (user_id,title,memo,finished) values("+ uid + ",'" + title + "','" + memo+"',datetime('"+finished+"','-9 hours'))";
  await dbdo.exec(sql);
  res.redirect('/');
});

/* View ToDo Detail */

router.get('/view',async function(req,res,next){
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
  res.render('view',{
    title: 'Show ToDo',
    login: req.session.login,
    data: records,
  });
});

/* Set checked to TRUE */
router.get('/complete', async function(req,res,next){
  if(req.session.login == undefined){
    res.redirect('/users/login');
  }
  let uid = req.session.login.id;
  let id = req.query.id;
  let sql = "update todo set checked=1 where user_id=" + uid + "and id =" + id;
  console.log(sql);
  await dbdo.exec(sql);
  res.redirect('/');
});

/* User home */
router.get('/user', async function(req,res,next){
  if(req.session.login == undefined){
    res.redirect('/users/login');
  }
  let sql =  "select *,datetime(finished,'+9 hours') from todo where user_id="+req.session.login.id+ 'order by finished asc';
  let records = await dball.getAllRows(sql);
  res.render('user',{
      title:'User Home',
      login:req.session.login,
      data:records,
    });
  });

  router.get('/del_todo',async function(req,res,next){
    if(req.session.login == undefined){
      res.redirect('/users/login');
    }
    let uid = req.session.login.id;
    let id = req.query.id;
    let sql = "delete from todo where user_id=" + uid + "and user_id =" + id;
    console.log(sql);
    await dbdo.exec(sql);
    res.redirect('/user');
  });

module.exports = router;
