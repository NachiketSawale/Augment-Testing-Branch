(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'procurement.pes';
	angular.module(moduleName).controller('procurementPesWizardCreateCOContractDialogController', [
		'_', '$scope', '$translate', 'procurementPesWizardService', 'platformModuleInfoService', function (
			_, $scope, $translate, procurementPesWizardService, platformModuleInfoService) {
			// eslint-disable-next-line no-unused-vars
			let translatePrefix = 'procurement.rfq.wizard.create.quote.';
			let isLinkFrameworkContract = $scope.options.isLinkFrameworkContract;
			$scope.initOptions = {
				headerTitle: $translate.instant('procurement.pes.createCOContractWizard.dialogTitle'),
				navigateTitle: platformModuleInfoService.getNavigatorTitle('procurement.contract'),
				closeBtnText: $translate.instant('cloud.common.close'),
				Msg: $translate.instant('procurement.pes.createCOContractWizard.createCOContractsSuccessfully'),
				Code:$translate.instant('procurement.pes.wizard.newCode',{newCode:$scope.options.contractList}),
				onNext: function () { // create base contracts.
					procurementPesWizardService.goModule($scope.options.contractIds);
					$scope.$close(false);
				},
				onClose: function () {
					$scope.$close(false);
				}
			};
			if (isLinkFrameworkContract) {
				$scope.initOptions.headerTitle = $translate.instant('procurement.pes.createCOContractWizard.dialogTitleForFWContract');
				$scope.initOptions.Msg = $translate.instant('procurement.pes.createCOContractWizard.createFWContractsSuccessfully');
			}
		}
	]);
})(angular);