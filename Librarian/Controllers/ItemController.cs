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
    public class ItemController : Controller
    {
        public ActionResult Index()
        {
            return View(new Models.ModelWithController<IEnumerable<Models.Item>>
            {
                ClientController = "item-ctrl"
            });
        }

        public ActionResult IndexContent()
        {
            return PartialView();
        }

        public ActionResult IndexData(int pageNum, int pageSize, string filter)
        {
            return Content(JsonConvert.SerializeObject(new
            {
                items = Mapper.Map<IEnumerable<Data.Item>, IEnumerable<Models.Item>>(Itemizing.GetAllItems(filter, pageSize, pageNum)),
                pageNum = pageNum
            }));
        }

        public ActionResult Single(long id)
        {
            return Content(JsonConvert.SerializeObject(Mapper.Map<Data.Item, Models.Item>(Itemizing.GetItem(id))));
        }

        public ActionResult Details()
        {
            return PartialView();
        }

        public ActionResult Create()
        {
            return PartialView("EditDetails", new Models.EditDetails
            {
                Current = "newItem"
            });
        }

        public ActionResult Add(Models.Item item)
        {
            Data.Item persistentItem = Mapper.Map<Models.Item, Data.Item>(item);
            Itemizing.AddItem(persistentItem);

            return Content(JsonConvert.SerializeObject(Mapper.Map<Data.Item, Models.Item>(persistentItem)));
        }

        // GET: Author/Edit/5
        public ActionResult Edit()
        {
            return PartialView("EditDetails", new Models.EditDetails
            {
                Current = "currItem"
            });
        }

        public ActionResult Update(Models.Item item)
        {
            Data.Item persistentItem = Mapper.Map<Models.Item, Data.Item>(item);
            Itemizing.Update(persistentItem);

            return Content(JsonConvert.SerializeObject(Mapper.Map<Data.Item, Models.Item>(persistentItem)));
        }

        public ActionResult Delete(long id)
        {
            Authoring.DeleteAuthor(id);
            return Json(id);
        }
    }
}
