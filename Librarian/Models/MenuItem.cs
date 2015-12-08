using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Librarian.Models
{
    public class MenuItem
    {
        public string IconClass { get; set; }
        public string Text { get; set; }
        public string Controller { get; set; }
        public string Action { get; set; }
        public Dictionary<string,string> Args { get; set; }

    }
}