/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.common';

	angular.module(moduleName).controller('salesCommonCreateDialogController',
		['globals', '$scope', '$translate', '$modalInstance', 'salesCommonCreateDialogService','$injector',
			function (globals, $scope, $translate, $modalInstance, salesCommonCreateDialogService, $injector) {

				$scope.modalOptions = {
					headerText: salesCommonCreateDialogService.getTitle(),
					tabBasics: $translate.instant('sales.common.createDialog.tabBasics'),
					tabBoq: $translate.instant('sales.common.createDialog.tabBoq'),
					ok: function () { $modalInstance.close({ok: true}); }, // TODO: check
					disableOk: function () {
						return !salesCommonCreateDialogService.validateSettings() || $injector.get('salesCommonFunctionalRoleService').getIsFunctionalRoleRestriction();
					},
					showCloseButton: true,
					actionButtonText: $translate.instant('cloud.common.ok'),
					closeButtonText: $translate.instant('cloud.common.cancel'),
					cancel: function () { $modalInstance.close({cancel: true}); } // TODO: check
				};
				$scope.dialog = {
					modalOptions: $scope.modalOptions
				};
				$scope.tabs = [
					{
						id: 'tabBasics',
						title: $scope.modalOptions.tabBasics,
						content: globals.appBaseUrl + 'sales.common/partials/sales-common-create-dialog-tab-basics.html',
						active: true
					},
					{
						id: 'tabBoq',
						title: $scope.modalOptions.tabBoq,
						content: globals.appBaseUrl + 'sales.common/partials/sales-common-create-dialog-tab-boq.html'
					}
				];
			}]);
})();
