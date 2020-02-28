using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using QandAOnline.Models;

namespace QandAOnline.Hubs
{
    public class MessageHub2 : Hub
    {
        public Task Echo2(QuestAndAnswer message)
        {
            return Clients.All.SendAsync("send2", message);
        }
    }
}
