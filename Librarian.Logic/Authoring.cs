using Librarian;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Librarian.Data;

namespace Librarian.Logic
{
    public static class Authoring
    {
        public static IEnumerable<Data.Author> GetAllAuthors()
        {
            using (Data.LibraryDataContext ctx = new Data.LibraryDataContext())
                return ctx.Authors.ToList();
        }

        public static Author GetAuthor(int id)
        {
            using (Data.LibraryDataContext ctx = new Data.LibraryDataContext())
                return ctx.Authors.Single(author => author.ID == id);
        }
    }
}
