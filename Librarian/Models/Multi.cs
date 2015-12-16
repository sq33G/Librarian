using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Librarian.Models
{
    public class Multi<T> : IEntityVM, IEnumerable<T> where T : IEntityVM
    {
        List<T> _contents;
        string _controllerName;

        public Multi()
        {
        }

        public Multi(IEnumerable<T> contents)
        {
            _contents = contents.ToList();
        }

        public Multi(string controllerName)
        {
            _controllerName = controllerName;
        }

        public void Add(T elem)
        {
            if (_contents == null)
                _contents = new List<T> { elem };
            else
                _contents.Add(elem);
        }

        public string ControllerName
        {
            get
            {
                if (_controllerName != null)
                    return _controllerName;

                if (_contents == null)
                    throw new NullReferenceException("Cannot get controller name - multi contained collection is null. Consider using the Multi<T>(string controllerName) constructor.");

                if (!_contents.Any())
                    throw new IndexOutOfRangeException("Cannot get controller name - no items in multi collection. Consider using the Multi<T>(string controllerName) constructor.");

                _controllerName = _contents.First().ControllerName;
                return _controllerName;
            }
        }

        public RowState RowState
        {
            get
            {
                if (_contents.Any(c => c.RowState != RowState.Unmodified))
                    return RowState.Edited;

                return RowState.Unmodified;
            }

            set
            {
                //nothing to do
            }
        }

        public IEnumerator<T> GetEnumerator()
        {
            if (_contents == null)
                return default(IEnumerator<T>);

            return _contents.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            if (_contents == null)
                return default(IEnumerator);

            return ((IEnumerable)_contents).GetEnumerator();
        }
    }
}