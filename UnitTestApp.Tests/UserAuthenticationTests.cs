using Xunit;
using Moq;
using Testing.Services;
using Testing.ServicesModels;
using Testing.Models;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;


namespace UnitTestApp.Tests
{
    public class UserAuthenticationTests
    {
        User user;
        string hashPassword = "hashPassword";
        Mock<DbOperations> mockDbOperations;
        SupportingMethods supportingMethods;
        public UserAuthenticationTests()
        {
            user = new User(1, "login", "password");
            var mockMainContext = new Mock<MainContext>(new DbContextOptions<MainContext>());
            var mockLogger = new Mock<ILogger<DbOperations>>();
            mockDbOperations = new Mock<DbOperations>(mockLogger.Object, mockMainContext.Object);
            var mockSupportingMethods = new Mock<SupportingMethods>();
            mockSupportingMethods
                .Setup(m => m.GetHashString(It.IsAny<string>()))
                .Returns(hashPassword);
            supportingMethods = mockSupportingMethods.Object;
        }

        [Fact]
        public void AuthenticationAsync_valid()
        {
            DataShell resultHashPassword = new DataShell
            {
                stringData = hashPassword
            };

            mockDbOperations
                .Setup(m => m.GetUserHashPasswordAsync(It.IsAny<string>()))
                .Returns(Task.FromResult(resultHashPassword));


            var service = new UserAuthentication(mockDbOperations.Object, supportingMethods);
           
            var result = service.AuthenticationAsync(user).Result;

            Assert.Null(result.datas);
            Assert.Null(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
        }
        public virtual string GetHashString(string password)
        {
            return "hashPassword";
        }

        [Fact]
        public void AuthenticationAsync_invalidLogin()
        {
            DataShell resultHashPassword = new DataShell();

            mockDbOperations
                .Setup(m => m.GetUserHashPasswordAsync(user.Login))
                .Returns(Task.FromResult(resultHashPassword));

            var service = new UserAuthentication(mockDbOperations.Object, supportingMethods);

            var result = service.AuthenticationAsync(user).Result;

            Assert.Null(result.datas);
            Assert.NotNull(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
            Assert.Equal("User not found", result.error);
        }

        [Fact]
        public void AuthenticationAsync_invalidPassword()
        {
            DataShell resultHashPassword = new DataShell
            {
                stringData = "erroHashPassword"
            };

            mockDbOperations
                .Setup(m => m.GetUserHashPasswordAsync(user.Login))
                .Returns(Task.FromResult(resultHashPassword));

            var service = new UserAuthentication(mockDbOperations.Object, supportingMethods);

            var result = service.AuthenticationAsync(user).Result;

            Assert.Null(result.datas);
            Assert.NotNull(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
            Assert.Equal("Password incorrect", result.error);
        }

        [Fact]
        public void AuthenticationAsync_invalidOther()
        {
            DataShell resultHashPassword = new DataShell()
            {
                error = "Error",
                stringData = "user"
            };

            mockDbOperations
                .Setup(m => m.GetUserHashPasswordAsync(user.Login))
                .Returns(Task.FromResult(resultHashPassword));

            var service = new UserAuthentication(mockDbOperations.Object, supportingMethods);

            var result = service.AuthenticationAsync(user).Result;

            Assert.Null(result.datas);
            Assert.NotNull(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
            Assert.Equal("Error", result.error);
        }
    }
}
