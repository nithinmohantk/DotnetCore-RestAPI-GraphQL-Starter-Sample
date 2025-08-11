# .NET Core REST API & GraphQL Starter Sample

A complete starter sample demonstrating best practices for building modern web applications with .NET Core WebAPI backend, GraphQL integration using HotChocolate, and React frontend.

## 🚀 Features

### Backend Technologies
- **.NET Core 3.1** - Cross-platform web API framework
- **Entity Framework Core** - Object-relational mapping (ORM)
- **HotChocolate GraphQL** - Modern GraphQL server
- **AutoMapper** - Object-to-object mapping
- **Repository Pattern** - Clean data access abstraction
- **SQL Server** - Database engine (configurable)

### Frontend Technologies
- **React 18** with **TypeScript** - Modern UI framework
- **Apollo Client** - GraphQL client with caching
- **Axios** - HTTP client for REST API calls
- **React Bootstrap** - UI component library
- **React Router** - Client-side routing

### API Features
- **REST API** endpoints with full CRUD operations
- **GraphQL** queries and mutations
- **Dual API demonstration** - Switch between REST and GraphQL in UI
- **Entity relationships** - Guest, Room, and Reservation management
- **Error handling** and validation
- **CORS** enabled for development

## 🏗️ Project Structure

```
├── Contoso.AspNetCoreGraphQL/          # Main web application
│   ├── Controllers/                    # REST API controllers
│   │   ├── GuestsController.cs
│   │   ├── RoomsController.cs
│   │   └── ReservationsController.cs
│   ├── GraphQL/                        # GraphQL schema and resolvers
│   │   ├── Query.cs
│   │   ├── Mutation.cs
│   │   └── ReservationQueries.cs
│   ├── Models/                         # View models
│   ├── ClientApp/                      # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── GuestList.tsx
│   │   │   │   ├── RoomList.tsx
│   │   │   │   └── ReservationList.tsx
│   │   │   ├── apolloClient.ts
│   │   │   └── App.tsx
│   │   └── package.json
│   ├── Startup.cs
│   └── Program.cs
├── Contoso.Data/                       # Data access layer
│   ├── Entities/                       # Entity models
│   │   ├── Guest.cs
│   │   ├── Room.cs
│   │   ├── Reservation.cs
│   │   └── RoomStatus.cs
│   ├── ReservationRepository.cs        # Data repository
│   └── AppHotelDbContext.cs            # Entity Framework context
└── README.md
```

## 🛠️ Prerequisites

- [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download)
- [Node.js 16+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server) or SQL Server Express

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/nithinmohantk/DotnetCore-RestAPI-GraphQL-Starter-Sample.git
cd DotnetCore-RestAPI-GraphQL-Starter-Sample
```

### 2. Configure Database Connection
Update the connection string in `Contoso.Data/AppHotelDbContext.cs`:
```csharp
public static string DbConnectionString => 
    "Server=(localdb)\\mssqllocaldb;Database=ContosoHotelDb;Trusted_Connection=true;";
```

### 3. Setup Backend
```bash
# Restore packages
dotnet restore

# Apply database migrations
dotnet ef database update --project Contoso.Data --startup-project Contoso.AspNetCoreGraphQL

# Build the solution
dotnet build
```

### 4. Setup Frontend
```bash
cd Contoso.AspNetCoreGraphQL/ClientApp

# Install dependencies
npm install

# Return to root directory
cd ../..
```

### 5. Run the Application
```bash
# Run the application (this will start both backend and frontend)
dotnet run --project Contoso.AspNetCoreGraphQL
```

The application will start:
- **Backend API**: https://localhost:5001
- **Frontend**: https://localhost:5001 (served by ASP.NET Core)
- **GraphQL Playground**: https://localhost:5001/graphql

## 📚 API Documentation

### REST API Endpoints

#### Guests
- `GET /api/guests` - Get all guests
- `GET /api/guests/{id}` - Get guest by ID
- `POST /api/guests` - Create new guest
- `PUT /api/guests/{id}` - Update guest
- `DELETE /api/guests/{id}` - Delete guest

#### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/{id}` - Get room by ID
- `POST /api/rooms` - Create new room
- `PUT /api/rooms/{id}` - Update room
- `DELETE /api/rooms/{id}` - Delete room

