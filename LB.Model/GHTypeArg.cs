using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LB.Model
{
    public class GHTypeArg
    {
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
    }
}
