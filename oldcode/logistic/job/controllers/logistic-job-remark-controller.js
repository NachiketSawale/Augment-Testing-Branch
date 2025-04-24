/**
 * Created by leo on 11.06.2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	angular.module(moduleName).controller('logisticJobRemarkController', LogisticJobRemarkController);

	LogisticJobRemarkController.$inject = ['$scope', 'platformSingleRemarkControllerService', 'logisticJobDataService', 'logisticJobValidationService'];

	function LogisticJobRemarkController($scope, platformSingleRemarkControllerService, logisticJobDataService, logisticJobValidationService) {
		var layout = {
			version: '1.0.0',
			fid: 'cloud.translation.remark',
			addValidationAutomatically: true,
			remark: 'remark',
			model: 'Remark'
		};
		platformSingleRemarkControllerService.initController($scope, logisticJobDataService, logisticJobValidationService, layout);
	}
})(angular);