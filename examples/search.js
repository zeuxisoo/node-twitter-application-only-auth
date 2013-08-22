var BearerToken = require('../');

var config = {
	'consumer_key'   : '==== Your Key ====',
	'consumer_secret': '=== Secret Key ==='
};

BearerToken.request(config, function(bearer_token) {
	console.log(bearer_token);
	BearerToken.search(bearer_token, 'test', function(results) {
		console.log("Total result: " + results.statuses.length);
		BearerToken.invalidate(bearer_token, function(res) {
			console.log(res);
		});
	});
});
