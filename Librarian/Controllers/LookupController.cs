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
    public class LookupController : Controller
    {
        // GET: Lookup
        public ActionResult Index(string lookupName)
        {
            return View(Caching.GetLookup(lookupName).Select(p => new Models.Lookup(p)));
        }

        public ActionResult Edit()
        {
            return PartialView(new Models.EditDetails
            {
                Controller = "lookupEditCtrl",
                Current = "currLookup"
            });
        }

        public ActionResult Create()
        {
            return PartialView("Edit", new Models.EditDetails
            {
                Controller = "lookupCreateCtrl",
                Current = "newLookup"
            });
        }

        public ActionResult Add(string name, string text)
        {
            Data.Lookup persistentLookup = new Data.Lookup { LookupName = name, Value = text };
            LookingUp.Add(persistentLookup);
            Caching.AddLookupValue(persistentLookup);

            return Content(JsonConvert.SerializeObject(new Models.Lookup(persistentLookup.ID, persistentLookup.Value)));
        }

        public ActionResult Update(string name, Models.Lookup entry)
        {
            Data.Lookup persistentLookup = new Data.Lookup
            {
                LookupName = name,
                ID = entry.Value,
                Value = entry.Text
            };
            LookingUp.Update(persistentLookup);

            Caching.UpdateLookupValue(persistentLookup);

            return Content(JsonConvert.SerializeObject(new Models.Lookup(persistentLookup.ID, persistentLookup.Value)));
        }

        public ActionResult Delete(string name, int id)
        {
            LookingUp.Delete(new Data.Lookup { LookupName = name, ID = id });
            Caching.RemoveLookupValue(name, id);
            return Json(id);
        }
    }
}