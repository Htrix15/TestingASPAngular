using System;
using Xunit;
using Moq;
using Testing.Services;
using Testing.ServicesModels;
using Testing.Models;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Testing.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace UnitTestApp.Tests
{
    public class MainControllerTests
    {
        Mock<DbOperations> mockDbOperations;
        Mock<UserAuthentication> mockUserAuthentication;
        Mock<ValidateRequest> mockValidateRequest;
        HttpContext fakeHttpContext;

        public MainControllerTests()
        {
            var mockMainContext = new Mock<MainContext>(new DbContextOptions<MainContext>());
            var mockLogger = new Mock<ILogger<DbOperations>>();
            mockDbOperations = new Mock<DbOperations>(mockLogger.Object, mockMainContext.Object);
            var mockSupportingMethods = new Mock<SupportingMethods>();
            mockUserAuthentication = new Mock<UserAuthentication>(mockDbOperations.Object, mockSupportingMethods.Object);
            mockValidateRequest = new Mock<ValidateRequest>();
            fakeHttpContext = new FakeHttpContext().getFakeHttpContext();
        }

        [Fact]
        public void PutLogin_valid()
        {
            mockValidateRequest
                .Setup(m => m.ValidateAsync(It.IsAny<IValidator>(), It.IsAny<Func<IValidator, Task<DataShell>>>()))
                .Returns(Task.FromResult(new DataShell()));

            var service = new MainController(mockDbOperations.Object, mockUserAuthentication.Object, mockValidateRequest.Object);
            service.ControllerContext.HttpContext = fakeHttpContext; 

            var result = service.PutLogin(It.IsAny<ChangeUser>()).Result;

            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public void PutLogin_invalid()
        {
            mockValidateRequest
                .Setup(m => m.ValidateAsync(It.IsAny<IValidator>(), It.IsAny<Func<IValidator, Task<DataShell>>>()))
                .Returns(Task.FromResult(new DataShell("error")));

            var service = new MainController(mockDbOperations.Object, mockUserAuthentication.Object, mockValidateRequest.Object);
            service.ControllerContext.HttpContext = fakeHttpContext;

            var result = service.PutLogin(It.IsAny<ChangeUser>()).Result;

            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public void PutPassword_valid()
        {
            mockValidateRequest
                .Setup(m => m.ValidateAsync(It.IsAny<IValidator>(), It.IsAny<Func<IValidator, Task<DataShell>>>()))
                .Returns(Task.FromResult(new DataShell()));

            var service = new MainController(mockDbOperations.Object, mockUserAuthentication.Object, mockValidateRequest.Object);
            service.ControllerContext.HttpContext = fakeHttpContext;

            var result = service.PutPassword(It.IsAny<ChangeUser>()).Result;

            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public void PutPassword_invalid()
        {
            mockValidateRequest
                .Setup(m => m.ValidateAsync(It.IsAny<IValidator>(), It.IsAny<Func<IValidator, Task<DataShell>>>()))
                .Returns(Task.FromResult(new DataShell("error")));

            var service = new MainController(mockDbOperations.Object, mockUserAuthentication.Object, mockValidateRequest.Object);
            service.ControllerContext.HttpContext = fakeHttpContext;

            var result = service.PutPassword(It.IsAny<ChangeUser>()).Result;

            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public void GetStartPage_valid()
        {
            mockValidateRequest
                .Setup(m => m.ValidateAsync(It.IsAny<IQueryCollection>(), It.IsAny<IValidator>(), It.IsAny<Func<IQueryCollection, Task<DataShell>>>()))
                .Returns(Task.FromResult(new DataShell()));

            var service = new MainController(mockDbOperations.Object, mockUserAuthentication.Object, mockValidateRequest.Object);
            service.ControllerContext.HttpContext = fakeHttpContext;

            var result = service.GetStartPage().Result;

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public void GetStartPage_invalid()
        {
            mockValidateRequest
                .Setup(m => m.ValidateAsync(It.IsAny<IQueryCollection>(), It.IsAny<IValidator>(), It.IsAny<Func<IQueryCollection, Task<DataShell>>>()))
                .Returns(Task.FromResult(new DataShell("error")));

            var service = new MainController(mockDbOperations.Object, mockUserAuthentication.Object, mockValidateRequest.Object);
            service.ControllerContext.HttpContext = fakeHttpContext;

            var result = service.GetStartPage().Result;

            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public void Auth_valid()
        {
            var user = new User() { Login = "login" };

            mockValidateRequest
                .Setup(m => m.ValidateAsync(It.IsAny<IValidator>(), It.IsAny<Func<IValidator, Task<DataShell>>>()))
                .Returns(Task.FromResult(new DataShell()));

            var service = new MainController(mockDbOperations.Object, mockUserAuthentication.Object, mockValidateRequest.Object);

            service.ControllerContext.HttpContext = fakeHttpContext;

            var result = service.Auth(user).Result;

            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public void Auth_invalid()
        {
            mockValidateRequest
                .Setup(m => m.ValidateAsync(It.IsAny<IValidator>(), It.IsAny<Func<IValidator, Task<DataShell>>>()))
                .Returns(Task.FromResult(new DataShell("Error")));

            var service = new MainController(mockDbOperations.Object, mockUserAuthentication.Object, mockValidateRequest.Object);
            service.ControllerContext.HttpContext = fakeHttpContext;

            var result = service.Auth(It.IsAny<User>()).Result;

            Assert.IsType<BadRequestResult>(result);
        }

    }
}
