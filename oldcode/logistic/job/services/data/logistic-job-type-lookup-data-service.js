/**
 * Created by shen on 10/24/2021
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'logistic.job';
	/**
	 * @ngdoc service
	 * @name logisticJobTypeLookupDataService
	 * @function
	 *
	 * @description
	 * logisticJobTypeLookupDataService is the data service for all job type functionality.
	 */
	angular.module(moduleName).service('logisticJobTypeLookupDataService', LogisticJobTypeLookupDataService);

	LogisticJobTypeLookupDataService.$inject = ['_', '$http'];
	function LogisticJobTypeLookupDataService(_, $http) {
		const service = {};
		const data = [];

		service.load = function() {
			$http.post(globals.webApiBaseUrl + 'basics/customize/jobtype/list')
				.then(function (result) {
					if (result && result.data && _.isArray(result.data)) {
						const filteredData = _.filter(result.data, { IsLive: true });
						data.push(...filteredData);
					}
				});
		};

		service.getList = function () {
			return data;
		};

		service.getPoolJobTypes = function () {
			return _.filter(data, { IsPoolJob: true });
		};

		return service;
	}
})(angular);
