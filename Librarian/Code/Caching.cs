using Librarian.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Caching;

namespace Librarian
{
    public static class Caching
    {
        private static Dictionary<string, Dictionary<int,string>> cachedLookups
        {
            get
            {
                Dictionary<string, Dictionary<int, string>> c = (Dictionary<string, Dictionary<int, string>>)HttpContext.Current.Cache["lookups"];

                if (c != null)
                    return c;

                c = GenerateCachedLookups();
                HttpContext.Current.Cache["lookups"] = c;

                return c;
            }
        }

        private static Dictionary<string, Dictionary<int, string>> GenerateCachedLookups()
        {
            return LookingUp.GetAllLookups()
                .GroupBy(look => look.LookupName)
                .ToDictionary(look => look.Key, look => look.ToDictionary(up => up.ID, up => up.Value)); 
        }

        public static Dictionary<int,string> GetLookup(string name)
        {
            return cachedLookups[name];
        }
    }
}