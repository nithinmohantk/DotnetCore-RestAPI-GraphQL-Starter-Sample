using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contoso.Data
{
    public class AppHotelDbContext : DbContext
    {
        public static string DbConnectionString = "Server=localhost; Database=AppHotelDb; Trusted_Connection=True;";

        public AppHotelDbContext(DbContextOptions<AppHotelDbContext> options)
            : base(options)
        { }

        public DbSet<Reservation> Reservations { get; set; }

        public DbSet<Guest> Guests { get; set; }

        public DbSet<Room> Rooms { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //GUESTS
            modelBuilder.Entity<Guest>().HasData(new Guest("Alper Ebicoglu", DateTime.Now.AddDays(-10)) { Id = 1 });
            modelBuilder.Entity<Guest>().HasData(new Guest("George Michael", DateTime.Now.AddDays(-5)) { Id = 2 });
            modelBuilder.Entity<Guest>().HasData(new Guest("Daft Punk", DateTime.Now.AddDays(-1)) { Id = 3 });

            //ROOMS
            modelBuilder.Entity<Room>().HasData(new Room(101, "yellow-room", RoomStatus.Available, false) { Id = 1 });
            modelBuilder.Entity<Room>().HasData(new Room(102, "blue-room", RoomStatus.Available, false) { Id = 2 });
            modelBuilder.Entity<Room>().HasData(new Room(103, "white-room", RoomStatus.Unavailable, false) { Id = 3 });
            modelBuilder.Entity<Room>().HasData(new Room(104, "black-room", RoomStatus.Unavailable, false) { Id = 4 });

            //RESERVATIONS
            modelBuilder.Entity<Reservation>().HasData(new Reservation(DateTime.Now.AddDays(-2), DateTime.Now.AddDays(3), 3, 1) { Id = 1 });
            modelBuilder.Entity<Reservation>().HasData(new Reservation(DateTime.Now.AddDays(-1), DateTime.Now.AddDays(4), 4, 2) { Id = 2 });

            base.OnModelCreating(modelBuilder);
        }
    }

}
