using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contoso.Data
{
    public class ReservationRepository
    {
        private readonly AppHotelDbContext _context;

        public ReservationRepository(AppHotelDbContext context)
        {
            _context = context;
        }

        public async Task<List<T>> GetAll<T>()
        {
            return await _context
                .Reservations
                .Include(x => x.Room)
                .Include(x => x.Guest)
                .ProjectTo<T>(null)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reservation>> GetAll()
        {
            return await _context
                .Reservations
                .Include(x => x.Room)
                .Include(x => x.Guest)
                .ToListAsync();
        }

        public async Task<Reservation> GetById(int id)
        {
            return await _context
                .Reservations
                .Include(x => x.Room)
                .Include(x => x.Guest)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Reservation> Create(Reservation reservation)
        {
            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();
            return reservation;
        }

        public async Task<Reservation> Update(Reservation reservation)
        {
            _context.Entry(reservation).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return reservation;
        }

        public async Task<bool> Delete(int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
                return false;

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();
            return true;
        }

        // Guest operations
        public async Task<IEnumerable<Guest>> GetAllGuests()
        {
            return await _context.Guests.ToListAsync();
        }

        public async Task<Guest> GetGuestById(int id)
        {
            return await _context.Guests.FindAsync(id);
        }

        public async Task<Guest> CreateGuest(Guest guest)
        {
            _context.Guests.Add(guest);
            await _context.SaveChangesAsync();
            return guest;
        }

        public async Task<Guest> UpdateGuest(Guest guest)
        {
            _context.Entry(guest).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return guest;
        }

        public async Task<bool> DeleteGuest(int id)
        {
            var guest = await _context.Guests.FindAsync(id);
            if (guest == null)
                return false;

            _context.Guests.Remove(guest);
            await _context.SaveChangesAsync();
            return true;
        }

        // Room operations
        public async Task<IEnumerable<Room>> GetAllRooms()
        {
            return await _context.Rooms.ToListAsync();
        }

        public async Task<Room> GetRoomById(int id)
        {
            return await _context.Rooms.FindAsync(id);
        }

        public async Task<Room> CreateRoom(Room room)
        {
            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();
            return room;
        }

        public async Task<Room> UpdateRoom(Room room)
        {
            _context.Entry(room).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return room;
        }

        public async Task<bool> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
                return false;

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();
            return true;
        }
    }

}
