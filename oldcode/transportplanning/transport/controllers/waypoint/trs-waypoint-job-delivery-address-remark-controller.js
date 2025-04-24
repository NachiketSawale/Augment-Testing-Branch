(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('trsWaypointJobDeliveryAddressRemarkController', [
		'$scope', 'platformSingleRemarkControllerService',
		'transportplanningTransportWaypointDataService', 'transportplanningTransportWaypointValidationService',
		function trsTransportJobDeliveryAddressRemarkController($scope, platformSingleRemarkControllerService, dataService, validationService) {
			var layout = {
				version: '1.0.0',
				fid: 'transportplanning.transport.waypoint.jobDeliveryDeliveryAddressRemark',
				addValidationAutomatically: true,
				//remark: 'deliveryAddressRemark',
				model: 'JobDeliveryAddressRemark',
				readonly: true
			};
			platformSingleRemarkControllerService.initController($scope, dataService, validationService, layout);
		}]);
})(angular);
