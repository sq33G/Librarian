using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Librarian.Models
{
    public class Lookup
    {
        public int Value { get; set; }
        public string Text { get; set; }

        public Lookup()
        {

        }

        public Lookup(int value, string text)
        {
            Value = value;
            Text = text;
        }

        public Lookup(KeyValuePair<int, string> p)
        {
            Value = p.Key;
            Text = p.Value;
        }
    }
}