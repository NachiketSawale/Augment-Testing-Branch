/**
 * Created by las on 8/14/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.package';
	var packageModule = angular.module(moduleName);

	packageModule.factory('transportplanningPackageFilterService', packageFilterService);
	packageFilterService.$inject = ['$http', 'globals', 'basicsLookupdataLookupDescriptorService'];

	function packageFilterService($http, globals, basicsLookupdataLookupDescriptorService) {

		var filterService = {};

		function getStatusList() {

			// get reservation status
			var reservationStatusList = basicsLookupdataLookupDescriptorService.getData('ReservationStatus');
			if (reservationStatusList === undefined) {
				$http.post(globals.webApiBaseUrl + 'basics/customize/resreservationstatus/list')
					.then(function (response) {
						basicsLookupdataLookupDescriptorService.updateData('ReservationStatus', response.data);
					});
			}
		}

		getStatusList();

		filterService.registerfilterService = function () {


		};

		return filterService;
	}

})(angular);