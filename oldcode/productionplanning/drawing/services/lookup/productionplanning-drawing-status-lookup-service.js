(function (angular) {
	/* global globals, angular */
	'use strict';
	var moduleName = 'productionplanning.drawing';

	angular.module(moduleName).factory('productionplanningDrawingStatusLookupService', lookupService);

	lookupService.$inject = ['$http'];

	function lookupService($http) {
		var statusList = [];

		function getList() {
			return statusList;
		}

		function load() {
			statusList = [];
			return $http.post(globals.webApiBaseUrl + 'basics/customize/engineeringdrawingstatus/list').then(function (response) {
				statusList = response.data;
				return statusList;
			});
		}

		load();

		return {
			load: load,
			getList: getList
		};
	}

})(angular);
