//web.js
const fs = require('fs');
const http = require('http');
const path = require('path');
const Websocket = require('websocket').server;

const index = path.join(__dirname, '../index.html');

const staticFilesPath = path.join(__dirname, '../'); 

const server = http.createServer((req, res) =>{
    let filePath = path.join(staticFilesPath, req.url);
    if(req.url === '/')
    {
        filePath = index;
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    if(extname === '.js')
    {
        contentType  = 'text.avascript';
    }
    if (extname === '.css') 
    {
        contentType = 'text/css';
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
            // if (client.connected)
            if (client !== connection && client.connected) 
            {
                client.sendUTF(data);
            }
            else 
            {
                // Удаляем неактивных клиентов
                const index = clients.indexOf(client);
                if (index !== -1) 
                {
                    clients.splice(index, 1);
                }
            }
        });
    });

    connection.on('close', (reasonCode, description) => {
        const index = clients.indexOf(connection);
        if (index !== -1) {
            clients.splice(index, 1);
        }
        console.log('Клиент отключен. Осталось' + clients.length);
        console.log('Причина: ' + description + ' (код: ' + reasonCode + ')');

        // Уведомляем оставшихся клиентов
        clients.forEach(client => {
            if (client.connected) {
                client.sendUTF('Пользователь отключился (Осталось: ' + clients.length + ')');
            }
        });
    });

    connection.on('error', (error) => {
        console.error('Ошибка:', error);
        const index = clients.indexOf(connection);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    });
});
