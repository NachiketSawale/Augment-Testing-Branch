/**
 * Created by lst on 10/13/2016.
 */

/* jshint -W106 */
/* jshint -W097 */
/* jshint -W117 */
/* globals module, require, Buffer */

(function () {
	'use strict';

	var path = require('path');
	var https = require('https');
	var qs = require('querystring');
	var fs = require('fs');

	var q = require(path.resolve('./node_modules/q'));

	var util = {};
	module.exports = util;

	util.login = function login() {
		var data = qs.stringify(globalConfig.loginData);

		var options = {
			host: globalConfig.identityServer.host,
			port: globalConfig.identityServer.port,
			path: globalConfig.identityServer.path,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': getLength(data)
			},
			timeout: 60000
		};

		return httpAction(data, options);
	};

	util.post = function post(uri, data) {
		var postData = JSON.stringify(data);
		var options = {
			host: globalConfig.services.host,
			port: globalConfig.services.port,
			path: globalConfig.services.path + uri,
			method: 'POST',
			rejectUnauthorized: false,
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': getLength(postData),
				'Authorization': globalConfig.client.authorization,
				'Client-Context': globalConfig.client.clientContext
			},
			timeout: 60000
		};

		return httpAction(postData, options);
	};

	util.get = function get(uri, data) {
		var postData = JSON.stringify(data);
		var options = {
			host: globalConfig.services.host,
			port: globalConfig.services.port,
			path: globalConfig.services.path + uri,
			method: 'GET',
			rejectUnauthorized: false,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': globalConfig.client.authorization,
				'Client-Context': globalConfig.client.clientContext
			},
			timeout: 60000
		};

		return httpAction(postData, options);
	};

	util.mergeLoginCompanyInfo = function mergeLoginCompanyInfo(requestObj) {
		return Object.assign(requestObj, {'CompanyCode': globalConfig.client.companyCode});
	};

	function getLength(str) {
		return new Buffer(str).length;
	}

	https.request = (function (_request) {
		return function (options, callback) {
			var timeout = options['timeout'], timeoutEventId;
			var req = _request(options, function (res) {
				res.on('end', function () {
					clearTimeout(timeoutEventId);
				});

				res.on('close', function () {
					clearTimeout(timeoutEventId);
				});

				// res.on('abort',function () {
				//
				// })

				callback(res);
			});

			req.on('timeout', function () {
				req.res && req.res.abort && req.res.abort();
				req.abort();
			});

			timeout && (timeoutEventId = setTimeout(function () {
				req.emit('timeout', {message: 'request have been timeout ' + timeout + 'ms.'});
			}, timeout));

			return req;
		};
	})(https.request);

	function httpAction(data, options) {
		var deferred = q.defer();
		var requestCallback = function (res) {
			res.setEncoding('utf-8');
			// console.log('state : %s \n headers: \n %s \n method: [%s]', res.statusCode + ' ' + res.statusMessage, JSON.stringify(res.headers), options.method);

			// Determine if successful
			var status = res.statusCode;
			var isSuccess = (status >= 200 && status < 300) || status === 304;
			// console.log('state : %s', res.statusCode + ' ' + res.statusMessage);
			// if no content
			if (status === 204 || res.type === 'HEAD') {
				deferred.resolve({statusCode: 204, statusMessage: 'No Content'});

				// if not modified
			} else if (status === 304) {
				deferred.resolve({statusCode: 304, statusMessage: 'Not Modified'});

				// If we have data, let's convert it
			} else {
				var receiveData = '';
				res.on('data', function (chunk) {
					receiveData += chunk;
				}).on('end', function () {
					if (receiveData) {
						try {
							receiveData = JSON.parse(receiveData);
						} catch (e) {
							// console.log(e.message);
						}
					}

					if (isSuccess) {
						deferred.resolve(receiveData);
					} else {
						var errors = {statusCode: res.statusCode, statusMessage: res.statusMessage, details: receiveData};
						deferred.reject(new Error(JSON.stringify(errors, '\t', 4)));
					}
				});
			}
		};

		var req = https.request(options, requestCallback).on('error', function (e) {
			console.log('Request Error: ' + e.message);
			deferred.reject(new Error('Request Error: ' + e.message));
		});

		req.write(data);
		req.end();

		return deferred.promise;
	}

	/**
	 * process the data (if the data is utf8+bom remove the bom tag)
	 *
	 * @private
	 * @param {String|Buffer} data The source string of buffer.
	 * @returns {String} Returns the data of string.
	 */
	function removeUTF8BOM(data) {
		var buffer = new Buffer(data);
		if (buffer.length < 3) return buffer.toString();
		// if the data encoding is utf8+bom  remove the bom
		if (buffer[0] == 0xEF && buffer[1] == 0xBB && buffer[2] == 0xBF) {
			// 'utf8+bom'
			var tempBuffer = new Buffer(buffer.length - 3);
			buffer.copy(tempBuffer, 0, 3);
			buffer = tempBuffer;
		}
		return buffer.toString();
	}

	util.requireData = function requireData(filePath, mergeLoginCompanyInfo) {
		mergeLoginCompanyInfo = mergeLoginCompanyInfo === false ? false : true;

		var deferred = q.defer();
		filePath = path.resolve(filePath);
		fs.readFile(filePath, function (err, data) {
			if (err) {
				deferred.reject(new Error(err));
			} else {
				if (!data || !data.length) {
					deferred.reject(new Error('The file has no data,"' + filePath + '"'));
				} else {
					data = removeUTF8BOM(data);
					data = JSON.parse(data);
					if (mergeLoginCompanyInfo === true) {
						data = util.mergeLoginCompanyInfo(data);
					}
					// console.log(data);
					deferred.resolve(data);
				}
			}
		});

		return deferred.promise;
	};

}).call(this);