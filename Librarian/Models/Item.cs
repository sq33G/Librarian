using System;
using System.Collections.Generic;

namespace Librarian.Models
{
    public class Item
    {
        public long ID { get; set; }

        public string AuthorsDesc { get; set; }
        public IEnumerable<Author> Authors { get; set; }

        public string CallNum { get; set; }
        public bool Deleted { get; set; }

        public int EditionsCount { get; set; }
        public int CopiesCount { get; set; }
        public IEnumerable<Edition> Editions { get; set; }

        public IEnumerable<Lookup> Subjects { get; set; }

        public DateTime LastCheckedOut { get; set; }
        public Lookup Location { get; set; }
        public Lookup MediaType { get; set; }
        public bool Reference { get; set; }

        public int ReservesCount { get; set; }
        public IEnumerable<Reserve> Reserves { get; set; }

        public bool Restricted { get; set; }
        public string Summary { get; set; }
        public int TimesCheckedOut { get; set; }
        public string Title { get; set; }
    }
}