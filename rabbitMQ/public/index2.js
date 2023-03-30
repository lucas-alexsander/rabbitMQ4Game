console.log('Hello World!');

import express, { json } from "express";
const app = express();
const PORT = process.env.PORT || 4001;

app.use(json());

import { connect } from "amqplib";
var channel, connection;


connectQueue() // call connectQueue function
async function connectQueue() {
    try {

        connection = await connect("amqp://localhost:5672");
        channel = await connection.createChannel()
        
        // connect to 'test-queue', create one if doesnot exist already
        await channel.assertQueue("test-queue")
        console.log("connected to queue")
        
    } catch (error) {
        console.log(error)
    }
}

const sendData = async (data) => {
    // send data to queue
    await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
        
    // close the channel and connection
    await channel.close();
    await connection.close();
}

app.get("/send-msg", (req, res) => {
    const data = {
        title: "Ola Mundo",
        author: "Lucas Alexsander"
    }

    sendData(data);

    console.log("A message is sent to queue")
    res.send("Message Sent");
    
})


app.listen(PORT, () => console.log("Server running at port " + PORT));

/*
amqp.connect('amqp://172.17.0.1:15672', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });
    });
});
*/