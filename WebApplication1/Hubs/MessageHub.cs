using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using QandAOnline.Models;

namespace QandAOnline.Hubs
{
    public class MessageHub : Hub
    {
        public Task Echo(QuestAndAnswer message)
        {
            return Clients.All.SendAsync("send", message);
        }

    }
}
