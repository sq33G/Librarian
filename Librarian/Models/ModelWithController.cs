using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Librarian.Models
{
    public interface IHaveClientController
    {
        string ClientController { get; }
    }

    public class ModelWithController<T> : IHaveClientController
    {
        public string ClientController { get; set; }
        public T Contents { get; set; }
    }
}