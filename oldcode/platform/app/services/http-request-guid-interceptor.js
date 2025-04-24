/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').factory('platformHttpRequestGuidInterceptor', interceptor);
	interceptor.$inject = ['globals', 'platformCreateUuid'];

	function interceptor(globals, platformCreateUuid) {
		return {
			request: function (config) {
				if (!config.cached) {
					config.headers['Request-GUID'] = platformCreateUuid();
				}
				return config;
			}
		};
	}

	angular.module('platform').config(['$httpProvider', function ($httpProvider) {
		$httpProvider.interceptors.push('platformHttpRequestGuidInterceptor');
	}]);
})(angular);