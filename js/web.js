//web.js
const fs = require('fs');
const http = require('http');
const path = require('path');
const Websocket = require('websocket').server;

const index = fs.readFileSync('./index.html', 'utf8');

const server = http.createServer((req, res) =>{
    let filePath = '.' + req.url;
    if(filePath === './')
    {
        filePath = './index.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    if(extname === '.js')
    {
        contentType  = 'text.avascript';
    }

    fs.readFile(filePath, (err, content)=> {
        if(err)
        {
            res.writeHead(404);
            res.end;
        }
        else
        {
            res.writeHead(200, {'Content-Type': contentType});
            res.end(content, 'utf-8');
        }
    })

});

server.listen(8080, () =>{
    console.log('Сервер запущен на порту 8080');
});

const ws = new Websocket({
    httpServer: server,
    autoAcceptConnections: false
});

const clients = [];

ws.on('request',  req => {
    const connection = req.accept(null, req.origin);
    clients.push(connection);
    console.log('Клиент подключен: ' + connection.remoteAddress);

    clients.forEach(client =>{
        if(client !== connection && client.connected)
        {
            client.sendUTF('Новый пользователь подключился (Всего: ' + clients.length + ')');
        }
    });

    // В серверном коде (web.js)
    connection.on('connect', () => {
        connection.sendUTF("CONNECTION_OPEN");
    });

    connection.on('message', message => {
        const data = message.utf8Data
        clients.forEach(client  => {
            if (client.connected) 
            {
                client.sendUTF(data);
            }
        });
    });

    connection.on('close', (reasonCode, description) => {
        const index = clients.indexOf(connection);
        if (index !== -1) {
            clients.splice(index, 1);
        }
        console.log('Клиент отключен: ' + connection.remoteAddress);
        console.log('Причина: ' + description + ' (код: ' + reasonCode + ')');

        // Уведомляем оставшихся клиентов
        clients.forEach(client => {
            if (client.connected) {
                client.sendUTF('Пользователь отключился (Осталось: ' + clients.length + ')');
            }
        });
    });
});
