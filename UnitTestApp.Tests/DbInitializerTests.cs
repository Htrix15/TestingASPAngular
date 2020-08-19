using System.Collections.Generic;
using Xunit;
using Testing.Models;
using Testing.ServicesModels;
using Testing.Services;
using Moq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace UnitTestApp.Tests
{
    public class DbInitializerTests
    {
        Mock<MainContext> mockMainContext;
        Mock<DbOperations> mockDbOperations;
        Mock<UserAuthentication> mockUserAuthentication;
        ILogger<DbInitializer> logger;
        SupportingMethods supportingMethods;
        public DbInitializerTests()
        {
            mockMainContext = new Mock<MainContext>(new DbContextOptions<MainContext>());
            var mockDbLogger = new Mock<ILogger<DbOperations>>();
            mockDbOperations = new Mock<DbOperations>(mockDbLogger.Object, mockMainContext.Object);
            supportingMethods = new Mock<SupportingMethods>().Object;
            mockUserAuthentication = new Mock<UserAuthentication>(mockDbOperations.Object, supportingMethods);
            logger = new Mock<ILogger<DbInitializer>>().Object;
        }

        private IConfigurationSection GetConfigurationSection(bool valid)
        {
            string[] args;
            if (valid)
            {
                args = new string[]{ "Admin:login=l", "Admin:password=p" };
            } else
            {
                args = new string[] { "Admin:login", "Admin:password=p" };
            }
            var builder = new ConfigurationBuilder().AddCommandLine(args);

            IConfiguration AppConfiguration = builder.Build();

            return AppConfiguration.GetSection("Admin");
        }
        [Fact]
        public void InitializeAdmin_validCreateUser()
        {
            mockMainContext
                .Setup(m => m.SelectAsync<User, User>(null, null, -1, -1))
                .Returns(Task.FromResult<IEnumerable<User>>(new List<User> { }));

            mockMainContext
                .Setup(m => m.InsertAsync<User>(It.IsAny<User>()))
                .Returns(Task.FromResult(new DataShell()));

            var service = new DbInitializer(mockMainContext.Object, logger, supportingMethods);

            var result = service.InitializeAdmin(GetConfigurationSection(true));

            Assert.True(result);
        }

        [Fact]
        public void InitializeAdmin_validNotCreateUser()
        {
            mockMainContext
                .Setup(m => m.SelectAsync<User, User>(null, null, -1, -1))
                .Returns(Task.FromResult<IEnumerable<User>>(new List<User> { new User() }));

            mockMainContext
                .Setup(m => m.InsertAsync<User>(It.IsAny<User>()))
                .Returns(Task.FromResult(new DataShell()));

            var service = new DbInitializer(mockMainContext.Object, logger, supportingMethods);

            var result = service.InitializeAdmin(GetConfigurationSection(true));

            Assert.True(result);
        }

        [Fact]
        public void InitializeAdmin_invalidConfig()
        {
            mockMainContext
                .Setup(m => m.SelectAsync<User, User>(null, null, -1, -1))
                .Returns(Task.FromResult<IEnumerable<User>>(new List<User> { }));

            mockMainContext
                .Setup(m => m.InsertAsync<User>(It.IsAny<User>()))
                .Returns(Task.FromResult(new DataShell()));

            var service = new DbInitializer(mockMainContext.Object, logger, supportingMethods);

            var result = service.InitializeAdmin(GetConfigurationSection(false));

            Assert.False(result);
        }

        [Fact]
        public void InitializeAdmin_invalidCreateUser()
        {     
            mockMainContext
                .Setup(m => m.SelectAsync<User, User>(null, null, -1, -1))
                .Returns(Task.FromResult<IEnumerable<User>>(new List<User> { }));

            mockMainContext
                .Setup(m => m.InsertAsync<User>(It.IsAny<User>()))
                .Returns(Task.FromResult(new DataShell("Error")));

            var service = new DbInitializer(mockMainContext.Object, logger, supportingMethods);

            var result = service.InitializeAdmin(GetConfigurationSection(false));

            Assert.False(result);
        }
    }
}
