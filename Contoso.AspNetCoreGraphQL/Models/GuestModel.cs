using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Contoso.AspNetCoreGraphQL.Models
{
    public class GuestModel
    {
        public int Id { get; set; }


        public string Name { get; set; }

        public DateTime RegisterDate { get; set; }

        public GuestModel()
        {

        }

        public GuestModel(string name, DateTime registerDate)
        {
            Name = name;
            RegisterDate = registerDate;
        }
    }

}