#### Reservations
- `GET /api/reservations` - Get all reservations
- `GET /api/reservations/{id}` - Get reservation by ID
- `POST /api/reservations` - Create new reservation
- `PUT /api/reservations/{id}` - Update reservation
- `DELETE /api/reservations/{id}` - Delete reservation

### Sample REST API Requests

#### Create a Guest
```bash
curl -X POST https://localhost:5001/api/guests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "registerDate": "2025-01-01T00:00:00Z"
  }'
```

#### Create a Room
```bash
curl -X POST https://localhost:5001/api/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "number": 101,
    "name": "Deluxe Suite",
    "status": 0,
    "allowedSmoking": false
  }'
```

#### Create a Reservation
```bash
curl -X POST https://localhost:5001/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "guestId": 1,
    "roomId": 1,
    "checkinDate": "2025-01-15T14:00:00Z",
    "checkoutDate": "2025-01-18T11:00:00Z"
  }'
```

### GraphQL Examples

#### Query All Guests
```graphql
query {
  guests {
    id
    name
    registerDate
  }
}
```

#### Query Reservations with Related Data
```graphql
query {
  reservations {
    id
    checkinDate
    checkoutDate
    guest {
      name
    }
    room {
      number
      name
    }
  }
}
```

#### Create a Guest (Mutation)
```graphql
mutation {
  createGuest(name: "Jane Smith", registerDate: "2025-01-01T00:00:00Z") {
    id
    name
    registerDate
  }
}
```

#### Create a Room (Mutation)
```graphql
mutation {
  createRoom(number: 102, name: "Standard Room", status: AVAILABLE, allowedSmoking: false) {
    id
    number
    name
    status
  }
}
```

## 🎯 Key Features Demonstrated

### 1. Dual API Approach
The frontend allows switching between REST API and GraphQL for the same operations, demonstrating:
- REST API calls using Axios
- GraphQL queries and mutations using Apollo Client
- Consistent data handling between both approaches

### 2. Entity Relationships
The sample demonstrates proper handling of:
- One-to-many relationships (Guest → Reservations, Room → Reservations)
- Foreign key constraints
- Related data loading in both REST and GraphQL

### 3. Error Handling
- Client-side error handling for both REST and GraphQL
- Server-side validation and error responses
- User-friendly error messages in the UI

### 4. Modern React Patterns
- TypeScript for type safety
- React Hooks for state management
- Component composition
- Responsive UI with Bootstrap

## 🔧 Development Tips

### Running Frontend in Development Mode
For faster frontend development, you can run the React app separately:

```bash
cd Contoso.AspNetCoreGraphQL/ClientApp
npm start
```

Then update `Startup.cs` to use the proxy:
```csharp
spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
```

### Database Migrations
To create new migrations after model changes:
```bash
dotnet ef migrations add MigrationName --project Contoso.Data --startup-project Contoso.AspNetCoreGraphQL
dotnet ef database update --project Contoso.Data --startup-project Contoso.AspNetCoreGraphQL
```

### GraphQL Schema Exploration
Visit `/graphql` in your browser to access the GraphQL Playground where you can:
- Explore the schema
- Test queries and mutations
- View documentation

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Acknowledgments

- Built with [.NET Core](https://dotnet.microsoft.com/)
- GraphQL powered by [HotChocolate](https://chillicream.com/docs/hotchocolate/)
- Frontend built with [React](https://reactjs.org/)
- UI components from [React Bootstrap](https://react-bootstrap.github.io/)

---

## 🚀 Quick Start Commands

```bash
# Clone and setup
git clone https://github.com/nithinmohantk/DotnetCore-RestAPI-GraphQL-Starter-Sample.git
cd DotnetCore-RestAPI-GraphQL-Starter-Sample

# Build and run
dotnet restore
dotnet ef database update --project Contoso.Data --startup-project Contoso.AspNetCoreGraphQL
cd Contoso.AspNetCoreGraphQL/ClientApp && npm install && cd ../..
dotnet run --project Contoso.AspNetCoreGraphQL
```

Navigate to `https://localhost:5001` to start exploring the application!
