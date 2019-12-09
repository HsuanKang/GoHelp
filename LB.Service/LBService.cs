using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LB.Model;
using LB.Dao;

namespace LB.Service
{
    public class LBService : ILBService
    {
        private ILBDao lbDao { get; set; }
        //載入畫面時GET書籍資料放到kendoGrid
        public List<GHPost> GetLibraryData(LBSearchArg viewresult)
        {
            return lbDao.GetLibraryData(viewresult);
        }
        public int Insert(LBSearchArg viewresult)
        {
            return lbDao.Insert(viewresult);
        }
        public Boolean Login(Login viewresult)
        {
            return lbDao.Login(viewresult);
        }
        public int SignUp(User viewresult)
        {
            return lbDao.SignUp(viewresult);
        }
        public List<GHHistory> GetHistoryData(string userId)
        {
            return lbDao.GetHistoryData(userId);
        }

        public List<GHRank> GetRankData()
        {
            return lbDao.GetRankData();
        }

        public List<GHMyHelp> GetMyHelpData(string userId)
        {
            return lbDao.GetMyHelpData(userId);
        }

        public List<GHUdata> GetUdata(string userId)
        {
            return lbDao.GetUdata(userId);
        }
        public List<GHPost> GetTypeArgData(string type)
        {
            return lbDao.GetTypeArgData(type);
        }
        public List<GHPost> ShowMsg(string id)
        {
            return lbDao.ShowMsg(id);
        }

        public int InsertMessage(GHPost viewresult)
        {
            return lbDao.InsertMessage(viewresult);
        }

        public int EasyRegister(GFUser viewresult)
        {
            return lbDao.EasyRegister(viewresult);
        }

        public Boolean EasyLogin(GFLogin viewresult)
        {
            return lbDao.EasyLogin(viewresult);
        }
        ////查詢書籍
        //public List<LB.Model.LBBooks> SearchBook(LBSearchArg viewresult)
        //{
        //    return lbDao.SearchBook(viewresult);
        //}
        ////新增書籍
        //public int InsertBook(LBSearchArg viewresult)
        //{
        //    return lbDao.InsertBook(viewresult);
        //}
        ////取得下拉式資料
        ////類別名稱
        //public List<LBBooks> BookClassDrop()
        //{
        //    return lbDao.BookClassDrop();
        //}
        ////借閱狀態下拉式
        //public List<LBBooks> BookStatusDrop()
        //{
        //    return lbDao.BookStatusDrop();
        //}
        ////借閱人下拉式
        //public List<LBBooks> BookKeeperDrop()
        //{
        //    return lbDao.BookKeeperDrop();
        //}
    }
}

