using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LB.Model
{
    public class GFLogin
    {
        [DisplayName("帳號")]
        public string UserID { get; set; }
        [DisplayName("暱稱")]
        public string NickName { get; set; }
        [DisplayName("電話")]
        public string Phone { get; set; }
    }
}
