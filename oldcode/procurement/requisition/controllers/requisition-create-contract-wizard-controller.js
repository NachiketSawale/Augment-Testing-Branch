(function (angular) {
	'use strict';
	let moduleName = 'procurement.requisition';
	angular.module(moduleName).controller('procurementRequisitionCreateContractWizardController', [
		'globals','_', '$scope', '$translate', 'procurementRequisitionCreateContractWizardBusinessPartnerService', 'platformModuleInfoService','cloudDesktopSidebarService',
		'platformModuleNavigationService', function (
			globals,_, $scope, $translate, procurementRequisitionCreateContractWizardBusinessPartnerService, platformModuleInfoService,cloudDesktopSidebarService,
			platformModuleNavigationService) {
			let translatePrefix = 'procurement.requisition.wizard.create.';
			let newCode = {};
			if ($scope.options.newCode){
				newCode = {newCode:$scope.options.newCode};
			}else{
				newCode = $scope.options.newCodes && $scope.options.newCodes.length > 0 ? {newCode: $scope.options.newCodes.join(',')} : {newCode: ''};
			}

			$scope.initOptions = {
				headerTitle: $translate.instant(translatePrefix + 'contract'),
				navigateTitle: platformModuleInfoService.getNavigatorTitle('procurement.contract'),
				closeBtnText: $translate.instant('cloud.common.close'),
				Msg: $translate.instant(translatePrefix + 'createContractSuccessfully'),
				Code:$translate.instant(translatePrefix + 'newCode', newCode),
				onNext: function () {
					let newIds;
					if ($scope.options.newId) {
						newIds = [$scope.options.newId];
					} else {
						newIds = $scope.options.newIds && $scope.options.newIds.length > 0 ? $scope.options.newIds : []
					}

					if (newIds.length > 0) {
						$scope.$close(false);
						let navigator = {
							moduleName: 'procurement.contract',
							registerService: 'procurementContractHeaderDataService'
						};
						platformModuleNavigationService.navigate(navigator, newIds);
					}
				},
				onClose: function () {
					$scope.$close(false);
				}
			};
		}
	]);
})(angular);