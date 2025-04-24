(function () {
	'use strict';
	/*global angular, _*/
	let moduleName = 'productionplanning.common';

	angular.module(moduleName).controller('ppsCommonSerialProductionController', [
		'$scope', 'params', 'ppsCommonSerialProductionDialogService',
		'$translate', '$injector',
		function ($scope, params, dialogService,
			$translate, $injector) {
			$scope.customBtn1 = $scope.customBtn2 = false;
			$scope.showOkButton = $scope.showCancelButton = true;

			let controllerInitialized = false;
			$scope.modalOptions = {
				isDisabled: function (button) {
					return !controllerInitialized || dialogService.isDisabled(button, $scope.dataItem);
				}
			};
			$scope.onOK = function () {
				dialogService.handleOK($scope.dataItem).then(function (result) {
					if (result && result !== false) {
						$scope.$close(result);
						$injector.get('productionplanningCommonProductItemDataService').load();
					}
				});
			};
			$scope.onCancel = function () {
				$scope.$close(false);
			};

			$scope.formContainerOptions = {
				formOptions: {
					configure: dialogService.getFromCfg()
				},
				setTools: function () {
				}
			};

			$scope.alerts = dialogService.getAlerts();
			$scope.warnings = dialogService.getWarnings();

			dialogService.setBusyCallback = function (busy) {
				$scope.isBusy = busy;
			};

			dialogService.init(params.subPU, params.prodSetEvent).then(function (result) {
				controllerInitialized = true;
				$scope.dataItem = result;
				//dialogService.watchWeekdays($scope);
				$scope.onWeekdayChanged = dialogService.onWeekdayChanged;
			});

			//adjust latest template
			_.extend($scope.modalOptions, {
				headerText: $translate.instant(params.title) || $translate.instant('productionplanning.common.serialProduction.serialProduction'),
				cancel: $scope.onCancel
			});

			dialogService.registerProdPlaceFilter();
			$scope.$on('$destroy', function () {
				dialogService.unregisterProdPlaceFilter();
				//dialogService.unwatchWeekdays();
			});
		}
	]);
})();