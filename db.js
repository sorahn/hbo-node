var mysql       = require('mysql'),
    connection  = mysql.createConnection({
      host     : 'files2.bungie.org',
      user     : 'hbo',
      password : 'h4ckersb1t3',
      database : 'hbo',
    });

exports.query = function (sql, callback) {
  console.log('SQL: %s', sql);
  return connection.query(sql, callback);
}
