using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Contoso.AspNetCoreGraphQL.Models;
using Contoso.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Contoso.AspNetCoreGraphQL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {

        private readonly ReservationRepository _reservationRepository;

        public ReservationsController(ReservationRepository reservationRepository)
        {
            _reservationRepository = reservationRepository;
        }

        [HttpGet("[action]")]
        public async Task<List<ReservationModel>> List()
        {
            return await _reservationRepository.GetAll<ReservationModel>();
        }
    }
}
