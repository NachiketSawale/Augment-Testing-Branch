/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').factory('platformHttpTimestampInterceptor', interceptor);
	interceptor.$inject = ['globals'];

	function interceptor(globals) {
		return {
			request: function (config) {
				if (!config.cached && config.method === 'GET' && config.url.match(/^.*\.(json|html)$/i)) {
					config.url += globals.timestamp;
				}

				return config;
			}
		};
	}

	angular.module('platform').config(['$httpProvider', function ($httpProvider) {
		$httpProvider.interceptors.push('platformHttpTimestampInterceptor');
	}]);
})(angular);