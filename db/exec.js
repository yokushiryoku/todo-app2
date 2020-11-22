exports.exec = function(sql){
  let sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database('todo.db');

  return new Promise((resolve,reject)=> {
    db.exec(sql,(stat, err) => {
      resolve(stat);
    });
  });
  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
})
}
