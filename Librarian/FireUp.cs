using Microsoft.Owin.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Librarian
{
    public static class FireUp
    {
        private static IDisposable app;

        public static void Go()
        {
            app = WebApp.Start<Startup>("http://*:7600/");
        }
    }
}