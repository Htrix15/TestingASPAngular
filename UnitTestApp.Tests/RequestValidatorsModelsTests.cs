using Xunit;
using Testing.RequestValidatorsModels;
using Moq;
using Microsoft.AspNetCore.Http;

namespace UnitTestApp.Tests
{
    public class RequestValidatorsModelsTests
    {
        Mock<IQueryCollection> requestParams;
        GetStart getStart;
        public RequestValidatorsModelsTests()
        {
            requestParams = new Mock<IQueryCollection>();
            getStart = new GetStart();
        }

        [Fact]
        public void GetStart_valid()
        {
            requestParams.Setup(q => q.ContainsKey(It.IsAny<string>())).Returns(true);
            requestParams.SetupGet(q => q[It.IsAny<string>()]).Returns("1");

            var result = getStart.Validate(requestParams.Object);

            Assert.Null(result.error);
        }

        [Fact]
        public void GetStart_invalidKey()
        {
            requestParams.Setup(q => q.ContainsKey(It.IsAny<string>())).Returns(false);
            requestParams.SetupGet(q => q[It.IsAny<string>()]).Returns("1");

            var result = getStart.Validate(requestParams.Object);

            Assert.NotNull(result.error);
            Assert.Equal("invalid query parametrs", result.error);
        }

        [Fact]
        public void GetStart_invalidKeyValue()
        {
            requestParams.Setup(q => q.ContainsKey(It.IsAny<string>())).Returns(false);
            requestParams.SetupGet(q => q[It.IsAny<string>()]).Returns("no int");

            var result = getStart.Validate(requestParams.Object);

            Assert.NotNull(result.error);
            Assert.Equal("invalid query parametrs", result.error);
        }


    }
}
