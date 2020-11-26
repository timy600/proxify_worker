#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./proxify_urls.db');

function update_status(sql_query) {
    db.run(sql_query);
}

const axios = require('axios');
let status = "PROCESSING";
let sql = "";
async function check_status(url_param) {
    await axios.get(url_param)

        .then(function (response) {
            var sql = `UPDATE urlStatus SET status = "DONE", http_code = "${response.status}" WHERE url = "${url_param}";`;
            update_status(sql);
            //return response.status;
        })
        .catch(function (error) {
            var sql = `UPDATE urlStatus SET status = "ERROR" WHERE url = "${url_param}";`;
            update_status(sql);
        });
}

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'url_queue';
        channel.assertQueue(queue, {
            durable: true
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
            // 1 GET NEXT AVAILABLE JOB ===================================================================
            var url = msg.content.toString();
            // 2 CALL THE URL FOR THE JOB =================================================================
            var http_code = check_status(url);
            // 3 STORE THE RETURNED STATUS ================================================================

        }, {
            noAck: true
        });
    });
});

