using Xunit;
using Moq;
using Testing.Services;
using Testing.ServicesModels;
using Testing.Models;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace UnitTestApp.Tests
{
    public class ValidateRequestTests
    {
        Mock<IValidator> mockValidator;
        Mock<DbOperations> mockDbOperations;
        Mock<UserAuthentication> mockUserAuthentication;
        Mock<IQueryCollection> mockRequestParams;
        public ValidateRequestTests()
        {
            mockValidator = new Mock<IValidator>();
            var mockMainContext = new Mock<MainContext>(new DbContextOptions<MainContext>());
            var mockLogger = new Mock<ILogger<DbOperations>>();
            mockDbOperations = new Mock<DbOperations>(mockLogger.Object, mockMainContext.Object);
            var mockSupportingMethods = new Mock<SupportingMethods>();
            mockUserAuthentication = new Mock<UserAuthentication>(mockDbOperations.Object, mockSupportingMethods.Object);
            mockRequestParams = new Mock<IQueryCollection>();
        }
        [Fact]
        public void ValidateAsync2p_validValidate()
        {
            mockValidator
                .Setup(m => m.Validate())
                .Returns(new DataShell());  
            mockUserAuthentication
                .Setup(m => m.ChangeLoginAsync(It.IsAny<IValidator>()))
                .Returns(Task.FromResult(new DataShell()));

            var service = new ValidateRequest();

            var result = service.ValidateAsync(mockValidator.Object, mockUserAuthentication.Object.ChangeLoginAsync).Result;

            Assert.Null(result.datas);
            Assert.Null(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
        }

        [Fact]
        public void ValidateAsync2p_invalidDb()
        {
            mockValidator
                .Setup(m => m.Validate())
                .Returns(new DataShell());
            mockUserAuthentication
                .Setup(m => m.ChangeLoginAsync(It.IsAny<IValidator>()))
                .Returns(Task.FromResult(new DataShell("Error")));

            var service = new ValidateRequest();

            var result = service.ValidateAsync(mockValidator.Object, mockUserAuthentication.Object.ChangeLoginAsync).Result;

            Assert.Null(result.datas);
            Assert.NotNull(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
            Assert.Equal("Error", result.error);
        }

        [Fact]
        public void ValidateAsync2p_invalidValidate()
        {
            mockValidator
                .Setup(m => m.Validate())
                .Returns(new DataShell("Error"));
            mockUserAuthentication
                .Setup(m => m.ChangeLoginAsync(It.IsAny<IValidator>()))
                .Returns(Task.FromResult(new DataShell()));

            var service = new ValidateRequest();

            var result = service.ValidateAsync(mockValidator.Object, mockUserAuthentication.Object.ChangeLoginAsync).Result;

            Assert.Null(result.datas);
            Assert.NotNull(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
            Assert.Equal("Error", result.error);
        }

        [Fact]
        public void ValidateAsync3p_validValidate()
        {
            mockValidator
                .Setup(m => m.Validate(It.IsAny<IQueryCollection>()))
                .Returns(new DataShell());
            mockDbOperations
                .Setup(m => m.GetStartAsync(It.IsAny<IQueryCollection>()))
                .Returns(Task.FromResult(new DataShell()));

            var service = new ValidateRequest();

            var result = service.ValidateAsync(mockRequestParams.Object, mockValidator.Object, mockDbOperations.Object.GetStartAsync).Result;

            Assert.Null(result.datas);
            Assert.Null(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
        }

        [Fact]
        public void ValidateAsync3p_invalidValidate()
        {
            mockValidator
                .Setup(m => m.Validate(It.IsAny<IQueryCollection>()))
                .Returns(new DataShell("Error"));
            mockDbOperations
                .Setup(m => m.GetStartAsync(It.IsAny<IQueryCollection>()))
                .Returns(Task.FromResult(new DataShell()));

            var service = new ValidateRequest();

            var result = service.ValidateAsync(mockRequestParams.Object, mockValidator.Object, mockDbOperations.Object.GetStartAsync).Result;

            Assert.Null(result.datas);
            Assert.NotNull(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
            Assert.Equal("Error", result.error);
        }

        [Fact]
        public void ValidateAsync3p_invalidDb()
        {
            mockValidator
                .Setup(m => m.Validate(It.IsAny<IQueryCollection>()))
                .Returns(new DataShell());

            mockDbOperations
                .Setup(m => m.GetStartAsync(It.IsAny<IQueryCollection>()))
                .Returns(Task.FromResult(new DataShell("Error")));

            var service = new ValidateRequest();

            var result = service.ValidateAsync(mockRequestParams.Object, mockValidator.Object, mockDbOperations.Object.GetStartAsync).Result;

            Assert.Null(result.datas);
            Assert.NotNull(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
            Assert.Equal("Error", result.error);
        }

    }
}
