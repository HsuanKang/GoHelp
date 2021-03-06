﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LB.Model
{
    public class GFUser
    {
        [DisplayName("帳號")]
        public string UserID { get; set; }
        [DisplayName("密碼")]
        public string User_Password { get; set; }
        [DisplayName("暱稱")]
        public string Nickname { get; set; }
        [DisplayName("電話")]
        public string Phone { get; set; }
        [DisplayName("性別")]
        public Boolean Gender { get; set; }
        [DisplayName("信箱")]
        public string Email { get; set; }
    }
}
