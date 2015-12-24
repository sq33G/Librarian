using AutoMapper;
using Librarian.Data;
using Librarian.Logic;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Librarian.Controllers
{
    public class PatronController : Controller
    {
        // GET: Author
        public ActionResult Index()
        {
            return View(new Models.ModelWithController<IEnumerable<Models.Patron>>
            {
                ClientController = "author-ctrl",
                Contents = Mapper.Map<IEnumerable<Data.Patron>, IEnumerable<Models.Patron>>(Patronizing.GetAllPatrons())
            });
        }

        public ActionResult Details()
        {
            return PartialView();
        }

        public ActionResult Create()
        {
            return PartialView("EditDetails", new Models.EditDetails
            {
                Controller = "authorCreateCtrl",
                Current = "newAuthor"
            });
        }

        public ActionResult Add(Models.Author author)
        {
            Data.Author persistentAuthor = Mapper.Map<Models.Author, Data.Author>(author);
            Authoring.AddAuthor(persistentAuthor);

            return Content(JsonConvert.SerializeObject(Mapper.Map<Data.Author, Models.Author>(persistentAuthor)));
        }

        // GET: Author/Edit/5
        public ActionResult Edit()
        {
            return PartialView("EditDetails", new Models.EditDetails
            {
                Controller = "authorEditCtrl",
                Current = "currAuthor"
            });
        }

        public ActionResult Update(Models.Author author)
        {
            Data.Author persistentAuthor = Mapper.Map<Models.Author, Data.Author>(author);
            Authoring.UpdateAuthor(persistentAuthor);

            return Content(JsonConvert.SerializeObject(Mapper.Map<Data.Author, Models.Author>(persistentAuthor)));
        }

        public ActionResult Delete(long id)
        {
            Authoring.DeleteAuthor(id);
            return Json(id);
        }
    }
}
