/**
 * Created by reimer on 27.10.2015.
 */

(function () {

	'use strict';

	var moduleName = 'basics.dependentdata';

	/**
	 * @ngdoc service
	 * @name
	 * @returns
	 */
	angular.module(moduleName).factory('basicsDependentDataDomainLookupService',

		['$http', '$q',

			function ($http, $q) {

				var deffered;
				var service = {};
				var data;

				service.getlookupType = function() {
					return 'basicsDependentDataDomain';
				};

				service.loadData = function() {

					if (!deffered) {
						deffered = $q.defer();
						$http.get(globals.webApiBaseUrl + 'basics/dependentdata/domain/lookup')
							.then(function (response) {
								data = response.data;
								// update cached data
								// basicsLookupdataLookupDescriptorService.updateData(service.getlookupType(), service.getList());
								deffered.resolve();
							});
					}

					return deffered.promise;
				};

				service.getList = function() {
					return data;
				};

				service.getItemByKey = function (value) {

					var list = service.getList();
					for (var i = 0; i < list.length; i++) {
						if (list[i].Id === value) {
							return list[i];
						}
					}
					return {};
				};

				service.refresh = function () {
					data = null;
					service.loadData();
				};

				return service;

			}]);
})();

