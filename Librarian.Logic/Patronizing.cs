using Librarian.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Librarian.Logic
{
    public class Patronizing
    {
        public static IEnumerable<Patron> GetAllPatrons()
        {
            using (LibraryDataContext ctx = new LibraryDataContext())
                return ctx.Patrons.ToList();
        }

        public static void AddPatron(Patron patron)
        {
            using (LibraryDataContext ctx = new LibraryDataContext())
            {
                ctx.Patrons.Add(patron);
                ctx.SaveChanges();
            }
        }

        public static void UpdatePatron(Patron patron)
        {
            using (LibraryDataContext ctx = new LibraryDataContext())
            {
                ctx.Patrons.Attach(patron);
                ctx.Entry(patron).State = System.Data.Entity.EntityState.Modified;
                ctx.SaveChanges();
            }
        }

        public static void DeletePatron(long id)
        {
            using (LibraryDataContext ctx = new LibraryDataContext())
            {
                Patron toDelete = ctx.Patrons.Find(id);
                ctx.Patrons.Remove(toDelete);
                ctx.SaveChanges();
            }
        }
    }
}