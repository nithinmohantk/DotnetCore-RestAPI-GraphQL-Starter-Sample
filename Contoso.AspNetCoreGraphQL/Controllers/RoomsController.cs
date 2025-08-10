using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Contoso.Data;
using Microsoft.AspNetCore.Mvc;

namespace Contoso.AspNetCoreGraphQL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly ReservationRepository _repository;

        public RoomsController(ReservationRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Get all rooms
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Room>>> GetAll()
        {
            var rooms = await _repository.GetAllRooms();
            return Ok(rooms);
        }

        /// <summary>
        /// Get room by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> GetById(int id)
        {
            var room = await _repository.GetRoomById(id);
            if (room == null)
            {
                return NotFound();
            }
            return Ok(room);
        }

        /// <summary>
        /// Create a new room
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Room>> Create([FromBody] Room room)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _repository.CreateRoom(room);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        /// <summary>
        /// Update an existing room
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<Room>> Update(int id, [FromBody] Room room)
        {
            if (id != room.Id)
            {
                return BadRequest("ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existing = await _repository.GetRoomById(id);
            if (existing == null)
            {
                return NotFound();
            }

            var updated = await _repository.UpdateRoom(room);
            return Ok(updated);
        }

        /// <summary>
        /// Delete a room
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _repository.DeleteRoom(id);
            if (!deleted)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}