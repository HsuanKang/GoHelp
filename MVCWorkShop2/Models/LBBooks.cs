using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;

namespace MVCWorkShop2.Models
{
    public class LBBooks
    {
        [DisplayName("書籍類別id")]
        public string BookClassId { get; set; }
        [DisplayName("書籍類別")]
        public string BookClassName { get; set; }
        [DisplayName("書名")]
        public string BookName { get; set; }
        [DisplayName("購買日期")]
        public string BoughtDate { get; set; }
        [DisplayName("借閱狀態")]
        public string BookStatus { get; set; }
        [DisplayName("保管人")]
        public string BookKeeper { get; set; }
        [DisplayName("保管人名")]
        public string BookKeeperName { get; set; }
        [DisplayName("借閱狀態")]
        public string BookStatusName { get; set; }
    }
}