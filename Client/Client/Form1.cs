

using System.Net.Sockets;
using System.Net;
using WebSocketSharp;

namespace Client
{   
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            string computerName = Environment.MachineName;

            string ipAddress = "";
            var host = Dns.GetHostEntry(Dns.GetHostName());
            foreach (var ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    ipAddress = ip.ToString();
                    break;
                }
            }
            string info;
            info = computerName + " IP:" + ipAddress;
            websocket.Websock_Client_Node();
            websocket.WebSocketClient.Send(info);

        }
        WebSocket websocket = new WebSocket();

        private void Connect_Click(object sender, EventArgs e)
        {
            
        }
    }
}
