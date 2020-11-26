const sqlite3 = require('sqlite3').verbose();

// open database in memory
let db = new sqlite3.Database('./../proxify_urls.db');

// INSERT ROWS
function run_query(sql_query) {
    db.run(sql_query);
}

const url_list = ['https://youtube.com', 'https://en.wikipedia.org', 'https://twitter.com', 'https://facebook.com',
'https://amazon.com', 'https://yelp.com', 'https://imdb.com', 'https://fandom.com',
'https://pinterest.com', 'https://tripadvisor.com', 'https://instagram.com',
'https://washingtonpost.com', 'https://usps.com', 'https://office.com', 'https://live.com',
'https://ca.gov', 'https://macys.com', 'https://wyfair.com', 'https://hulu.com',
'https://paypal.com', 'https://go.com', 'https://groupon.com', 'https://xfinity.com',
'https://npr.org', 'https://roblox.com', 'https://chase.com', 'https://ign.com',
'https://wikihow.com', 'https://paris.com', 'https://madrid.com', 'https://quefaire.com'
]

url_list.forEach(url => {
    var sql = `INSERT INTO urlStatus VALUES ( NULL, "${url}", "NEW", NULL)`;
    run_query(sql);
    console.log(sql)
});

// Close the database connection ==============================
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Close the database connection.')
});
