using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.Data;
using Server.Helpers;
using Server.Models;
using Server.ViewModels;

namespace Server.Services
{
    public class EmployeeService : IEmployeeService
    {
        private IEmployeeRepository _empRepository;
        public EmployeeService(IEmployeeRepository empRepository)
        {
            _empRepository = empRepository;
        }

        public EmployeeViewModel GetEmployees(Pagination emp)
        {
            var employeeInfo = _empRepository.GetEmployees(emp.ItemsPerPage, emp.CurrentPage).Result;
            var empModel = new EmployeeViewModel(employeeInfo.dataList, employeeInfo.CurrentPage, employeeInfo.PageSize, employeeInfo.TotalCount, employeeInfo.TotalPages);
            return empModel;
        }
        public Task<bool> SaveEmployee(Employee employee)
        {
                if (employee.Id == 0)
                {
                    _empRepository.AddEmployee(employee);
                }
                else
                {
                    _empRepository.UpdateEmployee(employee);
                }
          return  _empRepository.SaveAll();

        }

        public Task<bool> DeleteEmployee(int empId)
        {
            
            _empRepository.DeleteEmployee(empId);
          return  _empRepository.SaveAll();
        }

        public Task<EmployeeStatistics> GetStatistics()
        {
            EmployeeStatistics stats = new EmployeeStatistics();
            var employees = _empRepository.GetEmployeesForStats();
            stats.CurrentEmployeeCount = employees.Where(x => x.IsDeleted != true).Count();
            stats.DeletedEmployeeCount = employees.Where(x => x.IsDeleted == true).Count();
            stats.ModifiedEmployeeCount = employees.Where(x => x.IsDeleted != true && x.ModifiedDate != null).Count();
            stats.TotalEmployeeCount = employees.Count();

            var yearOfJoiningList = employees.Select(x => x.YearOfJoining);
            var yearOfQuitingList = employees.Where(x=>x.YearOfQuiting != 0).Select(x => (x.YearOfQuiting));
            var yearList = yearOfJoiningList.Union(yearOfQuitingList).OrderBy(x=>x);

            foreach (var year in yearList)
            {
                stats.YearList.Add(year);
                stats.EmployeeAdded.Add(employees.Where(x => x.YearOfJoining == year).Count());
                stats.EmployeeDeleted.Add(employees.Where(x => x.IsDeleted==true && x.YearOfQuiting == year).Count());
            }

            return Task.FromResult<EmployeeStatistics>(stats);
        }
    }
}