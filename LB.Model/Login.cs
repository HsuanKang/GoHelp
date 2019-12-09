using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LB.Model
{
    public class Login
    {
        [DisplayName("帳號")]
        public string Account { get; set; }
        [DisplayName("密碼")]
        public string Passwd { get; set; }
    }
}
