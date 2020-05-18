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
        private readonly AppHotelDbContext _AppHotelDbContext;

        public ReservationRepository(AppHotelDbContext AppHotelDbContext)
        {
            _AppHotelDbContext = AppHotelDbContext;
        }

        public async Task<List<T>> GetAll<T>()
        {
            return await _AppHotelDbContext
                .Reservations
                .Include(x => x.Room)
                .Include(x => x.Guest)
                .ProjectTo<T>(null)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reservation>> GetAll()
        {
            return await _AppHotelDbContext
                .Reservations
                .Include(x => x.Room)
                .Include(x => x.Guest)
                .ToListAsync();
        }
    }

}
