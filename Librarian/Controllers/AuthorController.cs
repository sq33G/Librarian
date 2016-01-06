using AutoMapper;
using Librarian.Logic;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Librarian.Controllers
{
    public class AuthorController : Controller
    {
        // GET: Author
        public ActionResult Index()
        {
            return View(new Models.ModelWithController<IEnumerable<Models.Author>>
            {
                ClientController = "author-ctrl",
                Contents = Mapper.Map<IEnumerable<Data.Author>, IEnumerable<Models.Author>>(Authoring.GetAllAuthors())
            });
        }

        public ActionResult ByID(long id)
        {
            return Content(JsonConvert.SerializeObject(Mapper.Map<Models.Author>(Authoring.GetAuthorByID(id))));
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

            Caching.AddAuthor(persistentAuthor);

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
