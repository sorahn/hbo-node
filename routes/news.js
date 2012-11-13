var db        = require('../db');
var util      = require('util');
var moment    = require('moment');

exports.post = function(req, res) {
  req.assert('id', 'Invalid post id').isInt();

  var errors = req.validationErrors();
  if( errors ) {
    res.send('There have been validation errors: ' + util.inspect(errors), 500);
    return;
  }

  var sql = util.format('SELECT * FROM hbonews WHERE record_number = %d', req.params.id);
  query = db.query(sql, function(err, rows) {
    if( err ) throw err;
    res.send(rows);
  });
};

exports.posts = function(req, res) {

  var now     = moment.utc(),
      params  = req.params;

  console.log('NOW: %s', now);

  if( params.year ) {
    req.assert('year', 'Invalid Year').isNumeric().len(4);
  }

  if( params.month ) {
    req.assert('month', 'Invalid Month').isNumeric().len(2);
  }

  if( params.day ) {
    req.assert('day', 'Invalid Day').isNumeric().len(2);
  }

  var errors = req.validationErrors();
  if( errors ) {
    res.send('There have been validation errors: ' + util.inspect(errors), 500);
    return;
  }

  var params  = req.params,
      year    = params.year || now.format('YYYY'),
      month   = params.month || now.format('MM'),
      day     = params.day;

  var where = util.format('YEAR(date) = "%d" AND MONTH(date) = "%d"', year, month);
  if( day ) {
    where = util.format('%s AND DAYOFMONTH(date) = "%d"', where, day);
  }

  var sql = util.format('SELECT * FROM hbonews WHERE %s ORDER BY record_number DESC', where);

  query = db.query(sql, function(err, rows) {
    if( err ) throw err;
    res.send(rows);
  });
};

// CREATE TABLE IF NOT EXISTS `hbonews` (
//   `record_number` mediumint(8) unsigned NOT NULL DEFAULT '0',
//   `date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
//   `news_item` mediumtext,
//   `headline` text,
//   `poster` varchar(15) NOT NULL DEFAULT '',
//   `platform` varchar(15) NOT NULL DEFAULT '',
//   `posttype` varchar(30) NOT NULL DEFAULT '',
//   PRIMARY KEY (`record_number`),
//   KEY `platform` (`platform`),
//   FULLTEXT KEY `news_item` (`news_item`,`headline`)
// ) ENGINE=MyISAM DEFAULT CHARSET=latin1;
