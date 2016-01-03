using System;
using System.Collections.Generic;
using System.Linq;

namespace Librarian.Data
{
    public class Mediafying
    {
        public static IEnumerable<MediaType> GetAllMediaTypes()
        {
            using (LibraryDataContext ctx = new LibraryDataContext())
                return ctx.MediaTypes.ToList();
        }
    }
}