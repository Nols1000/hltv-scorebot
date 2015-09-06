var OAuth2 = require('oauth').OAuth2;

var app_id = "kMYNeiq40Yt7Lw";
var app_secret = "bs6urbdYcwaWTOXdvHKyzhHPfDc";

var request_token_url 	= "";
var access_token_url	= "http://nols1000.github.io/hltv-scorebot/oauth2/callback";

var oauth2 =  new OAuth2(	app_id,
							app_secret,
							'https://www.reddit.com/',
							'api/v1/authorize',
							'api/v1/access_token',
							null	);

