/**
 * Created by lst on 4/16/2018.
 */
/**
 * @ngdoc service
 * @name cloud.desktop.service:cloudDesktopOneDriveMainService
 * @priority default value
 * @description
 *
 *
 *
 * @example
 ...
 }
 */

(function (angular) {
	'use strict';
	var moduleName = 'cloud.desktop';

	angular.module(moduleName).factory('cloudDesktopOneDriveMainService',
		['$http', '$q', 'globals',
			function ($http, $q, globals) {
				var service = {};
				service.root = globals.aad.resource.msGraph + '/v1.0';

				service.get = function (uri) {
					var deferred = $q.defer();

					service.getWithToken(service.root + uri).then(function (response) {
						deferred.resolve(response);
					}, function (err) {
						deferred.reject(err);
					});
					return deferred.promise;
				};

				service.post = function (uri, data) {
					var deferred = $q.defer();

					service.postWithToken(service.root + uri, data).then(function (response) {
						deferred.resolve(response);
					}, function (err) {
						deferred.reject(err);
					});
					return deferred.promise;
				};

				service.getWithToken = function (url) {
					return $http({
						method: 'GET',
						url: url,
						headers: {
							'x-request-office': service.root
						}
					});
				};

				service.postWithToken = function (url, data) {
					return $http({
						method: 'POST',
						url: url,
						data: data,
						headers: {
							'x-request-office': service.root
						}
					});
				};

				service.postByApi = function (url, data) {
					return $http({
						method: 'POST',
						url: url,
						data: data,
						headers: {
							'x-request-office-byapi': service.root
						}
					});
				};

				return service;
			}]);
})(angular);