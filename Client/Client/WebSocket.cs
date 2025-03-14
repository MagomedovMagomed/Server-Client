using System;
using System.Net;
using System.Net.Sockets;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp;

namespace Client
{
    class WebSocket
    {
        public event Action<string> OnMessageReceived;

        Uri serverUri = new Uri("ws://localhost:8080");
        bool Connect_Disconnect = false;

        public WebSocketSharp.WebSocket WebSocketClient = null;
        public void Websock_Client_Node()
        {
            if(Connect_Disconnect == false)
            {
                try
                {
                    WebSocketClient = new WebSocketSharp.WebSocket(serverUri.ToString());
                    WebSocketClient.OnMessage += wsServer_NewDataReceived;
                    WebSocketClient.OnOpen += wsServer_NewSessionConnected;
                    WebSocketClient.OnError += wsServer_OnError;
                    WebSocketClient.OnClose += wsServer_Disconnect;
                    WebSocketClient.Connect();
                    Console.WriteLine("Connection Open");
                    Connect_Disconnect = true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    Console.WriteLine("Не получилось подключиться");
                    Connect_Disconnect= false;
                }
            }
        }
        private void wsServer_Disconnect(object sender, CloseEventArgs e)
        {
            Console.Write("Соединение закрыто: " + e.Reason);
            OnMessageReceived?.Invoke("Отключено от сервера\n");
            Connect_Disconnect = false;
        }
        private void wsServer_OnError(object sender, WebSocketSharp.ErrorEventArgs e)
        {
            Console.WriteLine(e.Exception);
        }
        private void wsServer_NewSessionConnected(object sender, EventArgs e)
        {
            WebSocketClient.Send("User connected");
        }
        private void wsServer_NewDataReceived(object sender, MessageEventArgs e)
        {
            string result = e.Data.ToString();
            OnMessageReceived?.Invoke("Получено: " + result);
        }
    }
}
