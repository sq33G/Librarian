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

        public static void AddAuthor(Data.Author author)
        {
            using (Data.LibraryDataContext ctx = new LibraryDataContext())
            {
                ctx.Authors.Add(author);
                ctx.SaveChanges();
            }
        }

        public static void DeleteAuthor(long id)
        {
            using (Data.LibraryDataContext ctx = new LibraryDataContext())
            {
                Author a = ctx.Authors.Find(id);
                ctx.Authors.Remove(a);
                ctx.SaveChanges();
            }
        }

        public static void UpdateAuthor(Author author)
        {
            using (Data.LibraryDataContext ctx = new LibraryDataContext())
            {
                ctx.Authors.Attach(author);
                ctx.Entry(author).State = System.Data.Entity.EntityState.Modified;
                ctx.SaveChanges();
            }
        }
    }
}
