
(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	angular.module(moduleName).controller('logisticDispatchingDeliveryRemarkController', LogisticDispatchingDeliveryRemarkController);

	LogisticDispatchingDeliveryRemarkController.$inject = ['$scope', 'platformSingleRemarkControllerService', 'logisticDispatchingHeaderDataService', 'logisticDispatchingHeaderValidationService'];

	function LogisticDispatchingDeliveryRemarkController($scope, platformSingleRemarkControllerService, logisticDispatchingHeaderDataService, logisticDispatchingHeaderValidationService) {
		var layout = {
			version: '1.0.0',
			fid: 'logistic.dispatching.deliveryDeliveryRemark',
			addValidationAutomatically: true,
			remark: 'deliveryRemark',
			model: 'DeliveryRemark'
		};
		platformSingleRemarkControllerService.initController($scope, logisticDispatchingHeaderDataService, logisticDispatchingHeaderValidationService, layout);
	}
})(angular);