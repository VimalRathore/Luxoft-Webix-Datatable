using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.Helpers;
using Server.Models;
using Server.ViewModels;

namespace Server.Services
{
    public interface IEmployeeService
    {
        EmployeeViewModel GetEmployees(Pagination emp);
        Task<bool> SaveEmployee(Employee Emp);
        Task<bool> DeleteEmployee(int empId);
        Task<EmployeeStatistics> GetStatistics();
    }
}