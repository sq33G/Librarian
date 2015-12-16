using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Librarian
{
    public class AngularHelper
    {
        public string DashedToCamelCase(string dashed)
        {
            return String.Join("", dashed.Split('-').Select((w, i) => i == 0 ? w : new string(w.Select((c, j) => j == 0 ? Char.ToUpper(c) : c).ToArray())));
        }
    }
}