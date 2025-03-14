//index.js
const status = document.getElementById('status');
const message = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');

const ws = new WebSocket('ws://localhost:8080');

ws.onopen = (e) => {
    status.innerHTML = "CONNECTION OPEN";
    console.log("WebSocket connected!"); // Для отладки
  };
  
ws.onmessage = messageReceived;
ws.onerror = (error) => { // Исправленная функция
    console.error("WebSocket error:", error);
    status.innerHTML = "ERROR";
  };
ws.onclose = connectionClosed;

function printMessage(value)
{
    const li = document.createElement('li');
    li.innerHTML = value;
    message.appendChild(li);
}

form.addEventListener('submit', e=>{
    e.preventDefault();
    ws.send(input.value);
    printMessage("Message: " + input.value);
    input.value='';
})

function messageReceived(e)
{
    printMessage("Client Message: " + e.data);
}

function connectionClosed()
{
    status.innerHTML = "CONNECTION CLOSE";
    console.log("Соединение закрыто.");
}

// if(performance.navigation.type == 1)
// {
//     connectionClosed();
// }