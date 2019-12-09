using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LB.Common
{
    public class ConfigTool
    {
        //取得連線字串(Web.config)
        public static string GetDBConnectionString(string connName)
        {
            return
                System.Configuration.ConfigurationManager.ConnectionStrings[connName].ConnectionString.ToString();
        }

        internal static string GetAppsetting(string v)
        {
            throw new NotImplementedException();
        }
    }
}
