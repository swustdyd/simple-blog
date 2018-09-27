import http from 'http'
import {server} from 'websocket'

const WebSocketServer = server;

export default () => {
    const httpServer = http.createServer(function(request, response) {
        console.log((new Date()) + ' Received request for ' + request.url);
        response.writeHead(404);
        response.end();
    });

    httpServer.listen(8081, function() {
        console.log((new Date()) + ' Server is listening on port 8081');
    });

    const wsServer = new WebSocketServer({
        httpServer,
        autoAcceptConnections: false
    })

    wsServer.on('request', function(request) {        
        const connection = request.accept('echo-protocol', request.origin);
        const {key} = request;
        if(!global.socketConnections){
            global.socketConnections = new Map();
        }
        if(!global.socketConnections.get(key)){
            global.socketConnections.set(key, connection);
        }
        console.log((new Date()) + ' Connection accepted.');
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data);
                const data = JSON.parse(message.utf8Data);
                if(data.type === 'broadcast'){
                    global.socketConnections.forEach((con) => {
                        con.sendUTF(message.utf8Data);
                    });
                }else{
                    connection.sendUTF(message.utf8Data);
                }
            }else if (message.type === 'binary') {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                connection.sendBytes(message.binaryData);
            }
        });
        connection.on('close', function() {
            global.socketConnections.delete(key);
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    });
}