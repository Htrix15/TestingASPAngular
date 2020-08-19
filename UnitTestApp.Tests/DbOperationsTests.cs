using System;
using System.Collections.Generic;
using Xunit;
using Testing.Models;
using Testing.ServicesModels;
using Testing.Services;
using Moq;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace UnitTestApp.Tests
{
    public class DbOperationsTests
    {
        Mock<MainContext> mockMainContext;
        ILogger<DbOperations> logger;
        Mock<IQueryCollection> queryCollection;
        ChangeUser logins;
        ChangeUser passwords;
        string login;
        User user;
        public DbOperationsTests()
        {
            mockMainContext = new Mock<MainContext>(new DbContextOptions<MainContext>());
            logger = new Mock<ILogger<DbOperations>>().Object;
            queryCollection = new Mock<IQueryCollection>();
            login = "test";
            logins = new ChangeUser("old", "new");
            passwords = new ChangeUser("old", "new");
            user = new User(1, login, "password");
        }

        [Fact]
        public void GetStartAsync_collectionReturn()
        {
            mockMainContext
                .Setup(m => m.SelectAsync<Model, Model>(null, null, -1, 1))
                .Returns(Task.FromResult<IEnumerable<Model>>(new List<Model> { new Model() }));
            queryCollection
                .SetupGet(q => q[It.IsAny<string>()])
                .Returns("1");

            var service = new DbOperations(logger, mockMainContext.Object);

            var result = service.GetStartAsync(queryCollection.Object).Result;

            Assert.NotEmpty(result.datas);
            Assert.Null(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
        }

        [Fact]
        public void GetStartAsync_collectionIsNullErrorReturn()
        {
            mockMainContext
                .Setup(m => m.SelectAsync<Model, Model>(null, null, -1, 1))
                .Returns(Task.FromResult<IEnumerable<Model>>(new List<Model>()));

            queryCollection
                .SetupGet(q => q[It.IsAny<string>()])
                .Returns("1");

            var service = new DbOperations(logger, mockMainContext.Object);

            var result = service.GetStartAsync(queryCollection.Object).Result;

            Assert.Null(result.datas);
            Assert.NotNull(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
            Assert.Equal("not found", result.error);
        }

        [Fact]
        public void GetStartAsync_queryCollectionInvalidErrorReturn()
        {

            mockMainContext
                .Setup(m => m.SelectAsync<Model, Model>(null, null, -1, 1))
                .Returns(Task.FromResult<IEnumerable<Model>>(new List<Model>()));

            queryCollection.SetupGet(q => q[It.IsAny<string>()]).Returns("error");

            var service = new DbOperations(logger, mockMainContext.Object);

            var result = service.GetStartAsync(queryCollection.Object).Result;

            Assert.Null(result.datas);
            Assert.NotNull(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
            Assert.Equal("Fail get data of DB", result.error);
        }

        [Fact]
        public void GetUserHashPasswordAsync_stringReturn()
        {

            mockMainContext
                .Setup(m => m.SelectAsync<User, string>(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<Expression<Func<User, string>>>(), -1, -1))
                .Returns(Task.FromResult<IEnumerable<string>>(new List<string>() { "string1", "string2", "string3" }));

            var service = new DbOperations(logger, mockMainContext.Object);

            var result = service.GetUserHashPasswordAsync(login).Result;

            Assert.Null(result.datas);
            Assert.Null(result.error);
            Assert.Null(result.data);
            Assert.NotNull(result.stringData);
            Assert.Equal("string1", result.stringData);
        }

        [Fact]
        public void GetUserHashPasswordAsync_dbFailErrorReturn()
        {
            mockMainContext
                .Setup(m => m.SelectAsync<User, string>(It.IsAny<Expression<Func<User, bool>>>(), It.IsAny<Expression<Func<User, string>>>(), -1, -1))
                .Returns(() => throw new Exception());

            var service = new DbOperations(logger, mockMainContext.Object);

            var result = service.GetUserHashPasswordAsync(login).Result;

            Assert.Null(result.datas);
            Assert.NotNull(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
            Assert.Equal("Fail get data of DB", result.error);
        }

        [Fact]
        public void ChangeLoginAsync_trueReturn()
        {
            mockMainContext
                .Setup(m => m.SelectAsync<User, User>(It.IsAny<Expression<Func<User, bool>>>(), null, -1, -1))
                .Returns(Task.FromResult<IEnumerable<User>>(new List<User>() { user }));

            mockMainContext
                .Setup(m => m.UpdateAsync(user))
                .Returns(Task.FromResult(new DataShell()));

            var service = new DbOperations(logger, mockMainContext.Object);

            var result = service.ChangeLoginAsync(logins).Result;

            Assert.Null(result.datas);
            Assert.Null(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
        }
        [Fact]
        public void ChangeLoginAsync_loginErrorReturn()
        {
            var service = new DbOperations(logger, mockMainContext.Object);

            var result = service.ChangeLoginAsync(logins).Result;

            Assert.Null(result.datas);
            Assert.NotNull(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
            Assert.Equal("Incorrect login", result.error);
        }

        [Fact]
        public void ChangeLoginAsync_dbSelectFailErrorReturn()
        {
            mockMainContext
                .Setup(m => m.SelectAsync<User, User>(It.IsAny<Expression<Func<User, bool>>>(), null, -1, -1))
                .Returns(() => throw new Exception());

            var service = new DbOperations(logger, mockMainContext.Object);

            var result = service.ChangeLoginAsync(logins).Result;

            Assert.Null(result.datas);
            Assert.NotNull(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
            Assert.Equal("Fail get or set data of DB", result.error);
        }

        [Fact]
        public void ChangeLoginAsync_dbUpdateFailErrorReturn()
        {
            mockMainContext
                .Setup(m => m.SelectAsync<User, User>(It.IsAny<Expression<Func<User, bool>>>(), null, -1, -1))
                .Returns(Task.FromResult<IEnumerable<User>>(new List<User>() { user }));

            mockMainContext
                .Setup(m => m.UpdateAsync(user))
                .Returns(() => throw new Exception());

            var service = new DbOperations(logger, mockMainContext.Object);

            var result = service.ChangeLoginAsync(logins).Result;

            Assert.Null(result.datas);
            Assert.NotNull(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
            Assert.Equal("Fail get or set data of DB", result.error);
        }

        [Fact]
        public void ChangePasswordAsync_trueReturn()
        {
            mockMainContext
                .Setup(m => m.SelectAsync<User, User>(It.IsAny<Expression<Func<User, bool>>>(), null, -1, -1))
                .Returns(Task.FromResult<IEnumerable<User>>(new List<User>() { user }));

            mockMainContext
                .Setup(m => m.UpdateAsync(user))
                .Returns(Task.FromResult(new DataShell()));

            var service = new DbOperations(logger, mockMainContext.Object);

            var result = service.ChangePasswordAsync(passwords).Result;

            Assert.Null(result.datas);
            Assert.Null(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
        }
        [Fact]
        public void ChangePasswordAsync_loginErrorReturn()
        {
            var service = new DbOperations(logger, mockMainContext.Object);

            var result = service.ChangePasswordAsync(passwords).Result;

            Assert.Null(result.datas);
            Assert.NotNull(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
            Assert.Equal("Incorrect password", result.error);
        }

        [Fact]
        public void ChangePasswordAsync_dbSelectFailErrorReturn()
        {
            mockMainContext
                .Setup(m => m.SelectAsync<User, User>(It.IsAny<Expression<Func<User, bool>>>(), null, -1, -1))
                .Returns(() => throw new Exception());

            var service = new DbOperations(logger, mockMainContext.Object);

            var result = service.ChangePasswordAsync(passwords).Result;

            Assert.Null(result.datas);
            Assert.NotNull(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
            Assert.Equal("Fail get or set data of DB", result.error);
        }

        [Fact]
        public void ChangePasswordAsync_dbUpdateFailErrorReturn()
        {
            mockMainContext
                .Setup(m => m.SelectAsync<User, User>(It.IsAny<Expression<Func<User, bool>>>(), null, -1, -1))
                .Returns(Task.FromResult<IEnumerable<User>>(new List<User>() { user }));

            mockMainContext
                .Setup(m => m.UpdateAsync(user))
                .Returns(() => throw new Exception());

            var service = new DbOperations(logger, mockMainContext.Object);

            var result = service.ChangePasswordAsync(passwords).Result;

            Assert.Null(result.datas);
            Assert.NotNull(result.error);
            Assert.Null(result.data);
            Assert.Null(result.stringData);
            Assert.Equal("Fail get or set data of DB", result.error);
        }
    }
}
