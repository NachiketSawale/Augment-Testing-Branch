(function (angular) {
	/* global globals, angular */
	'use strict';
	var moduleName = 'productionplanning.drawing';

	angular.module(moduleName).factory('productionplanningDrawingComponentStatusLookupService', lookupService);

	lookupService.$inject = ['$http'];

	function lookupService($http) {
		var statusList = [];

		function getList() {
			return statusList;
		}

		function load() {
			statusList = [];
			$http.post(globals.webApiBaseUrl + 'basics/customize/engineeringdrawingcomponentstatus/list').then(function (response) {
				statusList = response.data;
			});
		}

		load();

		return {
			load: load,
			getList: getList
		};
	}

})(angular);
