/**
 * Created by yew on 3/04/2020.
 */
// eslint-disable-next-line func-names
// eslint-disable-next-line no-redeclare
/* global angular */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.stock';
	angular.module(moduleName).controller('createContractRequisitionSuccessController', [
		'$scope', '$translate', 'platformModuleNavigationService',
		// eslint-disable-next-line func-names
		function ($scope, $translate, platformModuleNavigationService) {
			// eslint-disable-next-line func-names
			$scope.onOK = function () {
				$scope.$close(false);
			};
			$scope.dialog = {
				modalOptions: {
					topDescription: {
						iconClass: 'tlb-icons ico-info',
						text: $translate.instant('procurement.stock.wizard.createByOrderProposal.success',{
							createType: $scope.modalOptions.headerText
						})
					}
				}
			};
			$scope.modalOptions.gotoType = $translate.instant('procurement.stock.wizard.createByOrderProposal.goto',{goto: $scope.modalOptions.item});

			// eslint-disable-next-line func-names
			$scope.goToModule = function () {
				var ids = $scope.modalOptions.itemList;
				if (ids.length > 0) {
					$scope.$close(false);
					var navigator = {
						moduleName: $scope.modalOptions.moduleName,
						registerService: $scope.modalOptions.registerService
					};
					platformModuleNavigationService.navigate(navigator, ids);
				}
			};
		}
	]);
})(angular);