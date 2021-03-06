#!/usr/bin/env node

// SQLITE DATABASE CONNECTION
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./proxify_urls.db');

const sql = 'SELECT * FROM urlStatus';

// SEND TO THE QUEUE
var amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var exchange = 'logs';

        channel.assertExchange(exchange,'fanout', {
            durable: false
        });

        // SELECT ALL ROWS AND START PROCESSING
        db.all(sql,(err, rows ) => {
            if (err) {
                throw err;
            }
            rows.forEach( row => {
                db.run('UPDATE urlStatus SET status = "PROCESSING" WHERE url = "${row.url}"');
                var msg = process.argv.slice(2).join(' ') || row.url;
                channel.publish(exchange, '', Buffer.from(msg));
                console.log(" [x] Sent %s", msg);
            });
        });

    });
    // Close the database connection
    setTimeout(function() {
        connection.close();
        process.exit(0);
        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Close the database connection.')
        });
    }, 500);
});