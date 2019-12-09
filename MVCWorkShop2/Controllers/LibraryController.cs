using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LB.Model;
using LB.Service;

namespace MVCWorkShop2.Controllers
{
    public class LibraryController : Controller
    {
        private ILBService lbService { get; set; }
        // GET: Library
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public JsonResult Index(LBSearchArg viewresult)
        {
            List<GHPost> bookList = lbService.GetLibraryData(viewresult);
            return this.Json(bookList);
        }
        [HttpPost]
        public JsonResult InsertPost(LBSearchArg insertData)
        {
            return this.Json(lbService.Insert(insertData));
        }
        [HttpPost]
        public JsonResult Login(Login login)
        {
            return this.Json(lbService.Login(login));
        }
        [HttpPost]
        public JsonResult SignUp(User data)
        {
            return this.Json(lbService.SignUp(data));
        }
        [HttpPost]
        public JsonResult History(string userId)
        {
            List<GHHistory> HistoryList = lbService.GetHistoryData(userId);
            return this.Json(HistoryList);
        }

        [HttpPost]
        public JsonResult Rank()
        {
            List<GHRank> RankList = lbService.GetRankData();
            return this.Json(RankList);
        }

        [HttpPost]
        public JsonResult MyHelp(string userId)
        {
            List<GHMyHelp> MyHelpList = lbService.GetMyHelpData(userId);
            return this.Json(MyHelpList);
        }

        [HttpPost]
        public JsonResult Udata(string userId)
        {
            List<GHUdata> UdataList = lbService.GetUdata(userId);
            return this.Json(UdataList);
        }

        [HttpPost]
        public JsonResult ChangeType(string type)
        {
            List<GHPost> TypeArgdataList = lbService.GetTypeArgData(type);
            return this.Json(TypeArgdataList);
        }

        [HttpPost]
        public JsonResult ShowMsg(string PostID)
        {
            List<GHPost> MsgList = lbService.ShowMsg(PostID);
            return this.Json(MsgList);
        }

        [HttpPost]
        public JsonResult InsertMessage(GHPost insertData)
        {
            return this.Json(lbService.InsertMessage(insertData));
        }

        [HttpPost]
        public JsonResult EasyRegister(GFUser data)
        {
            return this.Json(lbService.EasyRegister(data));
        }

        [HttpPost]
        public JsonResult EasyLogin(GFLogin login)
        {
            return this.Json(lbService.EasyLogin(login));
        }
        ////查詢書籍
        //[HttpPost]
        //public JsonResult Search(LBSearchArg viewresult)
        //{
        //    List<LBBooks> bookList = lbService.SearchBook(viewresult);
        //    return this.Json(bookList);
        //}
        ////類別下拉式選單
        //[HttpPost]
        //public JsonResult ClassDropDown()
        //{
        //    List<LBBooks> bookClassList = lbService.BookClassDrop();
        //    return this.Json(bookClassList);
        //}
        ////類別下拉式選單
        //[HttpPost]
        //public JsonResult StatusDropDown()
        //{
        //    List<LBBooks> bookClassList = lbService.BookStatusDrop();
        //    return this.Json(bookClassList);
        //}
        //[HttpPost]
        //public JsonResult KeeperDropDown()
        //{
        //    List<LBBooks> bookClassList = lbService.BookKeeperDrop();
        //    return this.Json(bookClassList);
        //}



    }
}