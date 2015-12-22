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
            return View(new Models.ModelWithController<IEnumerable<Models.Author>> { ClientController = "author-ctrl", Contents = Mapper.Map<IEnumerable<Data.Author>, IEnumerable<Models.Author>>(Authoring.GetAllAuthors()) });
        }

        public ActionResult Details(long id)
        {
            return PartialView(Mapper.Map<Data.Author, Models.Author>(Authoring.GetAuthor(id)));
        }

        public ActionResult Create()
        {
            return PartialView();
        }

        public ActionResult Add(Models.Author author)
        {
            Data.Author persistentAuthor = Mapper.Map<Models.Author, Data.Author>(author);
            Authoring.AddAuthor(persistentAuthor);

            return Content(JsonConvert.SerializeObject(Mapper.Map<Data.Author, Models.Author>(persistentAuthor)));
        }

        // GET: Author/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Author/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        public ActionResult Delete(int id)
        {
            Authoring.DeleteAuthor(id);
            return Json(id);
        }
    }
}
