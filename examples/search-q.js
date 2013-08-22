var BearerToken = require('../index-q.js');

var config = {
	'consumer_key'   : '==== Your Key ====',
	'consumer_secret': '=== Secret Key ==='
};

BearerToken.request(config).then(function(bearer_token) {
	console.log(bearer_token);
	BearerToken.search(bearer_token, 'test').then(function(results) {
		console.log("Total result: " + results.statuses.length);
		BearerToken.invalidate(bearer_token).then(function(res) {
			console.log(res);
		});
	});
});
