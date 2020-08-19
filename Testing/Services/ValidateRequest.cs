using System;
using System.Threading.Tasks;
using Testing.ServicesModels;
using Microsoft.AspNetCore.Http;

namespace Testing.Services
{
    public class ValidateRequest
    {
        public ValidateRequest()
        {
        }
        public virtual async Task<DataShell> ValidateAsync(IQueryCollection requestParams, IValidator validator, Func<IQueryCollection, Task<DataShell>> dbMethod)
        {
            var result = validator.Validate(requestParams);
            if (result.error == null)
            {
                return await dbMethod(requestParams);
            }
            else
            {
                return result;
            }
        }

        public virtual async Task<DataShell> ValidateAsync(IValidator validator, Func<IValidator, Task<DataShell>> dbMethod)
        {
            var result = validator.Validate();
            if (result.error == null)
            {
                return await dbMethod(validator);
            }
            else
            {
                return result;
            }
        }
    }
}
