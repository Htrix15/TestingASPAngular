using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;
using Testing.Models;
using Testing.ServicesModels;

namespace Testing.Services
{
    public class DbOperations
    {
        private readonly ILogger<DbOperations> _logger;
        private readonly IDb _db;
      
        public DbOperations(
            ILogger<DbOperations> logger,
            MainContext modelContext)
        {
            _db = modelContext;
            _logger = logger;
        }

        public virtual async Task<DataShell> GetUserHashPasswordAsync(string login)
        {
            var result = new DataShell();
            try
            {
                var hashPassword = await _db.SelectAsync<User, string>(users => users.Login == login, (users) => users.Password);
                result.stringData = hashPassword.FirstOrDefault();
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fail get data of DB");
                result.error = "Fail get data of DB";
                return result;
            }
        }
        
        public async Task<DataShell> ChangeLoginAsync(ChangeUser logins)
        {
            var result = new DataShell();
            try
            {
                var user = (await _db.SelectAsync<User, User>(predicate:users => users.Login == logins.oldValue)).FirstOrDefault();
                if (user == null)
                {
                    result.error = "Incorrect login";
                    return result;
                }
                user.Login = logins.newValue;
                return await _db.UpdateAsync(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fail get or set data of DB");
                result.error = "Fail get or set data of DB";
                return result;
            }
        }
        
        public async Task<DataShell> ChangePasswordAsync(ChangeUser passwords)
        {
            var result = new DataShell();
            try
            {
                var user = (await _db.SelectAsync<User, User>(predicate:users => users.Password == passwords.oldValue)).FirstOrDefault();
                if (user == null)
                {
                    result.error = "Incorrect password";
                    return result;
                }
                user.Password = passwords.newValue;
                return await _db.UpdateAsync(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fail get or set data of DB");
                result.error = "Fail get or set data of DB";
                return result;
            }
        }
        
        public virtual async Task<DataShell> GetStartAsync(IQueryCollection requestParams)
        {
            var result = new DataShell();
            try
            {
                var count = Convert.ToInt32(requestParams["count"]);
                var startDatas = await _db.SelectAsync<Model,Model>(take:count);
                if (startDatas.Count()!=0)
                {
                    result.datas = startDatas;
                    return result;
                }
                result.error = "not found";

            }
            catch (Exception ex)
            {
               _logger.LogError(ex, "Fail get data of DB");
                result.error = "Fail get data of DB";
            }

            return result;
        }


    }
}
