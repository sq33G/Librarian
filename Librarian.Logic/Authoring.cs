using Librarian;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Librarian.Logic
{
    public static class Authoring
    {
        public static IEnumerable<Data.Author> GetAllAuthors()
        {
            using (Data.LibraryDataContext ctx = new Data.LibraryDataContext())
                return ctx.Authors.ToList();
        }
    }
}
