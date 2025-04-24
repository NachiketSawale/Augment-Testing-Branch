
(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	angular.module(moduleName).controller('logisticDispatchingDeliveryAddressRemarkController', LogisticDispatchingDeliveryAddressRemarkController);

	LogisticDispatchingDeliveryAddressRemarkController.$inject = ['$scope', 'platformSingleRemarkControllerService', 'logisticDispatchingHeaderDataService', 'logisticDispatchingHeaderValidationService'];

	function LogisticDispatchingDeliveryAddressRemarkController($scope, platformSingleRemarkControllerService, logisticDispatchingHeaderDataService, logisticDispatchingHeaderValidationService) {
		var layout = {
			version: '1.0.0',
			fid: 'logistic.dispatching.deliveryDeliveryAddressRemark',
			addValidationAutomatically: true,
			remark: 'deliveryAddressRemark',
			model: 'DeliveryAddressRemark'
		};
		platformSingleRemarkControllerService.initController($scope, logisticDispatchingHeaderDataService, logisticDispatchingHeaderValidationService, layout);
	}
})(angular);