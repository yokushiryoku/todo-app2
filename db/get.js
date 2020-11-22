exports.getRow = function(sql){
  //sqlite3の呼び出し
  let sqlite3 = require('sqlite3').verbose();
  //sqlite3.Database('');でtodo.dbを取り出している
  let db = new sqlite3.Database('todo.db');

  return new Promise((resolve,reject)=>{
    db.get(sql,(err,row)=>{
      resolve(row);
    });
  });
  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
})
}
