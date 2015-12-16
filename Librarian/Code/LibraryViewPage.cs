using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Librarian
{
    public abstract class LibraryViewPage : WebViewPage
    {
        AngularHelper _angular = new AngularHelper();
        public AngularHelper Angular { get { return _angular; } }
    }

    public abstract class LibraryViewPage<T> : WebViewPage<T>
    {
        AngularHelper _angular = new AngularHelper();
        public AngularHelper Angular { get { return _angular; } }
    }
}