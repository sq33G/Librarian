using System;
using System.Collections.Generic;
using Librarian.Data;
using System.Linq;
using System.Data.Entity;

namespace Librarian.Logic
{
    public class Itemizing
    {
        //almost certainly not right! too heavy
        public static IEnumerable<Item> GetAllItems()
        {
            using (LibraryDataContext ctx = new LibraryDataContext())
            {
                return AllItems(ctx).OrderBy(item => item.Title).ToList();
            }
        }

        public static IEnumerable<Item> GetAllItems(string filter, int pageSize, int pageNum)
        {
            using (LibraryDataContext ctx = new LibraryDataContext())
                return Page(Filter(ctx, AllItems(ctx), filter).OrderBy(item => item.Title),
                    pageSize, pageNum).ToList();
        }

        private static IQueryable<Item> AllItems(LibraryDataContext ctx)
        {
            return ctx.Items.Include(item => item.Authors)
                            .Include(item => item.Editions.Select(edition => edition.Copies))
                            .Include(item => item.ItemSubjects)
                            .Include(item => item.Reserves)
                            .Where(item => !item.Deleted);
        }

        public static Item GetItem(long id)
        {
            using (LibraryDataContext ctx = new LibraryDataContext())
            {
                Item found = ctx.Items.Find(id);
                ctx.Entry(found).Collection(item => item.Authors).Load();
                ctx.Entry(found).Collection(item => item.Editions).Load();
                foreach (Edition ed in found.Editions)
                    ctx.Entry(ed).Collection(edi => edi.Copies).Load();
                ctx.Entry(found).Collection(item => item.ItemSubjects).Load();
                ctx.Entry(found).Collection(item => item.Reserves).Load();

                return found;
            }
        }

        private static IQueryable<Item> Page(IQueryable<Item> items, int pageSize, int pageNum)
        {
            //pagesTotal = (int)Math.Ceiling((float)items.Count() / (float)pageSize);
            return items.Skip(pageSize * pageNum).Take(pageSize);
        }

        private static IQueryable<Item> Filter(LibraryDataContext ctx, IQueryable<Item> items, string filter)
        {
            if (String.IsNullOrWhiteSpace(filter))
                return items;

            return items.Where(item => item.Title.Contains(filter)
                                       ||
                                       item.ItemSubjects.Any(itemSubj => ctx.Lookups.FirstOrDefault(lookup => lookup.LookupName == "Subject" &&
                                                                                                              lookup.ID == itemSubj.LU_Subject).Value.Contains(filter)) 
                                       ||
                                       item.Authors.Any(author => (author.FirstName + " " + author.LastName + " " + author.Suffix).Contains(filter)));
        }
    }
}