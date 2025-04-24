(function () {
	'use strict';
	/* global angular */

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).controller('ppsCommonStatusChangeReasonsFormController', [
		'$scope',
		'$injector',
		'ppsCommonLoggingStatusChangeReasonsDialogService',
		function ($scope,
			$injector,
			ppsCommonLoggingStatusChangeReasonsDialogService) {

			if($scope.dialog) {
				ppsCommonLoggingStatusChangeReasonsDialogService.setDialogConfig($scope.dialog);
			}
			else {
				$scope.dialog = ppsCommonLoggingStatusChangeReasonsDialogService.getDialogConfig();
			}

			var params = $scope.dialog.modalOptions.dataItem;
			ppsCommonLoggingStatusChangeReasonsDialogService.initController($scope, params);
		}
	]);

})();