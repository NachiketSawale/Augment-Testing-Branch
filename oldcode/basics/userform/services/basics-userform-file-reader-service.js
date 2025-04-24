/**
 * Created by reimer on 11.11.2014.
 */

(function (angular) {

	'use strict';

	var moduleName = 'basics.userform';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsUserformFileReaderService', ['$q',

		function ($q) {

			var service = {};

			var onLoad = function(reader, deferred, scope) {
				return function () {
					scope.$apply(function () {
						deferred.resolve(reader.result);
					});
				};
			};

			var onError = function (reader, deferred, scope) {
				return function () {
					scope.$apply(function () {
						deferred.reject(reader.result);
					});
				};
			};

			var onProgress = function(reader, scope) {
				return function (event) {
					scope.$broadcast('fileProgress',
						{
							total: event.total,
							loaded: event.loaded
						});
				};
			};

			var getReader = function(deferred, scope) {
				var reader = new FileReader();
				reader.onload = onLoad(reader, deferred, scope);
				reader.onerror = onError(reader, deferred, scope);
				reader.onprogress = onProgress(reader, scope);
				return reader;
			};

			service.readAsText = function (file, scope) {
				var deferred = $q.defer();
				var reader = getReader(deferred, scope);
				reader.readAsText(file);
				return deferred.promise;
			};

			return service;

		}]);
})(angular);

