using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LB.Model
{
    public class GHMyHelp
    {
        [DisplayName("問題標題")]
        public string PostTitle { get; set; }
        [DisplayName("問題分類")]
        public string Kind { get; set; }
        [DisplayName("問題內容")]
        public string PostContent { get; set; }
        [DisplayName("結束時間")]
        public string EndTime { get; set; }
        [DisplayName("結束時間")]
        public string MeetAddress { get; set; }
        [DisplayName("結束時間")]
        public string City { get; set; }
    }
}