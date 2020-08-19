using System;
using System.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Testing.Models;
using Testing.ServicesModels;

namespace Testing.Services
{
    public class DbInitializer
    {
        private readonly IDb _modelContext;
        private readonly ILogger<DbInitializer> _logger;
        private readonly SupportingMethods _supportingMethods;

        public DbInitializer(MainContext modelContext,
             ILogger<DbInitializer> logger,
             SupportingMethods supportingMethods)
        {
            _modelContext = modelContext;
            _logger = logger;
            _supportingMethods = supportingMethods;
        }

        public bool CreateDb()
        {
            if (_modelContext.CreateDb())
            {
                return InitializeAdmin(_supportingMethods.GetConfigurationSection("appsettings.json"));
            } else
            {
                _logger.LogError("Create DB fail!");
                return false;
            }

        }

        public bool InitializeAdmin(IConfigurationSection adminOptions)
        {
            try
            {            
                if (adminOptions != null)
                {
                    string adminLogin = adminOptions.GetSection("login").Value;
                    string adminPassword = adminOptions.GetSection("password").Value;
                    if (adminLogin == null || adminPassword == null)
                    {
                        _logger.LogError("Fail initialize login or password subsection in appsettings.json");
                        return false;
                    }
                    if (_modelContext.SelectAsync<User,User>().Result.Count() == 0)//predicate: user=>user.Login == adminLogin
                    {
                        var admin = new User { Login = adminLogin, Password = _supportingMethods.GetHashString(adminPassword) };
                        var result = _modelContext.InsertAsync(admin).Result;
                        if (result.error != null)
                        {
                            _logger.LogError("Fail create admin user");
                            return false;
                        }
                    }
                    return true;
                }
                else
                {
                    _logger.LogError("Fail initialize admin section in appsettings.json");
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fail initialize admin");
                return false;
            }
        }
    }
}
