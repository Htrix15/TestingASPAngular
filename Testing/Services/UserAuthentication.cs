using System.Threading.Tasks;
using Testing.Models;
using Testing.ServicesModels;

namespace Testing.Services
{
    public class UserAuthentication
    {
        private readonly DbOperations _dbOperations;
        private readonly SupportingMethods _supportingMethods; 
        public UserAuthentication(DbOperations dbOperations, SupportingMethods supportingMethods)
        {
            _dbOperations = dbOperations;
            _supportingMethods = supportingMethods;
        }

        public async Task<DataShell> AuthenticationAsync(IValidator user)
        {
            var result = new DataShell();
            var hashPassword = await _dbOperations.GetUserHashPasswordAsync(((User)user).Login);

            if (hashPassword.stringData == null)
            {
                result.error = "User not found";
                return result;
            }
            if (hashPassword.error != null)
            {
                result.error = hashPassword.error;
                return result;
            }
            if (_supportingMethods.GetHashString(((User)user).Password) != hashPassword.stringData)
            {
                result.error = "Password incorrect";
                return result;
            }

            return result;
        }


        public virtual async Task<DataShell> ChangeLoginAsync(IValidator logins)
        {
            return await _dbOperations.ChangeLoginAsync(((ChangeUser)logins));
        }

        public async Task<DataShell> ChangePasswordAsync(IValidator passwords)
        {
            ((ChangeUser)passwords).oldValue = _supportingMethods.GetHashString(((ChangeUser)passwords).oldValue);
            ((ChangeUser)passwords).newValue = _supportingMethods.GetHashString(((ChangeUser)passwords).newValue);
            return await _dbOperations.ChangePasswordAsync((ChangeUser)passwords);
        }
    }
}
