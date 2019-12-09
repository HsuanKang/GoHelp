using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LB.Model;
using LB.Dao;
using LB.Common;



namespace LB.Dao
{
    public class LBDao : ILBDao
    {
        //取得連線字串(Web.config)
        private string GetDBConnectionString()
        {
            return
                LB.Common.ConfigTool.GetDBConnectionString("DBConn");
        }
        //載入畫面時GET書籍資料放到kendoGrid
        public List<GHPost> GetLibraryData(LBSearchArg viewresult)
        {
            DataTable dt = new DataTable();
            string sql = @"SELECT  Post.rowid,Nickname,PostTitle,Kind,MeetAddress,StartTime,EndTime,PostContent,Helper,Status,lat,lng,City,Phone,IsShowPhone
                                    FROM  dbo.[Post]
                                    LEFT JOIN dbo.[HelpUser]
                                    ON dbo.[Post].UserID = dbo.[HelpUser].UserID
                                    WHERE Status = 'unfinish'
                                    order by StartTime desc
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


        //將BookData轉換成List
        private List<GHPost> MapBookDataToList(DataTable Data)
        {
            List<GHPost> result = new List<GHPost>();
            foreach (DataRow row in Data.Rows)
            {
                result.Add(new GHPost()
                {
                    PostContent = row["PostContent"].ToString(),
                    PostID = (int)row["rowid"],
                    Nickname = row["Nickname"].ToString(),
                    PostTitle = row["PostTitle"].ToString(),
                    Kind = row["Kind"].ToString(),
                    MeetAddress = row["MeetAddress"].ToString(),
                    StartTime = row["StartTime"].ToString(),
                    EndTime = row["EndTime"].ToString(),
                    Status = row["Status"].ToString(),
                    HelpUserID = row["Helper"].ToString(),
                    PostLat = System.Convert.ToSingle(row["lat"]),
                    PostLong = System.Convert.ToSingle(row["lng"]),
                    City = row["City"].ToString(),
                    Phone = row["Phone"].ToString(),
                    IsShowPhone = row["IsShowPhone"].ToString()
                });
            }
            return result;
        }

        // 問題分類轉換顯示
        public List<GHPost> GetTypeArgData(string type)
        {
            DataTable dt = new DataTable();
            string sql = @"SELECT  Post.rowid,Nickname,PostTitle,Kind,MeetAddress,StartTime,EndTime,PostContent,Helper,Status,lat,lng,City,Phone,IsShowPhone
                                    FROM  dbo.[Post]
                                    LEFT JOIN  dbo.[HelpUser]
                                    ON  dbo.[HelpUser].UserID =  dbo.[Post].UserID
                                    WHERE dbo.[Post].Kind = @type
                                    ";

            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@type", type));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                cmd.ExecuteNonQuery();
                sqlAdapter.Fill(dt);
                conn.Close();
            }
            return this.MapBookDataToList(dt);
        }

