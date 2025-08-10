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
        private readonly ReservationRepository _repository;

        public ReservationsController(ReservationRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Get all reservations
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetAll()
        {
            var reservations = await _repository.GetAll();
            return Ok(reservations);
        }

        /// <summary>
        /// Get all reservations as models
        /// </summary>
        [HttpGet("models")]
        public async Task<ActionResult<List<ReservationModel>>> GetAllModels()
        {
            var models = await _repository.GetAll<ReservationModel>();
            return Ok(models);
        }

        /// <summary>
        /// Get reservation by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Reservation>> GetById(int id)
        {
            var reservation = await _repository.GetById(id);
            if (reservation == null)
            {
                return NotFound();
            }
            return Ok(reservation);
        }

        /// <summary>
        /// Create a new reservation
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Reservation>> Create([FromBody] Reservation reservation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _repository.Create(reservation);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        /// <summary>
        /// Update an existing reservation
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<Reservation>> Update(int id, [FromBody] Reservation reservation)
        {
            if (id != reservation.Id)
            {
                return BadRequest("ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existing = await _repository.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            var updated = await _repository.Update(reservation);
            return Ok(updated);
        }

        /// <summary>
        /// Delete a reservation
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _repository.Delete(id);
            if (!deleted)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
