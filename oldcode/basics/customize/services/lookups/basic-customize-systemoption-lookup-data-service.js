/**
 * Created by zos on 12/20/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.customize';
	/**
	 * @ngdoc service
	 * @name basicsCustomizeQuantityTypeLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomizeQuantityTypeLookupDataService is the data service for all basic Quantity Type related functionality.
	 */
	angular.module(moduleName).factory('basicCustomizeSystemoptionLookupDataService', ['$http', '$q',
		function ($http, $q) {
			// Object presenting the service
			var service = {};

			// private code
			var lookupData = {
				systemOptions: []
			};

			var getSystemOptionsPromise = function () {
				return $http.post(globals.webApiBaseUrl + 'basics/customize/systemoption/list');
			};

			service.loadLookupData = function () {
				return getSystemOptionsPromise().then(function (response) {
					lookupData.systemOptions = response.data;
					return lookupData.systemOptions;
				});
			};

			service.getList = function getList() {
				if (lookupData.systemOptions.length > 0) {
					return lookupData.systemOptions;
				} else {
					return getSystemOptionsPromise().then(function (response) {
						lookupData.systemOptions = response.data;
						return lookupData.systemOptions;
					});
				}
			};

			service.setList = function setList(systemOptionItems) {
				lookupData.systemOptions = systemOptionItems;
			};

			service.getParameterValueAsync = function (id) {

				var deffered = $q.defer();

				if (lookupData.systemOptions.length === 0) {
					return service.loadLookupData().then(function () {
						return getParameterValue(lookupData.systemOptions, id);
					});
				} else {
					deffered.resolve(getParameterValue(lookupData.systemOptions, id));
				}
				return deffered.promise;
			};

			function getParameterValue(list, id) {

				var val = null;
				if (list) {
					for (var i = 0; i < list.length; i++) {
						if (list[i].Id === id) {
							val = list[i].ParameterValue;
							break;
						}
					}
				}
				return val;
			}

			return service;

		}]);
})(angular);
