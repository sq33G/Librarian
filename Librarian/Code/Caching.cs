using Librarian.Data;
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

        private static Dictionary<long, string> cachedAuthors
        {
            get
            {
                Dictionary<long, string> a = (Dictionary<long, string>)HttpContext.Current.Cache["authors"];

                if (a != null)
                    return a;

                a = GenerateCachedAuthors();
                HttpContext.Current.Cache["authors"] = a;

                return a;
            }
        }

        private static Dictionary<long, string> GenerateCachedAuthors()
        {
            return Authoring.GetAllAuthors().ToDictionary(a => a.ID, a => a.ToString());
        }

        public static Dictionary<long,string> GetAuthors()
        {
            return cachedAuthors;
        }

        internal static void AddAuthor(Author author)
        {
            Dictionary<long, string> fromCache = cachedAuthors;
            if (fromCache.ContainsKey(author.ID))
                return;

            fromCache.Add(author.ID, author.ToString());
        }

        private static Dictionary<int, string> cachedMediaTypes
        {
            get
            {
                Dictionary<int, string> c = (Dictionary<int, string>)HttpContext.Current.Cache["mediaTypes"];

                if (c != null)
                    return c;

                c = GenerateCachedMediaTypes();
                HttpContext.Current.Cache["mediaTypes"] = c;

                return c;
            }
        }

        private static Dictionary<int, string> GenerateCachedMediaTypes()
        {
            return Mediafying.GetAllMediaTypes().ToDictionary(m => m.ID, m => m.Name);
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

        internal static string GetMediaType(int mediaTypeID)
        {
            return cachedMediaTypes[mediaTypeID];
        }
    }
}