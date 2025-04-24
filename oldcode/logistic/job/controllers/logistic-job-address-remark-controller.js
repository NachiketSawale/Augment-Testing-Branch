/**
 * Created by leo on 11.06.2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	angular.module(moduleName).controller('logisticJobAddressRemarkController', LogisticJobAddressRemarkController);

	LogisticJobAddressRemarkController.$inject = ['$scope', 'platformSingleRemarkControllerService', 'logisticJobDataService', 'logisticJobValidationService'];

	function LogisticJobAddressRemarkController($scope, platformSingleRemarkControllerService, logisticJobDataService, logisticJobValidationService) {
		var layout = {
			version: '1.0.0',
			fid: 'logistic.job.deliveryAddressRemark',
			addValidationAutomatically: true,
			remark: 'deliveryAddressRemark',
			model: 'DeliveryAddressRemark'
		};
		platformSingleRemarkControllerService.initController($scope, logisticJobDataService, logisticJobValidationService, layout);
	}
})(angular);