/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'basics.costcodes';
	/**
	 * @ngdoc service
	 * @name basicsCostGroupsWizardService
	 * @description provides wizard configuarion
	 */
	angular.module(moduleName).factory('basicsCostCodesWizardService', ['platformDialogService', 'basicsCommonImportDataService', 'basicsCostCodesMainService', 'platformModalService', 'platformSidebarWizardCommonTasksService', '$http', '$translate',
		function (platformDialogService, basicsCommonImportDataService, basicsCostCodesMainService, platformModalService, platformSidebarWizardCommonTasksService, $http, $translate) {
			function importCostCodes() {
				basicsCommonImportDataService.execute(basicsCostCodesMainService, moduleName);
			}

			function enableDisableCostCodes() {
				const selectedCostCode  = basicsCostCodesMainService.getSelected();
				let selectCostCodeMsg = $translate.instant('basics.costcodes.selectCostCode');
				let title = $translate.instant('basics.costcodes.enableDisableCostCode.title');
				if (platformSidebarWizardCommonTasksService.assertSelection(selectedCostCode, title, selectCostCodeMsg)) {
					const isActive = selectedCostCode.IsActive ?? false;
					let modalOptions = {
						headerText: title,
						bodyText:  $translate.instant('basics.costcodes.enableDisableCostCode.message', { status: isActive ? 'disabled' : 'enabled' }),
						iconClass: 'ico-info',
						showCancelButton: true,
						showOkButton: true,
					};

					platformModalService.showDialog(modalOptions).then(function (result) {
						if (result.ok) {
							$http.get(globals.webApiBaseUrl + 'basics/costcodes/enabledisablecostcode?costCodeId=' + selectedCostCode.Id + '&isActive=' + isActive).then(function (response) {
								if (response) {
									const successString = $translate.instant('basics.costcodes.enableDisableCostCode.success', { status: isActive ? 'disabled' : 'enabled' });
									basicsCostCodesMainService.navigateTo(selectedCostCode);
									platformModalService.showMsgBox(successString, 'basics.costcodes.enableDisableCostCode.title', 'ico-info');
								} else {
									platformModalService.showMsgBox('cloud.common.errorDialogTitle', 'cloud.common.errorMessage', 'ico-error');
								}
							}).catch(function () {
								platformModalService.showMsgBox('cloud.common.errorDialogTitle', 'cloud.common.errorMessage', 'ico-error');
							});
						}
					});
				}
			}

			return {
				importCostCodes: importCostCodes,
				enableDisableCostCodes: enableDisableCostCodes

			};
		}
	]);
})();