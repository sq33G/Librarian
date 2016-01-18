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
    public class PublisherController : Controller
    {
        public ActionResult Index()
        {
            return View(new Models.ModelWithController<IEnumerable<Models.Publisher>>
            {
                ClientController = "publisher-ctrl",
                Contents = Mapper.Map<IEnumerable<Data.Publisher>, IEnumerable<Models.Publisher>>(Publishing.GetAllPublishers())
            });
        }

        public ActionResult Add(Models.Publisher publisher)
        {
            Data.Publisher persistentPublisher = Mapper.Map<Models.Publisher, Data.Publisher>(publisher);
            Publishing.AddPublisher(persistentPublisher);

            return Content(JsonConvert.SerializeObject(Mapper.Map<Data.Publisher, Models.Publisher>(persistentPublisher)));
        }

        public ActionResult Update(Models.Publisher publisher)
        {
            Data.Publisher persistentPublisher = Mapper.Map<Models.Publisher, Data.Publisher>(publisher);
            Publishing.UpdatePublisher(persistentPublisher);

            return Content(JsonConvert.SerializeObject(Mapper.Map<Data.Publisher, Models.Publisher>(persistentPublisher)));
        }

        public ActionResult Delete(long id)
        {
            Publishing.DeletePublisher(id);
            return Json(id);
        }
    }
}
