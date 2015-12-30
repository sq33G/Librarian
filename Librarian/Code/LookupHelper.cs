using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Librarian
{
    public class LookupHelper
    {
        public Dictionary<int,string> Named(string name)
        {
            return Caching.GetLookup(name);
        }

        public HtmlString Raw(string name)
        {
            return new HtmlString(JsonConvert.SerializeObject(Named(name).Select(p => new Models.Lookup(p))));
        }
    }
}