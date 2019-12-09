using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace MVCWorkShop2.Models
{
    //連線資料庫
    public class LBService
    {
        //取得連線字串(Web.config)
        private string GetDBConnectionString()
        {
            return
                System.Configuration.ConfigurationManager.ConnectionStrings["DBConn"].ConnectionString.ToString();
        }
        //載入畫面時GET書籍資料放到kendoGrid
        public List<LBBooks> GetLibraryData(LBSearchArg viewresult)
        {
            DataTable dt = new DataTable();
            string sql = @"Select BOOK_CLASS_NAME,BOOK_NAME,BOOK_BOUGHT_DATE,CODE_NAME,USER_CNAME 
                                    FROM dbo.BOOK_DATA as e
                                    LEFT JOIN dbo.BOOK_CLASS as bc
                                    ON (e.BOOK_CLASS_ID = bc.BOOK_CLASS_ID)
                                    LEFT JOIN dbo.BOOK_CODE as code
                                    ON (e.BOOK_STATUS = code.CODE_ID)
                                    LEFT JOIN dbo.MEMBER_M as mm
                                    ON (e.BOOK_KEEPER = mm.USER_ID)
                                    ";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                sqlAdapter.Fill(dt);
                conn.Close();
            }
            return this.MapBookDataToList(dt);
        }
        //查詢書籍
        public List<LBBooks> SearchBook(LBSearchArg viewresult)
        {
            DataTable dt = new DataTable();
            string sql = @"Select BOOK_CLASS_NAME,BOOK_NAME,BOOK_BOUGHT_DATE,CODE_NAME,USER_CNAME 
                                    FROM dbo.BOOK_DATA as e
                                    LEFT JOIN dbo.BOOK_CLASS as bc
                                    ON (e.BOOK_CLASS_ID = bc.BOOK_CLASS_ID)
                                    LEFT JOIN dbo.BOOK_CODE as code
                                    ON (e.BOOK_STATUS = code.CODE_ID)
                                    LEFT JOIN dbo.MEMBER_M as mm
                                    ON (e.BOOK_KEEPER = mm.USER_ID)
                                    Where (e.BOOK_NAME LIKE ('%'+@BOOK_NAME+'%') OR @BOOK_NAME='')
                                    AND (bc.BOOK_CLASS_NAME LIKE ('%'+@BOOK_CLASS_NAME+'%') OR @BOOK_CLASS_NAME='')
                                    AND (mm.USER_CNAME LIKE ('%'+@BOOK_KEEPER+'%') OR @BOOK_KEEPER='')
                                    AND (code.CODE_ID LIKE ('%'+@BOOK_STATUS+'%') OR @BOOK_STATUS='')";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@BOOK_NAME", viewresult.BookName == null ? string.Empty : viewresult.BookName));
                cmd.Parameters.Add(new SqlParameter("@BOOK_CLASS_NAME", viewresult.BookClassName == null ? string.Empty : viewresult.BookClassName));
                cmd.Parameters.Add(new SqlParameter("@BOOK_KEEPER", viewresult.BookKeeper == null ? string.Empty : viewresult.BookKeeper));
                cmd.Parameters.Add(new SqlParameter("@BOOK_STATUS", viewresult.BookStatus == null ? string.Empty : viewresult.BookStatus));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                sqlAdapter.Fill(dt);
                conn.Close();
            }
            return this.MapBookDataToList(dt);
        }
        //新增書籍
        public int InsertBook(LBSearchArg viewresult)
        {
            string sql = @" INSERT INTO dbo.BOOK_DATA
						 (
							 BOOK_NAME,BOOK_AUTHOR,BOOK_PUBLISHER,BOOK_NOTE,BOOK_BOUGHT_DATE,BOOK_CLASS_ID,BOOK_STATUS
						 )
						VALUES
						(
							 @BOOK_NAME,@BOOK_AUTHOR,@BOOK_PUBLISHER,@BOOK_NOTE,@BOOK_BOUGHT_DATE,@BOOK_CLASS_ID,@BOOK_STATUS
						)";
            int Id;
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@BOOK_NAME", viewresult.BookName));
                cmd.Parameters.Add(new SqlParameter("@BOOK_AUTHOR", viewresult.BookAuthor));
                cmd.Parameters.Add(new SqlParameter("@BOOK_PUBLISHER", viewresult.Pubilsher));
                cmd.Parameters.Add(new SqlParameter("@BOOK_NOTE", viewresult.BookIntroduce));
                cmd.Parameters.Add(new SqlParameter("@BOOK_BOUGHT_DATE", viewresult.BoughtDate));
                cmd.Parameters.Add(new SqlParameter("@BOOK_CLASS_ID", viewresult.BookClassName));
                cmd.Parameters.Add(new SqlParameter("@BOOK_STATUS", viewresult.BookStatus));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                Id = Convert.ToInt32(cmd.ExecuteScalar());
                conn.Close();
            }
            return Id;
        }
        //取得下拉式資料
        //類別名稱
        public List<LBBooks> BookClassDrop()
        {
            DataTable dt = new DataTable();
            string sql = @"Select BOOK_CLASS_NAME,BOOK_CLASS_ID
                                FROM dbo.BOOK_CLASS";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                sqlAdapter.Fill(dt);
                conn.Close();
            }
            return this.MapBookClassToList(dt);
        }
        //借閱狀態下拉式
        public List<LBBooks> BookStatusDrop()
        {
            DataTable dt = new DataTable();
            string sql = @"Select BOOK_CODE.CODE_NAME,BOOK_CODE.CODE_ID
                                FROM dbo.BOOK_CODE";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                sqlAdapter.Fill(dt);
                conn.Close();
            }
            return this.MapBookStatusToList(dt);
        }
        //借閱人下拉式
        public List<LBBooks> BookKeeperDrop()
        {
            DataTable dt = new DataTable();
            string sql = @"Select MEMBER_M.USER_ID,MEMBER_M.USER_CNAME
                                    FROM dbo.MEMBER_M";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                sqlAdapter.Fill(dt);
                conn.Close();
            }
            return this.MapBookKeeperToList(dt);
        }
        //轉換狀態名稱TOLIST
        private List<LBBooks> MapBookKeeperToList(DataTable bookClass)
        {
            List<LBBooks> result = new List<LBBooks>();
            foreach (DataRow row in bookClass.Rows)
            {
                result.Add(new LBBooks()
                {
                    BookKeeper = row["USER_ID"].ToString(),
                    BookKeeperName = row["USER_CNAME"].ToString()
                });
            }
            return result;
        }
        //轉換狀態名稱TOLIST
        private List<LBBooks> MapBookStatusToList(DataTable bookClass)
        {
            List<LBBooks> result = new List<LBBooks>();
            foreach (DataRow row in bookClass.Rows)
            {
                result.Add(new LBBooks()
                {
                    BookStatus = row["CODE_ID"].ToString(),
                    BookStatusName = row["CODE_NAME"].ToString()
                });
            }
            return result;
        }
        //轉換類別名稱TOLIST
        private List<LBBooks> MapBookClassToList(DataTable bookClass)
        {
            List<LBBooks> result = new List<LBBooks>();
            foreach (DataRow row in bookClass.Rows)
            {
                result.Add(new LBBooks()
                {
                    BookClassName = row["BOOK_CLASS_NAME"].ToString(),
                    BookClassId = row["BOOK_CLASS_ID"].ToString()
                });
            }
            return result;
        }


        //將BookData轉換成List
        private List<LBBooks> MapBookDataToList(DataTable Data)
        {
            List<LBBooks> result = new List<LBBooks>();
            foreach (DataRow row in Data.Rows)
            {
                result.Add(new LBBooks()
                {
                    BookClassName = row["BOOK_CLASS_NAME"].ToString(),
                    BookName = row["BOOK_NAME"].ToString(),
                    BoughtDate = row["BOOK_BOUGHT_DATE"].ToString(),
                    BookStatus = row["CODE_NAME"].ToString(),
                    BookKeeper = row["USER_CNAME"].ToString()
                });
            }
            return result;
        }

    }
}