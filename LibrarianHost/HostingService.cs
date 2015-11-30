using Librarian;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;

namespace LibrarianHost
{
    public partial class HostingService : ServiceBase
    {
        public HostingService()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            FireUp.Go();
        }

        protected override void OnStop()
        {
        }
    }
}
