using Testing.ServicesModels;
using Microsoft.AspNetCore.Http;

namespace Testing.RequestValidatorsModels
{
    public class GetStart : IValidator
    {
        public DataShell Validate(IQueryCollection requestParams)
        {
            if (!requestParams.ContainsKey("count")
               || !int.TryParse(requestParams["count"], out int outInt)
                )
            {
                var result = new DataShell("invalid query parametrs");
                return result;
            }
            return new DataShell();
        }
    }
}
