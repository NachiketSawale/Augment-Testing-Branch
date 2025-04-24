/**
 * Created by zwz on 4/25/2018.
 */
(function (angular) {
	/**
	 * @description
	 * productionplanningEngineeringHeaderStatusLookupService provides complete engheader status lookup data
	 */
	'use strict';
	var moduleName = 'productionplanning.engineering';
	angular.module(moduleName).factory('productionplanningEngineeringHeaderStatusLookupService', lookupService);

	lookupService.$inject = ['$http','basicsLookupdataLookupDescriptorService'];

	function lookupService($http, basicsLookupdataLookupDescriptorService) {
		var service = {};

		service.getList = function () {
			return basicsLookupdataLookupDescriptorService.getData('basics.customize.engineeringstatus');
		};

		service.load = function load() {
			$http.post(globals.webApiBaseUrl + 'basics/customize/engineeringstatus/list').then(function (response) {
				basicsLookupdataLookupDescriptorService.updateData('basics.customize.engineeringstatus', response.data);
			});
		};
		service.load();

		return service;
	}

})(angular);
