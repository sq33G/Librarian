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

        public static Author GetAuthor(long id)
        {
            using (Data.LibraryDataContext ctx = new Data.LibraryDataContext())
                return ctx.Authors.Single(author => author.ID == id);
        }

        public static void AddAuthor(Data.Author author)
        {
            using (Data.LibraryDataContext ctx = new LibraryDataContext())
            {
                ctx.Authors.Add(author);
                ctx.SaveChanges();
            }
        }

        public static void DeleteAuthor(int id)
        {
            using (Data.LibraryDataContext ctx = new LibraryDataContext())
            {
                Author a = ctx.Authors.Find(id);
                ctx.Authors.Remove(a);
                ctx.SaveChanges();
            }
        }
    }
}
