var express = require('express');
var router = express.Router();

var dbget = require('../db/get.js');
var dball = require('../db/all.js');
var dbdo = require('../db/exec.js');

//Login page

router.get('/api/login',function(req,res,next){
	res.json({
		title: 'Login',
		login: req.session.login,
		// login: {
		//    name: "tttttt"
		// },
	});
});

router.post('/api/login',async function(req,res,next){

console.log("--------------------------");
console.log("--------------------------");
console.log("--------------------------");
	let account = req.body.account;
	console.log("入力されたアカウント：" + account);
	let pass = req.body.password;
	console.log("入力されたpassword：" + pass);

	let sql = "select * from users where account='"+account + "' and password='" + pass + "'";
	console.log("sql: " + sql);
						let record = await dbget.getRow(sql);
						console.log("record：" + record);
						if(record != undefined){
							req.session.login = record;
						}
						res.redirect('/api_index.html');
});

//Logout

router.get('/api/logout', function(req,res,next){
	req.session.login = undefined;
	res.redirect('/api_index.html');
});

// Admin (add new User)

router.get('/api/admin', async function(req,res,next){
	if(req.session.login == undefined){
		console.log("undefinedのほう");
		res.redirect('/users/login');
	}
	if(req.session.login.role != 'admin'){
		console.log("fuck");
		res.redirect('/api_index.html');
	}
	res.json({
		title: 'Admin',
		login: req.session.login,
		});
	});

router.post('/api/admin', async function(req,res,next){
	let account = req.body.account;
	let pass = req.body.password;
	let name = req.body.name;

	let sql = "insert into users (account,password,name,role) values('" + account +"','" + pass + "','" + name + "','user')";


	await dbdo.exec(sql);
	res.json({
		title:'Admin',
		login:req.session.login,
	});
});

//Show User List

router.get('/api/admin2', async function(req,res,next){
	if(req.session.login == undefined){
		res.redirect('/users/login');
		}
	if(req.session.logoin != undefined){
		res.redirect('/users/login');
	}
		let sql = 'select * from users';
		let records = await dball.getAllRows(sql);
		console.log('records=' + records);
		res.json({
			title:'Admin2',
			login: req.session.login,
			data:records,
		});
	});

//Delete User

router.get('/api/del_usr', async function(req,res,next){
	if(req.session.login == undefined){
		res.redirect('/api_index.html');
	}
	if(req.session.login.role != 'admin'){
		res.redirect('/api_index.html');
	}
	let id = req.query.id;
	console.log('unkooooooooooooooooo'+ req.query.id);
	let sql = 'delete from users where id =' + id;
	await dbdo.exec(sql);
	res.redirect('/users/api/admin2');
});

module.exports = router;
