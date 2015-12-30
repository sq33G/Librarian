﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Librarian.Models
{
    public class Author : IEntity
    {
        public const string AUTHOR_CTRL = "author-ctrl";

        public long ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Suffix { get; set; }

        public RowState RowState
        {
            get; set;
        }
    }
}