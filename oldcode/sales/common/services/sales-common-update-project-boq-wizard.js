/**
 * $Id: sales-common-update-project-boq-wizard-service.js 48106 2022-07-26 15:23:16Z janas $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.common';
	var salesCommonModule = angular.module(moduleName);
	salesCommonModule.factory('salesCommonUpdateProjectBoqWizard',
		['$http', 'globals', 'platformDialogService', 'platformSidebarWizardCommonTasksService',
			function ($http, globals, platformDialogService, platformSidebarWizardCommonTasksService) {
				var service = {};
				service.showDialog = function updateProjectBoqs(module, mainEntityId) {
					var modalOptions = {
						headerText$tr$: 'sales.common.updatePrjBoqWizard.title',
						width: '700px',
						showOkButton: true,
						buttons: [{
							id: 'ok',
							disabled: function (/* info */) {
								return (modalOptions.value.UpdateBudgets === false
									&& modalOptions.value.UpdateQuantities === false && modalOptions.value.UpdateWqQuantity === false && modalOptions.value.UpdateAqQuantity === false
									&& modalOptions.value.UpdatePrices === false && modalOptions.value.UpdateCostGroups === false);
							}
						}],
						showCancelButton: true,
						resizeable: true,
						value: {
							MainEntityId: mainEntityId,
							UpdateBudgets: false,
							UpdateQuantities: false,
							UpdateAqQuantity: false,
							UpdateWqQuantity: false,
							UpdatePrices: true,
							UpdateCostGroups: false
						},
						watches: [{
							expression: 'dialog.modalOptions.value.UpdateQuantities',
							fn: function (/* info */) {
								if (modalOptions.value.UpdateWqQuantity === false
									&& modalOptions.value.UpdateAqQuantity === false
									&& modalOptions.value.UpdateQuantities === true) {
									modalOptions.value.UpdateAqQuantity = true;
									modalOptions.value.UpdateWqQuantity = true;
								} else if (modalOptions.value.UpdateWqQuantity === true
									&& modalOptions.value.UpdateAqQuantity === true) {
									modalOptions.value.UpdateAqQuantity = false;
									modalOptions.value.UpdateWqQuantity = false;
								}
							}
						},{
							expression: 'dialog.modalOptions.value.UpdateWqQuantity',
							fn: function (/* info */) {
								if (modalOptions.value.UpdateWqQuantity === true) {
									modalOptions.value.UpdateQuantities = true;
								}
								else if (modalOptions.value.UpdateAqQuantity === false) {
									modalOptions.value.UpdateQuantities = false;
								}
							}
						}, {
							expression: 'dialog.modalOptions.value.UpdateAqQuantity',
							fn: function (/* info */) {
								if (modalOptions.value.UpdateAqQuantity === true) {
									modalOptions.value.UpdateQuantities = true;
								}
								else if (modalOptions.value.UpdateWqQuantity === false) {
									modalOptions.value.UpdateQuantities = false;
								}
							}
						}],
						bodyTemplateUrl: 'sales.common/partials/sales-common-update-project-boq.html'
					};
					platformDialogService.showDialog(modalOptions).then(function (result) {
						if (result.ok) {
							var apiUrl = '';
							// if calling from bid submodule
							if (module === 'sales.bid') {
								apiUrl = 'sales/bid/boq/updateprjboqs/';
							}

							// if calling from contract submodule
							if (module === 'sales.contract') {
								apiUrl = 'sales/contract/boq/updateprjboqs/';
							}

							// if provided valid api url
							if (apiUrl !== '') {
								$http.post(globals.webApiBaseUrl + apiUrl, result.value).then(function (response) {
									if (!response.data.withErrors) {
										platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('sales.common.updatePrjBoqWizard.title');
									} else {
										platformDialogService.showErrorBox(response.data.errors, 'sales.common.updatePrjBoqWizard.title');
									}
								});
							}
							else {
								platformDialogService.showErrorBox('Invalid request !', 'sales.common.updatePrjBoqWizard.title');
							}
						}
					});
				};
				return service;
			}
		]);
})();