
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('productionplanningCommonResReservationProcessor', Processor);

	Processor.$inject = ['basicsLookupdataLookupDescriptorService','$http'];

	function Processor(basicsLookupdataLookupDescriptorService, $http) {
		var service = {};

		service.processItem = function (item) {
			var statusList = basicsLookupdataLookupDescriptorService.getData('ReservationStatus');
			var status = _.find(statusList, {Id: item.ReservationStatusFk});
			if(status.BackgroundColor) {
				item.BackgroundColor = status.BackgroundColor;
			}
		};

		service.loadData = function () {
			let reservationStatusList = basicsLookupdataLookupDescriptorService.getData('ReservationStatus');
			if (reservationStatusList === undefined) {
				$http.post(globals.webApiBaseUrl + 'basics/customize/resreservationstatus/list')
					.then(function (response) {
						basicsLookupdataLookupDescriptorService.updateData('ReservationStatus', response.data);
					});
			}
		};

		return service;
	}
})(angular);
