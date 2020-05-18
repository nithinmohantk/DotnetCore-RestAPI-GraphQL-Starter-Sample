using System;

namespace Contoso.AspNetCoreGraphQL.Models
{
    public class ReservationModel
    {
       
        public int Id { get; set; }
     
        public RoomModel Room { get; set; }
        public int RoomId { get; set; }

      
        public GuestModel Guest { get; set; }
        public int GuestId { get; set; }

      
        public DateTime CheckinDate { get; set; }

        public DateTime CheckoutDate { get; set; }

        public ReservationModel()
        {

        }

        public ReservationModel(DateTime checkinDate, DateTime checkoutDate, int roomId, int guestId)
        {
            CheckinDate = checkinDate;
            CheckoutDate = checkoutDate;
            RoomId = roomId;
            GuestId = guestId;
        }
    }

}
