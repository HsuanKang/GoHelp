using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LB.Model
{
    public class GHPost
    {
        [DisplayName("貼文編號")]
        public int PostID { get; set; }
        [DisplayName("貼文標題")]
        public string PostTitle { get; set; }
        [DisplayName("貼文內容")]
        public string PostContent { get; set; }
        [DisplayName("種類")]
        public string Kind { get; set; }
        [DisplayName("會面地址")]
        public string MeetAddress { get; set; }
        [DisplayName("開始時間")]
        public string StartTime { get; set; }
        [DisplayName("結束時間")]
        public string EndTime { get; set; }
        [DisplayName("使用者")]
        public string UserID { get; set; }
        [DisplayName("暱稱")]
        public string Nickname { get; set; }
        [DisplayName("幫助者")]
        public string HelpUserID { get; set; }
        [DisplayName("狀態")]
        public string  Status { get; set; }
        [DisplayName("緯度")]
        public float PostLat { get; set; }
        [DisplayName("經度")]
        public float PostLong { get; set; }
        [DisplayName("縣市")]
        public string City { get; set; }
        [DisplayName("電話")]
        public string Phone { get; set; }
        public string IsShowPhone { get; set; }
        [DisplayName("留言")]
        public string Message { get; set; }
    }
}
