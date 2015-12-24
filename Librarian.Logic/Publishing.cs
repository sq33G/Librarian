using System;
using System.Collections.Generic;
using Librarian.Data;
using System.Linq;

namespace Librarian.Logic
{
    public class Publishing
    {
        public static IEnumerable<Publisher> GetAllPublishers()
        {
            using (LibraryDataContext ctx = new LibraryDataContext())
                return ctx.Publishers.ToList();
        }
        public static void AddPublisher(Publisher publisher)

        {
            using (LibraryDataContext ctx = new LibraryDataContext())
            {
                ctx.Publishers.Add(publisher);
                ctx.SaveChanges();
            }
        }

        public static void UpdatePublisher(Publisher persistentPublisher)
        {
            using (LibraryDataContext ctx = new LibraryDataContext())
            {
                ctx.Publishers.Attach(persistentPublisher);
                ctx.Entry(persistentPublisher).State = System.Data.Entity.EntityState.Modified;
                ctx.SaveChanges();
            }
        }

        public static void DeletePublisher(long publisherID)
        {
            using (LibraryDataContext ctx = new LibraryDataContext())
            {
                Publisher publisher = ctx.Publishers.Find(publisherID);
                ctx.Publishers.Remove(publisher);
                ctx.SaveChanges();
            }
        }
    }
}