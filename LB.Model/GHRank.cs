using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LB.Model
{
    public class GHRank
    {
        [DisplayName("暱稱")]
        public string Nickname { get; set; }
        [DisplayName("性別")]
        public string Gender { get; set; }
        [DisplayName("活躍分數")]
        public string Score { get; set; }
        public string Rank { get; set; }
    }
}
