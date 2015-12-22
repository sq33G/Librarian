using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Librarian.Models
{
    public class Dialog : IHaveClientController
    {
        public string Title { get; set; }

        public class Button
        {
            public string Text { get; set; }
            public Dictionary<string,string> Attributes { get; set; }
            public bool Default { get; set; }
        }

        public string IncludeURL { get; set; }
        public List<Button> Buttons { get; set; }

        string IHaveClientController.ClientController
        {
            get
            {
                throw new NotImplementedException();
            }
        }
    }

    public static class ListOButtons
    {
        public static HtmlString ToHtmlString(this IEnumerable<Dialog.Button> buttons)
        {
            string s = String.Join("\n", buttons.Select(btn =>
                String.Format("<button type='button' class='btn{0}' ", 
                btn.Default ? " btn-primary" :  "")
                +
                String.Join(" ", btn.Attributes.Select(p => 
                    String.Format("{0}='{1}'",p.Key,p.Value))) +
                ">" + btn.Text + "</button>"));

            return new HtmlString(s);
        }
    }
}