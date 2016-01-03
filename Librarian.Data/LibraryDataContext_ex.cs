using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librarian.Data
{
    public partial class Author
    {
        public string ToAlphebetizable()
        {
            return LastName + (String.IsNullOrEmpty(FirstName) ? "" : ", " + FirstName) + (String.IsNullOrEmpty(Suffix) ? "" : " " + Suffix);
        }

        public override string ToString()
        {
            return (String.IsNullOrEmpty(FirstName) ? "" : FirstName + " ") + LastName + (String.IsNullOrEmpty(Suffix) ? "" : " " + Suffix);
        }
    }
}
