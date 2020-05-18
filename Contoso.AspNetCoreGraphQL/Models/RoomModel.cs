namespace Contoso.AspNetCoreGraphQL.Models
{
    public class RoomModel
    {
      
        public int Id { get; set; }

      
        public int Number { get; set; }

       
        public string Name { get; set; }

       
        public RoomStatus Status { get; set; }

        public bool AllowedSmoking { get; set; }

        public RoomModel()
        {

        }
        public RoomModel(int number, string name, RoomStatus status, bool allowedSmoking)
        {
            Number = number;
            Name = name;
            Status = status;
            AllowedSmoking = allowedSmoking;
        }
    }

}
