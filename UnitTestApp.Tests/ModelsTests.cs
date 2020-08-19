using Xunit;
using Moq;
using Testing.Models;

namespace UnitTestApp.Tests
{
    public class ModelsTests
    {
        [Fact]
        public void User_valid()
        {
            var user = new User(1, "Login", "Passsword");

            var result = user.Validate();

            Assert.Null(result.error);
        }

        [Fact]
        public void User_invalidLengt()
        {
            var user = new User(1, "L", "Passsword");

            var result = user.Validate();

            Assert.NotNull(result.error);
            Assert.Equal("Minimum length is 5 characters! ", result.error);
        }

        [Fact]
        public void ChangeUser_valid()
        {
            var changeUser = new ChangeUser("oldValue", "newValue");

            var result = changeUser.Validate();

            Assert.Null(result.error);
        }

        [Fact]
        public void ChangeUser_invalidNullValue()
        {
            var changeUser = new ChangeUser(null, "newValue");

            var result = changeUser.Validate();

            Assert.NotNull(result.error);
            Assert.Equal("Value isn't be empty! ", result.error);
        }

        [Fact]
        public void ChangeUser_invalidChange()
        {
            var changeUser = new ChangeUser("oldValue", "oldValue");

            var result = changeUser.Validate();

            Assert.NotNull(result.error);
            Assert.Equal("Value isn't change! ", result.error);
        }

        [Fact]
        public void ChangeUser_invalidLengt()
        {
            var changeUser = new ChangeUser("o", "oldValue");

            var result = changeUser.Validate();

            Assert.NotNull(result.error);
            Assert.Equal("Minimum length is 5 characters! ", result.error);
        }


    }
}
