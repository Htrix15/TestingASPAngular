using System;
using Moq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;

namespace UnitTestApp.Tests
{
    public class FakeHttpContext
    {
        private  HttpContext fakeHttpContext;

        public FakeHttpContext()
        {
            var headerDictionary = new HeaderDictionary();
            var response = new Mock<HttpResponse>();
            response
                 .SetupGet(r => r.Headers)
                 .Returns(headerDictionary);
            
            var queryCollection = new QueryCollection();
            var request = new Mock<HttpRequest>();
            request
                .SetupGet(r => r.Query)
                .Returns(queryCollection);

            var authServiceMock = new Mock<IAuthenticationService>();
            authServiceMock
                .Setup(aus => aus.SignInAsync(It.IsAny<HttpContext>(), It.IsAny<string>(), It.IsAny<ClaimsPrincipal>(), It.IsAny<AuthenticationProperties>()))
                .Returns(Task.FromResult((object)null));

            var serviceProviderMock = new Mock<IServiceProvider>();
            serviceProviderMock
                .Setup(sp => sp.GetService(typeof(IAuthenticationService)))
                .Returns(authServiceMock.Object);

            var httpContext = new Mock<HttpContext>();
            
            httpContext
                .SetupGet(c => c.Response)
                .Returns(response.Object);

            httpContext
                .SetupGet(c => c.RequestServices)
                .Returns(serviceProviderMock.Object);

            httpContext
                .SetupGet(c => c.Request)
                .Returns(request.Object);

            fakeHttpContext = httpContext.Object;
        }
        public HttpContext getFakeHttpContext()
        {
            return fakeHttpContext;
        }

    }
}
