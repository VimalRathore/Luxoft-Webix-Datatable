using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Services;
using Server.Helpers;
using Server.ViewModels;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _empService;

        public EmployeeController(IEmployeeService empService)
        {
            this._empService = empService;
        }
        // GET api/Employee
        [HttpGet("GetEmployees/{CurrentPage}/{ItemsPerPage}")]
        public IActionResult GetEmployees(int CurrentPage, int ItemsPerPage)
        {
            return Ok(_empService.GetEmployees(new Pagination() { CurrentPage = CurrentPage, ItemsPerPage = ItemsPerPage }));
        }

        [HttpPost("SaveEmployees")]
        public async Task<IActionResult> SaveEmployees(Employee emp)
        {
            return Ok(await _empService.SaveEmployee(emp));
        }

        [HttpPost("DeleteEmployees/{empId}")]
        public async Task<IActionResult> DeleteEmployees(int empId)
        {
            return Ok(await _empService.DeleteEmployee(empId));
        }

        [HttpGet("EmployeeStatistics")]
        public async Task<IActionResult> EmployeeStatistics()
        {
            return Ok(await _empService.GetStatistics());
        }

    }
}
