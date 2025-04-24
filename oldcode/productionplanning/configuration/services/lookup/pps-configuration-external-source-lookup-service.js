(function (angular) {
	'use strict';
	/* global angular, globals*/
	var moduleName = 'productionplanning.configuration';
	angular.module(moduleName).factory('ppsConfigExternalSourceLookupService', lookupService);

	lookupService.$inject = ['$http', '$q', '$injector', 'basicsLookupdataLookupDescriptorService'];

	function lookupService($http, $q, $injector, basicsLookupdataLookupDescriptorService) {
		var service = {};
		var lookupData = {
			externalSourceList: []
		};

		service.getItemList = function () {
			return lookupData.externalSourceList;
		};

		service.clearCache = function clearCache() {
			lookupData.externalSourceList = [];
		};

		service.load = function load() {
			return $http.post(globals.webApiBaseUrl + 'basics/customize/externalsource/list').then(function (response) {
				lookupData.externalSourceList = response.data;
				//basicsLookupdataLookupDescriptorService.updateData('basics.customize.externalsource', response.data);
			});
		};

		service.load();

		return service;
	}
})(angular);
