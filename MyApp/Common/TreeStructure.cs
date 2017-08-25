using MyApp.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyApp.Common
{
    public class TreeStructure
    {
        public void GetTreeView(List<File> list, File current, ref List<File> returnList)
        {
            var childs = list.Where(a => a.ParentID == current.ID).ToList();
            current.Childrens = new List<File>();
            current.Childrens.AddRange(childs);
            foreach (var i in childs)
            {
                this.GetTreeView(list, i, ref returnList);
            }
        }

        public List<File> BuildTree(List<File> list)
        {
            List<File> returnList = new List<File>();
            //find top levels items
            var topLevels = list.Where(a => a.ParentID == list.OrderBy(b => b.ParentID).FirstOrDefault().ParentID);
            returnList.AddRange(topLevels);
            foreach (var i in topLevels)
            {
                this.GetTreeView(list, i, ref returnList);
            }
            return returnList;
        }
    }
}