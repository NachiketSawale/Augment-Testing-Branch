(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('trsTransportJobDeliveryAddressRemarkController', [
		'$scope', 'platformSingleRemarkControllerService',
		'transportplanningTransportMainService', 'transportplanningTransportValidationService',
		function trsTransportJobDeliveryAddressRemarkController($scope, platformSingleRemarkControllerService, dataService, validationService) {
			var layout = {
				version: '1.0.0',
				fid: 'transportplanning.transport.jobDeliveryDeliveryAddressRemark',
				addValidationAutomatically: true,
				//remark: 'deliveryAddressRemark',
				model: 'JobDeliveryAddressRemark',
				readonly: true
			};
			platformSingleRemarkControllerService.initController($scope, dataService, validationService, layout);
		}]);
})(angular);
