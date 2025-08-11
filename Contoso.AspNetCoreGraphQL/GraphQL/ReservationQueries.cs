using Contoso.Data;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Contoso.AspNetCoreGraphQL.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class ReservationQueries
    {
        public async Task<IEnumerable<Reservation>> GetReservations([Service] ReservationRepository repository)
        {
            return await repository.GetAll();
        }

        public async Task<Reservation> GetReservation(int id, [Service] ReservationRepository repository)
        {
            return await repository.GetById(id);
        }

        public async Task<IEnumerable<Guest>> GetGuests([Service] ReservationRepository repository)
        {
            return await repository.GetAllGuests();
        }

        public async Task<Guest> GetGuest(int id, [Service] ReservationRepository repository)
        {
            return await repository.GetGuestById(id);
        }

        public async Task<IEnumerable<Room>> GetRooms([Service] ReservationRepository repository)
        {
            return await repository.GetAllRooms();
        }

        public async Task<Room> GetRoom(int id, [Service] ReservationRepository repository)
        {
            return await repository.GetRoomById(id);
        }
    }
}