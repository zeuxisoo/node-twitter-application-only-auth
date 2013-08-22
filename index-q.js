var request = require('request'),
	q = require('q');

var BearerToken = {
	request: function(options) {
		this.encoded_consumer_key    = encodeURIComponent(options.consumer_key),
		this.encoded_consumer_secret = encodeURIComponent(options.consumer_secret),
		this.encoded_bearer_token     = new Buffer(
			this.encoded_consumer_key + ':' + this.encoded_consumer_secret
		).toString('base64');

		var deferred = q.defer();

		request.post("https://api.twitter.com/oauth2/token", {
			headers: {
				"User-Agent"     : "Twitter Application-only OAuth App v.1",
				"Authorization"  : "Basic " + this.encoded_bearer_token + ""
			},
			form: {
				'grant_type' : 'client_credentials'
			}
		}, function(error, response, body) {
			if (error) {
				deferred.reject(new Error(error));
			}else{
				var bearer = JSON.parse(body);

				deferred.resolve(bearer.access_token);
			}
		});

		return deferred.promise;
	},

	invalidate: function(bearer_token, callback) {
		var deferred = q.defer();

		request.post("https://api.twitter.com/oauth2/invalidate_token", {
			headers: {
				"Host"           : "api.twitter.com",
				"User-Agent"     : "Twitter Application-only OAuth App v.1",
				"Authorization"  : "Basic " + this.encoded_bearer_token,
				"Accept"         : "*/*",
				"Content-Type"   : "application/x-www-form-urlencoded"
			},
			body: 'access_token=' + bearer_token,
		}, function(error, response, body) {
			if (error) {
				deferred.reject(new Error(error));
			}else{
				deferred.resolve(body);
			}
		});

		return deferred.promise;
	},

	search: function(bearer_token, query) {
		// https://api.twitter.com/1.1/statuses/user_timeline.json?count=100&screen_name=twitterapi
		var url = "https://api.twitter.com/1.1/search/tweets.json",
			formed_url = '?q=' + query + '&include_entities=true';

		var deferred = q.defer();

		request.get(url + formed_url, {
			headers: {
				"User-Agent"     : "Twitter Application-only OAuth App v.1",
				"Authorization"  : "Bearer " + bearer_token
			}
		}, function(error, response, body) {
			if (error) {
				deferred.reject(new Error(error));
			}else{
				deferred.resolve(JSON.parse(body));
			}
		});

		return deferred.promise;
	}
}

module.exports = BearerToken;
