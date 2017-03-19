var sql = require('mssql');
var db = {};

var config = {
  user: 'sa',
  password: '123456',
  server: 'localhost', // You can use 'localhost\\instance' to connect to named instance 
  database: 'ItcastSIM',
  
  options: {
    encrypt: false // Use this if you're on Windows Azure  
  }
};
db.query = function(sqlString, callback){
  var connection = new sql.Connection(config, function(err){
    if(err){
      console.log(err+'laosu1');
      return;
    }

    var request = new sql.Request(connection);
    request.query(sqlString, function(err, recordset){
      console.dir(recordset);
    })
    
  })
  connection.on('error', function(err){
    console.log(err+'laosu2');
  })
}
//执行sql,返回数据.  
// db.sql = function (sql, callBack) {
//   var connection = new mssql.Connection(config, function (err) {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     var ps = new mssql.PreparedStatement(connection);
//     ps.prepare(sql, function (err) {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       ps.execute('', function (err, result) {
//         if (err) {
//           console.log(err);
//           return;
//         }

//         ps.unprepare(function (err) {
//           if (err) {
//             console.log(err);
//             callback(err, null);
//             return;
//           }
//           callBack(err, result);
//         });
//       });
//     });
//   });
// };

module.exports = db;