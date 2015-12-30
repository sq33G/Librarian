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
        LookupHelper _lookup = new LookupHelper();
        public AngularHelper Angular { get { return _angular; } }
        public LookupHelper Lookup { get { return _lookup; } }
    }

    public abstract class LibraryViewPage<T> : WebViewPage<T>
    {
        AngularHelper _angular = new AngularHelper();
        LookupHelper _lookup = new LookupHelper();
        public AngularHelper Angular { get { return _angular; } }
        public LookupHelper Lookup { get { return _lookup; } }
    }
}