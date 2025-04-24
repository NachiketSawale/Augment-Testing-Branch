(function (angular) {
	'use strict';

	/* global _ */

	const moduleName = 'productionplanning.common';

	angular.module(moduleName).controller('ppsCommonProductRelocateStockController', ProductRelocateStockController);

	ProductRelocateStockController.$inject = ['$injector',
		'$scope', 'params', '$translate', 'ppsCommonProductRelocateStockDataService'];

	function ProductRelocateStockController($injector, $scope, params, $translate, dialogService) {

		$scope.customBtn1 = $scope.customBtn2 = false;
		$scope.showOkButton = $scope.showCancelButton = true;
		$scope.alerts = [];

		$scope.dataItem = {
			MdcMaterialFk: 0,
			SiteFk: 0,
			PpsHeaderFk: 0,
			PpsItemFk: 0,
			AvailableQuantity: 0,
			PlanQuantity: 0
		};

		const hasValidationError = () =>{
			return $scope.dataItem.PlanQuantity === 0 || $scope.dataItem.AvailableQuantity < $scope.dataItem.PlanQuantity ||
			$scope.dataItem.MdcMaterialFk === 0;
		};

		$scope.modalOptions = {
			isDisabled: function (button) {
				if (button === 'ok') {
					return hasValidationError();
				} else {
					return false;
				}
			}
		};

		$scope.onOK = function () {
			$scope.isBusy = true;
			dialogService.handleOK($scope.dataItem).then(function (result) {
				if (result && result !== false) {
					$injector.get('productionplanningCommonProductItemDataService').load().then(function (){
						$scope.$close(result);
					}).finally(function () {
						$scope.isBusy = false;
					});
				}
			});
		};
		$scope.onCancel = function () {
			$scope.$close(false);
		};

		$scope.formContainerOptions = {
			formOptions: {
				configure: dialogService.getFormConfig().formConfiguration
			},
			setTools: function () {
			}
		};

		dialogService.init(params.ppsItem).then(function (result) {
			$scope.dataItem = result;
		});

		_.extend($scope.modalOptions, {
			headerText: $translate.instant('productionplanning.common.product.relocateStock'),
			cancel: $scope.onCancel
		});

		$scope.$on('$destroy', function () {
		});

	}
})(angular);