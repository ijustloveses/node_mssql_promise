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

function recursive_promise(pool, tbl, i, tables) {
    dumpTable(pool, tbl).then(function(val) {
        console.log(val)
        if (i === (tables.length - 1)) {
            pool.close()
        } else {
            j = i + 1
            recursive_promise(pool, tables[j], j, tables)
        }
    }).catch(function(err) {
        console.log(err)
    })
}

const pool = new sql.ConnectionPool(connstr, err => {
    if (err) return console.log(err)
    tables = ['table1', 'table2']
    recursive_promise(pool, tables[0], 0, tables)
})

pool.on('error', err => {
    if (err) {
        console.log(err)
    } else {
        console.log('done succ')
    }
});
