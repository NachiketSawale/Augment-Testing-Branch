(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';
	angular.module(moduleName).controller('procurementRfqWizardCreateContractController', [
		'_', '$scope', '$translate', 'procurementRfqWizardService', 'platformModuleInfoService', function (
			_, $scope, $translate, procurementRfqWizardService, platformModuleInfoService) {
			let translatePrefix = 'procurement.rfq.wizard.create.quote.';
			$scope.initOptions = {
				headerTitle: $translate.instant(translatePrefix + 'title'),
				navigateTitle: platformModuleInfoService.getNavigatorTitle('procurement.quote'),
				closeBtnText: $translate.instant('cloud.common.close'),
				Msg: $translate.instant(translatePrefix + 'successful'),
				Code:$translate.instant(translatePrefix + 'newCode', {newCode: $scope.options.newCode.toString()}),
				onNext: function () {
					procurementRfqWizardService.goModule();
					$scope.$close(false);
				},
				onClose: function () {
					$scope.$close(false);
				}
			};
		}
	]);
})(angular);