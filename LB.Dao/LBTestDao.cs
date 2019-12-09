using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LB.Model;

namespace LB.Dao
{
    public class LBTestDao : ILBDao
    {
        public List<LBBooks> BookClassDrop()
        {
            var result = new List<LBBooks>();
            result.Add(new LBBooks
            {
                BookClassName = "生活類",
                BookClassId = "Life",
            });
            return result;
        }

        public List<LBBooks> BookKeeperDrop()
        {
            var result = new List<LBBooks>();
            result.Add(new LBBooks
            {
                BookKeeperName = "PeterSu",
                BookKeeper = "01",
            });
            return result;
        }

        public List<LBBooks> BookStatusDrop()
        {
            var result = new List<LBBooks>();
            result.Add(new LBBooks
            {
                BookStatus = "B",
                BookStatusName = "可以借出",
            });
            return result;
        }

        public List<LBBooks> GetLibraryData(LBSearchArg viewresult)
        {
            var result = new List<LBBooks>();
            result.Add(new LBBooks
            {
                BookName = "在顛沛流離的世界你還有我啊",
                BookClassId = "Life",
                BookKeeper = "PeterSu",
                BoughtDate = "2018/12/25",
                BookStatus = "可以借出"
            });
            return result;
        }

        public int InsertBook(LBSearchArg viewresult)
        {
            throw new NotImplementedException();
        }

        public List<LBBooks> SearchBook(LBSearchArg viewresult)
        {
            throw new NotImplementedException();
        }
    }
}
