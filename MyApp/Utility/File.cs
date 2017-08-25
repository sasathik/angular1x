using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyApp.DataModel
{
    public partial class File
    {
        public List<File> Childrens { get; set; }
    }
}