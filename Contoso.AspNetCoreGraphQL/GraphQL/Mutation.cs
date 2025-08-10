using Contoso.Data;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Threading.Tasks;

namespace Contoso.AspNetCoreGraphQL.GraphQL
{
    public class Mutation
    {
        // Reservation mutations
        public async Task<Reservation> CreateReservation(
            DateTime checkinDate,
            DateTime checkoutDate,
            int roomId,
            int guestId,
            [Service] ReservationRepository repository)
        {
            var reservation = new Reservation(checkinDate, checkoutDate, roomId, guestId);
            return await repository.Create(reservation);
        }

        public async Task<Reservation> UpdateReservation(
            int id,
            DateTime checkinDate,
            DateTime checkoutDate,
            int roomId,
            int guestId,
            [Service] ReservationRepository repository)
        {
            var reservation = new Reservation(checkinDate, checkoutDate, roomId, guestId)
            {
                Id = id
            };
            return await repository.Update(reservation);
        }

        public async Task<bool> DeleteReservation(int id, [Service] ReservationRepository repository)
        {
            return await repository.Delete(id);
        }

        // Guest mutations
        public async Task<Guest> CreateGuest(
            string name,
            DateTime registerDate,
            [Service] ReservationRepository repository)
        {
            var guest = new Guest(name, registerDate);
            return await repository.CreateGuest(guest);
        }

        public async Task<Guest> UpdateGuest(
            int id,
            string name,
            DateTime registerDate,
            [Service] ReservationRepository repository)
        {
            var guest = new Guest(name, registerDate)
            {
                Id = id
            };
            return await repository.UpdateGuest(guest);
        }

        public async Task<bool> DeleteGuest(int id, [Service] ReservationRepository repository)
        {
            return await repository.DeleteGuest(id);
        }

        // Room mutations
        public async Task<Room> CreateRoom(
            int number,
            string name,
            RoomStatus status,
            bool allowedSmoking,
            [Service] ReservationRepository repository)
        {
            var room = new Room(number, name, status, allowedSmoking);
            return await repository.CreateRoom(room);
        }

        public async Task<Room> UpdateRoom(
            int id,
            int number,
            string name,
            RoomStatus status,
            bool allowedSmoking,
            [Service] ReservationRepository repository)
        {
            var room = new Room(number, name, status, allowedSmoking)
            {
                Id = id
            };
            return await repository.UpdateRoom(room);
        }

        public async Task<bool> DeleteRoom(int id, [Service] ReservationRepository repository)
        {
            return await repository.DeleteRoom(id);
        }
    }
}