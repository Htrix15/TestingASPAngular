using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Testing.Models;
using Testing.Services;
using Testing.RequestValidatorsModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

namespace Testing.Controllers
{
    [ApiController]
    [Route("api")]
    public class MainController : ControllerBase
    {
        private readonly DbOperations _dbOperations;
        private readonly UserAuthentication _userAuthentication;
        private readonly ValidateRequest _validateRequest;

        public MainController(
            DbOperations dbOperations,
            UserAuthentication userAuthentication,
            ValidateRequest validateRequest)
        {
            _dbOperations = dbOperations;
            _userAuthentication = userAuthentication;
            _validateRequest = validateRequest;
        }

        private void SetResponseHeaders(string key, string value)
        {
            Response.Headers.Add(key, value);
        }
        private async Task<bool> CreateCookie(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, user.Login),
            };
            ClaimsIdentity claimsIdentity =
            new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, null);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));
            return true;
        }

        [Authorize]
        [HttpPut("login")]
        public async Task<IActionResult> PutLogin(ChangeUser changeLogin)
        {

            var result = await _validateRequest.ValidateAsync(changeLogin, _userAuthentication.ChangeLoginAsync);
            if (result.error == null)
            {
                SetResponseHeaders("auth", "logoff");
                return Ok();
            }
               SetResponseHeaders("error", result.error);
            return BadRequest();
        }

        [Authorize]
        [HttpPut("password")]
        public async Task<IActionResult> PutPassword(ChangeUser changePassword)
        {
            var result = await _validateRequest.ValidateAsync(changePassword, _userAuthentication.ChangePasswordAsync);
            if (result.error == null)
            {
                SetResponseHeaders("auth", "logoff");
                return Ok();
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }

        [HttpPost("logon")]
        public async Task<IActionResult> Auth(User user)
        {
            var result = await _validateRequest.ValidateAsync(user, _userAuthentication.AuthenticationAsync);
            if (result.error == null)
            {
                await CreateCookie(user);
                return Ok();

            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }

        [Authorize]
        [HttpGet("check-admin")]
        public IActionResult CheckAdmin()
        {
            return Ok();
        }

        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }


        [HttpGet("start-page")]
        public async Task<IActionResult> GetStartPage()
        {
            var result = await _validateRequest.ValidateAsync(Request.Query, new GetStart(), _dbOperations.GetStartAsync);
            if (result.error == null)
            {
                return Ok(result.datas);
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }
    }
}
