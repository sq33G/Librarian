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
        // GET: Patron
        public ActionResult Index()
        {
            return View(new Models.ModelWithController<IEnumerable<Models.Patron>>
            {
                ClientController = "patron-ctrl",
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
                Controller = "patronCreateCtrl",
                Current = "newPatron"
            });
        }

        public ActionResult Add(Models.Patron patron)
        {
            Data.Patron persistentPatron = Mapper.Map<Models.Patron, Data.Patron>(patron);
            Patronizing.AddPatron(persistentPatron);

            return Content(JsonConvert.SerializeObject(Mapper.Map<Data.Patron, Models.Patron>(persistentPatron)));
        }

        // GET: Patron/Edit/5
        public ActionResult Edit()
        {
            return PartialView("EditDetails", new Models.EditDetails
            {
                Controller = "patronEditCtrl",
                Current = "currPatron"
            });
        }

        public ActionResult Update(Models.Patron patron)
        {
            Data.Patron persistentPatron = Mapper.Map<Models.Patron, Data.Patron>(patron);
            Patronizing.UpdatePatron(persistentPatron);

            return Content(JsonConvert.SerializeObject(Mapper.Map<Data.Patron, Models.Patron>(persistentPatron)));
        }

        public ActionResult Delete(long id)
        {
            Patronizing.DeletePatron(id);
            return Json(id);
        }
    }
}
