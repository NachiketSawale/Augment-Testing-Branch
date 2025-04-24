(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	var moduleName = 'procurement.package';
	angular.module(moduleName).controller('procurementPackageWizardCreateRfqController', [
		'_', 'globals','$scope', '$translate','$state', 'platformModuleInfoService','cloudDesktopSidebarService', '$rootScope', function (
			_, globals,$scope, $translate,$state, platformModuleInfoService,cloudDesktopSidebarService,$rootScope) {
			let translatePrefix = 'procurement.package.wizard.';
			let navigatorModuleName = 'procurement.rfq';
			$scope.initOptions = {
				headerTitle: $translate.instant(translatePrefix + 'contract'),
				navigateTitle: platformModuleInfoService.getNavigatorTitle(navigatorModuleName),
				closeBtnText: $translate.instant('cloud.common.close'),
				Msg: $translate.instant(translatePrefix + 'createRfqSuccess'),
				Code:$translate.instant(translatePrefix + 'newCode',{newCode:$scope.options.newCode}),
				onNext: function () {
					var url = globals.defaultState + '.' + navigatorModuleName.replace('.', '');
					$state.go(url).then(function () {
						$rootScope.$emit('navigateTo', navigatorModuleName);
						cloudDesktopSidebarService.filterSearchFromPKeys([$scope.options.newId]);
					});
					$scope.$close(false);
				},
				onClose: function () {
					$scope.$close(false);
				}
			};
		}
	]);
})(angular);