using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Librarian.Models
{
    public interface IEntity
    {
        RowState RowState { get; set; }
    }

    public enum RowState
    {
        Unmodified,
        Added,
        Edited,
        Deleted
    }
}
