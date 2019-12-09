using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace MVCWorkShop2.Models
{
    public class LBSearchArg
    {
        [DisplayName("書籍編號")]
        public string BookId { get; set; }
        [DisplayName("書名")]
        public string BookName { get; set; }
        [DisplayName("書籍類別")]
        public string BookClassName { get; set; }
        [DisplayName("借閱人")]
        public string BookKeeper { get; set; }
        [DisplayName("借閱狀態")]
        public string BookStatus { get; set; }
        [DisplayName("作者")]
        public string BookAuthor { get; set; }
        [DisplayName("出版社")]
        public string Pubilsher { get; set; }
        [DisplayName("簡介")]
        public string BookIntroduce { get; set; }
        [DisplayName("購買日期")]
        public string BoughtDate { get; set; }
    }
}