(function (angular) {
	'use strict';
	/* global angular, globals*/
	var moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('productionplanningItemReproductionReasonLookupService', lookupService);

	lookupService.$inject = ['$http', '$q', '$injector', 'basicsLookupdataLookupDescriptorService'];

	function lookupService($http, $q, $injector, basicsLookupdataLookupDescriptorService) {
		var service = {};
		var lookupData = {
			reproductionReasonList: []
		};

		service.getItemList = function () {
			return lookupData.reproductionReasonList;
		};

		service.clearCache = function clearCache() {
			lookupData.reproductionReasonList = [];
		};

		service.load = function load() {
			return $http.post(globals.webApiBaseUrl + 'basics/customize/ppsreproductionreason/list').then(function (response) {
				lookupData.reproductionReasonList = response.data;
				basicsLookupdataLookupDescriptorService.updateData('basics.customize.ppsreproductionreason', response.data);
			});
		};

		service.load();

		return service;
	}
})(angular);
