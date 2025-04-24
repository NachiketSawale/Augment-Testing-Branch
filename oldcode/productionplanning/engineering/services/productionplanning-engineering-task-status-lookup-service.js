/**
 * Created by zwz on 4/25/2018.
 */
(function (angular) {
	/**
	 * @description
	 * productionplanningEngineeringTaskStatusLookupService provides complete engtask status lookup data
	 */
	'use strict';
	var moduleName = 'productionplanning.engineering';
	angular.module(moduleName).factory('productionplanningEngineeringTaskStatusLookupService', lookupService);

	lookupService.$inject = ['$http','basicsLookupdataLookupDescriptorService'];

	function lookupService($http, basicsLookupdataLookupDescriptorService) {
		var service = {};
		var lookupData = {
			routeStatusList: []
		};

		service.getList = function () {
			return lookupData.itemStatusList;
		};
		service.getItemList = function () {
			return lookupData.itemStatusList;
		};

		service.clearCache = function clearCache() {
			lookupData.itemStatusList = [];
		};

		service.load = function load() {
			return $http.post(globals.webApiBaseUrl + 'basics/customize/engineeringtaskstatus/list').then(function (response) {
				lookupData.itemStatusList = response.data;
				basicsLookupdataLookupDescriptorService.updateData('basics.customize.engineeringtaskstatus', response.data);
			});
		};
		service.load();

		return service;
	}

})(angular);
