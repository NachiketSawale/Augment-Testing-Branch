
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('productionplanningCommonRequisitionProcessor', Processor);

	Processor.$inject = ['basicsLookupdataLookupDescriptorService', '$http'];

	function Processor(basicsLookupdataLookupDescriptorService, $http) {
		var service = {};

		service.processItem = function (item) {
			var statusList = basicsLookupdataLookupDescriptorService.getData('RequisitionStatus');
			var status = _.find(statusList, {Id: item.RequisitionStatusFk});
			if(status.BackgroundColor) {
				item.BackgroundColor = status.BackgroundColor;
			}
		};

		service.loadData = function () {
			let requisitionStatusList = basicsLookupdataLookupDescriptorService.getData('RequisitionStatus');
			if (requisitionStatusList === undefined) {
				$http.post(globals.webApiBaseUrl + 'basics/customize/resrequisitionstatus/list')
					.then(function (response) {
						basicsLookupdataLookupDescriptorService.updateData('RequisitionStatus', response.data);
					});
			}
		};

		return service;
	}
})(angular);
