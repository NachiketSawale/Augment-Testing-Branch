(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).controller('trsRequisitionJobDeliveryAddressRemarkController', [
		'$scope', 'platformSingleRemarkControllerService',
		'transportplanningRequisitionMainService', 'transportplanningRequisitionValidationService',
		function trsRequisitionJobDeliveryAddressRemarkController($scope, platformSingleRemarkControllerService, dataService, validationService) {
			var layout = {
				version: '1.0.0',
				fid: 'transportplanning.requisition.jobDeliveryDeliveryAddressRemark',
				addValidationAutomatically: true,
				//remark: 'deliveryAddressRemark',
				model: 'JobDeliveryAddressRemark',
				readonly: true
			};
			platformSingleRemarkControllerService.initController($scope, dataService, validationService, layout);
		}]);
})(angular);
