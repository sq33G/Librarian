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

        public MvcHtmlString Raw(string name)
        {
            return new MvcHtmlString(JsonConvert.SerializeObject(Named(name).Select(p => new Models.Lookup(p))));
        }

        /// <summary>
        /// Returns cached list of all authors in { name, id } format
        /// </summary>
        /// <returns></returns>
        public MvcHtmlString GetAuthors()
        {
            return new MvcHtmlString(JsonConvert.SerializeObject(Caching.GetAuthors().Select(p => new
            {
                name = p.Value,
                id = p.Key
            })));
        }
    }
}