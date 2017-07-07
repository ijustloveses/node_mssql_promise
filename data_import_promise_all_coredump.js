const sql = require('mssql')
var util = require('util')
var fs = require('fs')

var connstr = "mssql://test:test@test.com/test"

function dumpTable(pool, tbl) {
    return new Promise(function(resolve, reject) {
        pool.request()
            .query('select * from ' + tbl, (err, result) => {
                if (err) return reject(err)
                fs.writeFile(tbl + '.json', JSON.stringify(result), 'utf-8', function(err) {
                    if (err) return reject(err)
                    return resolve(tbl + ' done')
                })
            });
    })
}

const pool = new sql.ConnectionPool(connstr, err => {
    if (err) return console.log(err)
    Promise.all([dumpTable(pool, 'table1'),
                 dumpTable(pool, 'table2'),
                 dumpTable(pool, 'table3')])
        .then(function(res) {
            console.log(res)
            pool.close()
        }).catch(function(err) {
            console.log(err)
        })
})

pool.on('error', err => {
    if (err) {
        console.log(err)
    } else {
        console.log('done succ')
    }
});
