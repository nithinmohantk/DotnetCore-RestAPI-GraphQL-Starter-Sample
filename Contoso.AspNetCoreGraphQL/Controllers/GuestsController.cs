using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Contoso.Data;
using Microsoft.AspNetCore.Mvc;

namespace Contoso.AspNetCoreGraphQL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GuestsController : ControllerBase
    {
        private readonly ReservationRepository _repository;

        public GuestsController(ReservationRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Get all guests
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Guest>>> GetAll()
        {
            var guests = await _repository.GetAllGuests();
            return Ok(guests);
        }

        /// <summary>
        /// Get guest by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Guest>> GetById(int id)
        {
            var guest = await _repository.GetGuestById(id);
            if (guest == null)
            {
                return NotFound();
            }
            return Ok(guest);
        }

        /// <summary>
        /// Create a new guest
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Guest>> Create([FromBody] Guest guest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _repository.CreateGuest(guest);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        /// <summary>
        /// Update an existing guest
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<Guest>> Update(int id, [FromBody] Guest guest)
        {
            if (id != guest.Id)
            {
                return BadRequest("ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existing = await _repository.GetGuestById(id);
            if (existing == null)
            {
                return NotFound();
            }

            var updated = await _repository.UpdateGuest(guest);
            return Ok(updated);
        }

        /// <summary>
        /// Delete a guest
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _repository.DeleteGuest(id);
            if (!deleted)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}