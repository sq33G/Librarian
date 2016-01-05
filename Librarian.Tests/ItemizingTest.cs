using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Librarian.Logic;
using System.Linq;
using System.Data.Entity;
using System.Collections.Generic;

namespace Librarian.Tests
{
    [TestClass]
    public class ItemizingTest
    {
        [TestMethod]
        public void TestFilter()
        {
            //List<Data.Item> items;
            //string f = "tre";

            //using (Librarian.Data.LibraryDataContext ctx = new Data.LibraryDataContext())
            //    items = ctx.Items
            //        .Include(i => i.Authors)
            //        .Include(i => i.Editions.Select(ed => ed.Copies))
            //        .Include(i => i.ItemSubjects)
            //        .Include(i => i.Reserves)
            //        .Where(i => !i.Deleted).Where(i => i.Title.Contains(f))
            //        .OrderBy(i => i.Title)
            //        .Skip(0).Take(20)
            //        .ToList();

            //    int t;
            Itemizing.GetAllItems("chinuch", 20, 0);
        }
    }
}
