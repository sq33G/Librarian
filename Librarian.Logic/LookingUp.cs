using Librarian.Data;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librarian.Logic
{
    public static class LookingUp
    {
        public static IEnumerable<Lookup> GetAllLookups()
        {
            using (LibraryDataContext ctx = new LibraryDataContext())
            {
                return ctx.Lookups.ToList();
            }
        }

        public static void Add(Lookup lookup)
        {
            using (LibraryDataContext ctx = new LibraryDataContext())
            {
                using (DbContextTransaction transaction = ctx.Database.BeginTransaction())
                {
                    int nextID = ctx.Lookups.Where(l => l.LookupName == lookup.LookupName).Max(l => l.ID) + 1;
                    lookup.ID = nextID;

                    ctx.Lookups.Add(lookup);
                    ctx.SaveChanges();
                }
            }
        }

        public static void Update(Lookup lookup)
        {
            using (LibraryDataContext ctx = new LibraryDataContext())
            {
                ctx.Lookups.Attach(lookup);
                ctx.Entry(lookup).State = System.Data.Entity.EntityState.Modified;
                ctx.SaveChanges();
            }
        }

        public static void Delete(Lookup lookup)
        {
            using (LibraryDataContext ctx = new LibraryDataContext())
            {
                ctx.Lookups.Attach(lookup);
                ctx.Entry(lookup).State = System.Data.Entity.EntityState.Deleted;
                ctx.SaveChanges();
            }
        }
    }
}
