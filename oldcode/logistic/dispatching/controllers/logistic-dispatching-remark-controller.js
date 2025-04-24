
(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	angular.module(moduleName).controller('logisticDispatchingRemarkController', LogisticDispatchingRemarkController);

	LogisticDispatchingRemarkController.$inject = ['$scope', 'platformSingleRemarkControllerService', 'logisticDispatchingHeaderDataService', 'logisticDispatchingHeaderValidationService'];

	function LogisticDispatchingRemarkController($scope, platformSingleRemarkControllerService, logisticDispatchingHeaderDataService, logisticDispatchingHeaderValidationService) {
		var layout = {
			version: '1.0.0',
			fid: 'logistic.dispatching.logisticDispatchingRemark',
			addValidationAutomatically: true,
			remark: 'Remark',
			model: 'Remark'
		};
		platformSingleRemarkControllerService.initController($scope, logisticDispatchingHeaderDataService, logisticDispatchingHeaderValidationService, layout);
	}
})(angular);