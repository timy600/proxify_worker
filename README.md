# proxify_worker

### Starting a worker
The assignment stated that I was supposed to use the language I was applying for, in this case **Node.js**. To create the broker I decided to work with the library amqplib, which enables me to handle **RabbitMQ**. 

If you don't have RabbitMQ installed you can just experiment with a docker image: ```docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management```

To start the worker from the command line:
```node worker.js```

To check the url http_code I used the **axios** library. It then proceeds to change the status to either DONE or ERROR in the urlStatus table. 
If you open several workers in multiple command lines, you can follow them by tipping ```sudo rabbitmqctl list_bindings ``` (drop the sudo if using Windows).

### Database: SQLite3
The assignment specified the use of a database table (so no Neo4J in this case). I decided to use a basic sqlite3 database. The table is called **urlStatus**. I leave a script to populate it with a few test rows in the model folder.

### Sending jobs
Here comes the magic. Or, well, the basic functionality that you asked for.

I made one basic script for this assignment that just reads the entire **urlStatus** table and process each row.
Just run ```node read_table.js``` in a new terminal. Once a job as been assigned to as particular url, its status will be changed to "PROCESSING", so if the worker is not launched, you should see an entire table with this status.

