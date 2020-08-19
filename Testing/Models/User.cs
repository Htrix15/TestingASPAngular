using System.Collections.Generic;
using Testing.ServicesModels;
using System.ComponentModel.DataAnnotations;

namespace Testing.Models
{
    public class User : IData, IValidator
    {
        public int? Id { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public User() { }
        public User(int? Id, string Login, string Password) {
            this.Id = Id;
            this.Login = Login; this.Password = Password;
        }

        public DataShell Validate()
        {
            List<ValidationResult> errors = new List<ValidationResult>();
            if (Login?.Length < 5 || Password?.Length < 5)
            {
                errors.Add(new ValidationResult("Minimum length is 5 characters! "));
            }
            if (errors.Count == 0)
            {
                return new DataShell();
            }
            string errorsMessage = "";
            foreach (var error in errors)
            {
                errorsMessage += error.ErrorMessage;
            }
            return new DataShell(errorsMessage);
        }
    }
}