        //新增貼文
        public int Insert(LBSearchArg viewresult)
        {
            string sql = @"INSERT INTO [dbo].Post(
                                    PostID,PostTitle,PostContent,Kind,MeetAddress,StartTime,EndTime,UserID,Status,lat,lng,City,IsShowPhone)
                                    VALUES(
        	                         @PostID,@PostTitle,@PostContent,@Kind,@MeetAddress,@StartTime,@EndTime,@UserID,@Status,@PostLat,@PostLong,@City,@IsShowPhone
                                )";
            int Id;
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@PostID", "1"));
                cmd.Parameters.Add(new SqlParameter("@UserID", viewresult.UserID));
                cmd.Parameters.Add(new SqlParameter("@PostTitle", viewresult.PostTitle));
                cmd.Parameters.Add(new SqlParameter("@PostContent", viewresult.PostContent));
                cmd.Parameters.Add(new SqlParameter("@Kind", viewresult.Kind));
                cmd.Parameters.Add(new SqlParameter("@MeetAddress", viewresult.MeetAddress));
                cmd.Parameters.Add(new SqlParameter("@StartTime", DateTime.Parse(viewresult.StartTime)));
                cmd.Parameters.Add(new SqlParameter("@EndTime", DateTime.Parse(viewresult.EndTime)));
                cmd.Parameters.Add(new SqlParameter("@PostLat", viewresult.PostLat));
                cmd.Parameters.Add(new SqlParameter("@PostLong", viewresult.PostLong));
                cmd.Parameters.Add(new SqlParameter("@City", viewresult.City));
                cmd.Parameters.Add(new SqlParameter("@IsShowPhone", viewresult.IsShowPhone));
                cmd.Parameters.Add(new SqlParameter("@Status", "unFinish"));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                Id = Convert.ToInt32(cmd.ExecuteNonQuery());
                conn.Close();
            }
            return Id;
        }

        //新增留言
        public int InsertMessage(GHPost viewresult)
        {
            string sql = @"DECLARE @Uid int;
                                Set @Uid = (Select rowid
                                from HelpUser 
                                where UserID = @UserID
                                )
                                INSERT INTO dbo.MessageBoard(
                                postid,userid,message)
                                VALUES(
                                @PostID,@Uid,@Message
                                )";
            int Id;
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@UserID", viewresult.UserID));
                cmd.Parameters.Add(new SqlParameter("@PostID", viewresult.PostID));
                cmd.Parameters.Add(new SqlParameter("@Message", viewresult.Message));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                Id = Convert.ToInt32(cmd.ExecuteNonQuery());
                conn.Close();
            }
            return Id;
        }

        // 留言板
        public List<GHPost> ShowMsg(string id)
        {
            DataTable dt = new DataTable();
            string sql = @"Select U.Nickname as Nickname,MB.message as Message
                                    From MessageBoard as MB
                                    inner join HelpUser as U on MB.userid = U.rowid
                                    inner join Post as P on MB.postid = P.rowid
                                    Where P.rowid = @PostID
                                    ";

            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@PostID", id));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                cmd.ExecuteNonQuery();
                sqlAdapter.Fill(dt);
                conn.Close();
            }
            return this.MsgToList(dt);
        }
        //將ShowMsg轉換成List
        private List<GHPost> MsgToList(DataTable Data)
        {
            List<GHPost> result = new List<GHPost>();
            foreach (DataRow row in Data.Rows)
            {
                result.Add(new GHPost()
                {
                    Nickname = row["Nickname"].ToString(),
                    Message = row["Message"].ToString()
                });
            }
            return result;
        }

        //註冊
        public int SignUp(User viewresult)
        {
            string sql = @"INSERT INTO HelpUser(
                                    UserID,User_Password,Nickname,Phone,Gender,Email)
                                    VALUES(
        	                         @User_Account,@User_Password,@Nickname,@Phone,@Gender,@Email
                                )";
            int Id;
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@User_Account", viewresult.User_Account));
                cmd.Parameters.Add(new SqlParameter("@User_Password", viewresult.User_Password));
                cmd.Parameters.Add(new SqlParameter("@Nickname", viewresult.Nickname));
                cmd.Parameters.Add(new SqlParameter("@Phone", viewresult.Phone));
                cmd.Parameters.Add(new SqlParameter("@Gender", viewresult.Gender));
                cmd.Parameters.Add(new SqlParameter("@Email", viewresult.Email));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                Id = Convert.ToInt32(cmd.ExecuteNonQuery());
                conn.Close();
            }
            return Id;
        }

        // GFUser註冊
        public int EasyRegister(GFUser viewresult)
        {
            string sql = @"INSERT INTO HelpUser(
                                    UserID,User_Password,Nickname,Phone,Gender,Email)
                                    VALUES(
        	                         @UserID,@User_Password,@Nickname,@Phone,@Gender,@Email
                                )";
            int Id;
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@UserID", viewresult.UserID));
                cmd.Parameters.Add(new SqlParameter("@User_Password", viewresult.User_Password));
                cmd.Parameters.Add(new SqlParameter("@Nickname", viewresult.Nickname));
                cmd.Parameters.Add(new SqlParameter("@Phone", viewresult.Phone));
                cmd.Parameters.Add(new SqlParameter("@Gender", viewresult.Gender));
                cmd.Parameters.Add(new SqlParameter("@Email", viewresult.Email));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                Id = Convert.ToInt32(cmd.ExecuteNonQuery());
                conn.Close();
            }
            return Id;
        }

        public Boolean Login(Login viewresult)
        {
            int Id;
            string sql = @"Select 1
                                    From HelpUser
                                    Where UserID = @User_Account
                                    and User_Password = @User_Password
                                    ";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@User_Account", viewresult.Account));
                cmd.Parameters.Add(new SqlParameter("@User_Password", viewresult.Passwd));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                Id = Convert.ToInt32(cmd.ExecuteScalar());
                conn.Close();
            }
            if (Id == 1)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        //GF登入
        public Boolean EasyLogin(GFLogin viewresult)
        {
            int Id;
            string sql = @"Select 1
                                    From HelpUser
                                    Where NickName = @NickName
                                    and Phone = @Phone
                                    and UserID = @UserID
                                    ";
            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@NickName", viewresult.NickName));
                cmd.Parameters.Add(new SqlParameter("@Phone", viewresult.Phone));
                cmd.Parameters.Add(new SqlParameter("@UserID", viewresult.UserID));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                Id = Convert.ToInt32(cmd.ExecuteScalar());
                conn.Close();
            }
            if (Id == 1)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        // 救助紀錄
        public List<GHHistory> GetHistoryData(string userId)
        {
            DataTable dt = new DataTable();
            string sql = @"SELECT  PostTitle,Kind,PostContent,MeetAddress,Status,City
                                    FROM  dbo.[Post]
                                    LEFT JOIN  dbo.[HelpUser]
                                    ON  dbo.[HelpUser].UserID =  dbo.[Post].UserID
                                    WHERE dbo.[HelpUser].UserID = @userId
                                    ";

            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@userId", userId));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                cmd.ExecuteNonQuery();
                sqlAdapter.Fill(dt);
                conn.Close();
            }
            return this.MapHistoryDataToList(dt);
        }

        private List<GHHistory> MapHistoryDataToList(DataTable Data)
        {
            List<GHHistory> result = new List<GHHistory>();
            foreach (DataRow row in Data.Rows)
            {
                result.Add(new GHHistory()
                {
                    PostTitle = row["PostTitle"].ToString(),
                    Kind = row["Kind"].ToString(),
                    PostContent = row["PostContent"].ToString(),
                    MeetAddress = row["MeetAddress"].ToString(),
                    Status = row["Status"].ToString(),
                    City = row["City"].ToString()
                });
            }
            return result;
        }


        // 助人事蹟
        public List<GHMyHelp> GetMyHelpData(string userId)
        {
            DataTable dt = new DataTable();
            string sql = @"SELECT  PostTitle,Kind,PostContent,MeetAddress,EndTime,City
                                    FROM  dbo.[Post]
                                    LEFT JOIN  dbo.[HelpUser]
                                    ON  dbo.[HelpUser].UserID =  dbo.[Post].UserID
                                    WHERE dbo.[Post].Helper = @userId
                                    ";

            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@userId", userId));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                cmd.ExecuteNonQuery();
                sqlAdapter.Fill(dt);
                conn.Close();
            }
            return this.MapMyHelpDataToList(dt);
        }

        private List<GHMyHelp> MapMyHelpDataToList(DataTable Data)
        {
            List<GHMyHelp> result = new List<GHMyHelp>();
            foreach (DataRow row in Data.Rows)
            {
                result.Add(new GHMyHelp()
                {
                    PostTitle = row["PostTitle"].ToString(),
                    MeetAddress = row["MeetAddress"].ToString(),
                    City = row["City"].ToString(),
                    Kind = row["Kind"].ToString(),
                    PostContent = row["PostContent"].ToString(),
                    EndTime = row["EndTime"].ToString(),
                });
            }
            return result;
        }

        // 個人資料
        public List<GHUdata> GetUdata(string userId)
        {
            DataTable dt = new DataTable();
            string sql = @"SELECT  UserID,User_Password,Nickname,Phone,Gender,Email,Post_Cnt
                                    FROM  dbo.[HelpUser]
                                    WHERE UserID = @userId
                                    ";

            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.Add(new SqlParameter("@userId", userId));
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                cmd.ExecuteNonQuery();
                sqlAdapter.Fill(dt);
                conn.Close();
            }
            return this.MapGetUdataToList(dt);
        }

        private List<GHUdata> MapGetUdataToList(DataTable Data)
        {
            List<GHUdata> result = new List<GHUdata>();
            foreach (DataRow row in Data.Rows)
            {
                result.Add(new GHUdata()
                {
                    UserID = row["UserID"].ToString(),
                    User_Password = row["User_Password"].ToString(),
                    Nickname = row["Nickname"].ToString(),
                    Phone = row["Phone"].ToString(),
                    Gender = row["Gender"].ToString(),
                    Email = row["Email"].ToString(),
                    Post_Cnt = row["Post_Cnt"].ToString()
                });
            }
            return result;
        }

        // 排行榜
        public List<GHRank> GetRankData()
        {
            DataTable dt = new DataTable();
            string sql = @"SELECT COUNT(a2.Score) Rank, a1.Nickname,a1.Gender,a1.Score
                                    FROM [dbo].[HelpUser] a1, [dbo].[HelpUser] a2
                                    WHERE a1.Score <= a2.Score OR (a1.Score=a2.Score AND a1.Nickname = a2.Nickname)
                                    GROUP BY a1.Nickname, a1.Score,a1.Gender,a1.Score
                                    ORDER BY a1.Score DESC, a1.Nickname DESC
                                    ";

            using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
                cmd.ExecuteNonQuery();
                sqlAdapter.Fill(dt);
                conn.Close();
            }
            return this.MaptRankDataToList(dt);
        }

        private List<GHRank> MaptRankDataToList(DataTable Data)
        {
            List<GHRank> result = new List<GHRank>();
            foreach (DataRow row in Data.Rows)
            {
                result.Add(new GHRank()
                {
                    Rank = row["Rank"].ToString(),
                    Nickname = row["Nickname"].ToString(),
                    Gender = row["Gender"].ToString(),
                    Score = row["Score"].ToString(),
                });
            }
            return result;
        }
        //  //查詢書籍
        //  public List<LB.Model.LBBooks> SearchBook(LBSearchArg viewresult)
        //  {
        //      DataTable dt = new DataTable();
        //      string sql = @"Select BOOK_CLASS_NAME,BOOK_NAME,BOOK_BOUGHT_DATE,CODE_NAME,USER_CNAME 
        //                              FROM dbo.BOOK_DATA as e
        //                              LEFT JOIN dbo.BOOK_CLASS as bc
        //                              ON (e.BOOK_CLASS_ID = bc.BOOK_CLASS_ID)
        //                              LEFT JOIN dbo.BOOK_CODE as code
        //                              ON (e.BOOK_STATUS = code.CODE_ID)
        //                              LEFT JOIN dbo.MEMBER_M as mm
        //                              ON (e.BOOK_KEEPER = mm.USER_ID)
        //                              Where (e.BOOK_NAME LIKE ('%'+@BOOK_NAME+'%') OR @BOOK_NAME='')
        //                              AND (bc.BOOK_CLASS_NAME LIKE ('%'+@BOOK_CLASS_NAME+'%') OR @BOOK_CLASS_NAME='')
        //                              AND (mm.USER_CNAME LIKE ('%'+@BOOK_KEEPER+'%') OR @BOOK_KEEPER='')
        //                              AND (code.CODE_ID LIKE ('%'+@BOOK_STATUS+'%') OR @BOOK_STATUS='')";
        //      using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
        //      {
        //          conn.Open();
        //          SqlCommand cmd = new SqlCommand(sql, conn);
        //          cmd.Parameters.Add(new SqlParameter("@BOOK_NAME", viewresult.BookName == null ? string.Empty : viewresult.BookName));
        //          cmd.Parameters.Add(new SqlParameter("@BOOK_CLASS_NAME", viewresult.BookClassName == null ? string.Empty : viewresult.BookClassName));
        //          cmd.Parameters.Add(new SqlParameter("@BOOK_KEEPER", viewresult.BookKeeper == null ? string.Empty : viewresult.BookKeeper));
        //          cmd.Parameters.Add(new SqlParameter("@BOOK_STATUS", viewresult.BookStatus == null ? string.Empty : viewresult.BookStatus));
        //          SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
        //          sqlAdapter.Fill(dt);
        //          conn.Close();
        //      }
        //      return this.MapBookDataToList(dt);
        //  }

        //  //取得下拉式資料
        //  //類別名稱
        //  public List<LBBooks> BookClassDrop()
        //  {
        //      DataTable dt = new DataTable();
        //      string sql = @"Select BOOK_CLASS_NAME,BOOK_CLASS_ID
        //                          FROM dbo.BOOK_CLASS";
        //      using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
        //      {
        //          conn.Open();
        //          SqlCommand cmd = new SqlCommand(sql, conn);
        //          SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
        //          sqlAdapter.Fill(dt);
        //          conn.Close();
        //      }
        //      return this.MapBookClassToList(dt);
        //  }
        //  //借閱狀態下拉式
        //  public List<LBBooks> BookStatusDrop()
        //  {
        //      DataTable dt = new DataTable();
        //      string sql = @"Select BOOK_CODE.CODE_NAME,BOOK_CODE.CODE_ID
        //                          FROM dbo.BOOK_CODE";
        //      using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
        //      {
        //          conn.Open();
        //          SqlCommand cmd = new SqlCommand(sql, conn);
        //          SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
        //          sqlAdapter.Fill(dt);
        //          conn.Close();
        //      }
        //      return this.MapBookStatusToList(dt);
        //  }
        //  //借閱人下拉式
        //  public List<LBBooks> BookKeeperDrop()
        //  {
        //      DataTable dt = new DataTable();
        //      string sql = @"Select MEMBER_M.USER_ID,MEMBER_M.USER_CNAME
        //                              FROM dbo.MEMBER_M";
        //      using (SqlConnection conn = new SqlConnection(this.GetDBConnectionString()))
        //      {
        //          conn.Open();
        //          SqlCommand cmd = new SqlCommand(sql, conn);
        //          SqlDataAdapter sqlAdapter = new SqlDataAdapter(cmd);
        //          sqlAdapter.Fill(dt);
        //          conn.Close();
        //      }
        //      return this.MapBookKeeperToList(dt);
        //  }
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



    }
}
