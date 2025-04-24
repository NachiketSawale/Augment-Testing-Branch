/**
 * Created by shen on 2/6/2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	angular.module(moduleName).controller('logisticCardRemarkController', LogisticCardRemarkController);

	LogisticCardRemarkController.$inject = ['$scope', 'platformSingleRemarkControllerService', 'logisticCardDataService', 'logisticCardValidationService'];

	function LogisticCardRemarkController($scope, platformSingleRemarkControllerService, logisticCardDataService, logisticCardValidationService) {
		var layout = {
			version: '1.0.0',
			fid: 'cloud.translation.remark',
			addValidationAutomatically: true,
			remark: 'remark',
			model: 'Remark'
		};
		platformSingleRemarkControllerService.initController($scope, logisticCardDataService, logisticCardValidationService, layout);
	}
})(angular);