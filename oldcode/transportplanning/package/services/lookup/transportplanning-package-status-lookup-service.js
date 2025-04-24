/**
 * Created by zwz on 4/25/2018.
 */

(function (angular) {
	/**
	 * @description
	 * productionplanningEngineeringTaskStatusLookupService provides package status lookup data
	 */
	'use strict';
	var moduleName = 'transportplanning.package';
	angular.module(moduleName).factory('transportplanningPackageStatusLookupService', lookupService);

	lookupService.$inject = ['$http','basicsLookupdataLookupDescriptorService', 'globals'];

	function lookupService($http, basicsLookupdataLookupDescriptorService, globals) {
		var service = {};

		service.getList = function () {
			return basicsLookupdataLookupDescriptorService.getData('basics.customize.transportpackagestatus');
		};

		service.load = function load() {
			$http.post(globals.webApiBaseUrl + 'basics/customize/transportpackagestatus/list').then(function (response) {
				basicsLookupdataLookupDescriptorService.updateData('basics.customize.transportpackagestatus', response.data);
			});
		};
		service.load();

		return service;
	}

})(angular);
