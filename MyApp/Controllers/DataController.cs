using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MyApp.DataModel;
using MyApp.Common;

namespace MyApp.Controllers
{
    public class DataController : Controller
    {
        public JsonResult GetAllCurrencies()
        {
            List<Currency> currencies = new List<Currency>();

            using (var db = new DatabaseModel())
            {
                currencies = db.Currencies.OrderBy(a => a.Name).ToList();
            }

            return new JsonResult { Data = currencies, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult GetAllOffers()
        {
            dynamic data = null;

            using (var db = new DatabaseModel())
            {
                data = db.SpecialOffers.Select(x => new { OfferId = x.SpecialOfferID, Description = x.Description }).OrderBy(a => a.Description).ToList();
            }

            return new JsonResult { Data = data, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult GetOfferProduct(int offerId)
        {
            dynamic data = null;

            using (var db = new DatabaseModel())
            {
                data = db.SpecialOfferProducts.Where(x => x.SpecialOfferID == offerId)
                    .Join(db.Products,
                    offer => offer.ProductID,
                    product => product.ProductID,
                    (offer, product) => new { Name = product.Name, ProductId = product.ProductID, OfferID = offer.SpecialOfferID }).ToList();
            }

            return new JsonResult { Data = data, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [HttpPost]
        public JsonResult RegisterUser(User newUser)
        {
            string message = string.Empty;

            if (ModelState.IsValid)
            {
                using (DatabaseModel db = new DatabaseModel())
                {
                    var user = db.Users.Where(x => x.UserName == newUser.UserName).FirstOrDefault();

                    if (user != null)
                    {
                        db.Users.Add(newUser);
                        db.SaveChanges();
                        message = "Sucessfully registered";
                    }
                    else
                    {
                        message = "You are already registered";
                    }
                }
            }
            else
            {
                message = "The given data is not valid";
            }

            return new JsonResult { Data = message, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult GetAllLocation()
        {
            List<Location> locations = new List<Location>();
            using (var db = new DatabaseModel())
            {
                locations = db.Locations.OrderBy(a => a.Title).ToList();
            }

            return new JsonResult() { Data = locations, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult GetMarkerInfo(int locationID)
        {
            Location location = null;
            using (var db = new DatabaseModel())
            {
                location = db.Locations.Where(x => x.LocationID == locationID).FirstOrDefault();
            }

            return new JsonResult() { Data = location, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult GetCountries()
        {
            List<CountryRegion> countries = new List<CountryRegion>();

            using (var db = new DatabaseModel())
            {
                countries = db.CountryRegions.OrderBy(a => a.Name).ToList();
            }

            return new JsonResult() { Data = countries, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [ActionName("GetAllCountries")]
        public JsonResult GetCountries(int page)
        {
            List<CountryRegion> countries = new List<CountryRegion>();
            int totalPage = 0;
            int totalRecord = 0;
            int pageSize = 20;

            using (var db = new DatabaseModel())
            {
                var data = db.CountryRegions.OrderBy(a => a.Name);
                totalRecord = data.Count();
                totalPage = (totalRecord / pageSize) + (totalRecord % pageSize > 0 ? 1 : 0);
                countries = data.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            }

            return new JsonResult() { Data = new { Countries = countries, CurrentPage = page, TotalPage = totalPage }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult GetEvents()
        {
            List<AppEvent> events = new List<AppEvent>();

            using (var db = new DatabaseModel())
            {
                events = db.AppEvents.OrderBy(a => a.StartAt).ToList();
            }

            return new JsonResult() { Data = events, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [HttpPost]
        public JsonResult SaveEvent(AppEvent evt)
        {
            bool status = false;

            using (var db = new DatabaseModel())
            {
                if (evt.EndAt != null && evt.StartAt.TimeOfDay == new TimeSpan(0, 0, 0) && evt.EndAt.Value.TimeOfDay == new TimeSpan(0, 0, 0))
                {
                    evt.IsFullDay = true;
                }
                else
                {
                    evt.IsFullDay = false;
                }

                if (evt.EventID > 0)
                {
                    var exist = db.AppEvents.Where(a => a.EventID.Equals(evt.EventID)).FirstOrDefault();
                    if (exist != null)
                    {
                        exist.Title = evt.Title;
                        exist.Description = evt.Description;
                        exist.StartAt = evt.StartAt;
                        exist.EndAt = evt.EndAt;
                        exist.IsFullDay = evt.IsFullDay;
                    }
                }
                else
                {
                    db.AppEvents.Add(evt);
                }
                db.SaveChanges();
                status = true;
            }

            return new JsonResult { Data = new { status = status } };
        }

        [HttpPost]
        public JsonResult DeleteEvent(int eventID)
        {
            bool status = false;

            using (var db = new DatabaseModel())
            {
                var evt = db.AppEvents.Where(a => a.EventID.Equals(eventID)).FirstOrDefault();
                if (evt != null)
                {
                    db.AppEvents.Remove(evt);
                    db.SaveChanges();
                    status = true;
                }
            }

            return new JsonResult { Data = new { status = status } };
        }

        public JsonResult GetChartData()
        {
            List<Report> reports = new List<Report>();

            using (var db = new DatabaseModel())
            {
                reports = db.Reports.OrderBy(a => a.Title).ToList();
            }

            return new JsonResult { Data = reports, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult GetFileStructure()
        {
            List<MyApp.DataModel.File> list = new List<MyApp.DataModel.File>();

            using (var db = new DatabaseModel())
            {
                list = db.Files.Select(x => new File() {ID = x.ID, FileName = x.FileName, ParentID = x.ParentID }).OrderBy(a => a.FileName).ToList();
            }

            List<MyApp.DataModel.File> treelist = new List<MyApp.DataModel.File>();

            if (list.Count > 0)
            {
                treelist = (new TreeStructure()).BuildTree(list);
            }

            return new JsonResult { Data = new { treeList = treelist }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
    }
}