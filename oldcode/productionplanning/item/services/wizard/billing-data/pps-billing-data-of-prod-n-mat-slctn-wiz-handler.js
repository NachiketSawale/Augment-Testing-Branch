/**
 * Created by zwz on 12/27/2024.
 */
(function (angular) {
	'use strict';
	/* global globals, _ */

	const moduleName = 'productionplanning.item';
	angular.module(moduleName).service('ppsBillingDataOfProductAndMaterialSelectionWizardHandler', Handler);
	Handler.$inject = ['$http', '$q', '$translate', 'platformModalService', 'platformSidebarWizardCommonTasksService', 'cloudDesktopPinningContextService', 'basicsLookupdataLookupDescriptorService'];

	function Handler($http, $q, $translate, platformModalService, platformSidebarWizardCommonTasksService, cloudDesktopPinningContextService, basicsLookupdataLookupDescriptorService) {

		function checkWithPinningContext(deferred) {
			function getPinningHeader() {
				const context = cloudDesktopPinningContextService.getContext();
				if (!_.isNil(context)) {
					return _.find(context, {token: 'productionplanning.item'});
				}
				return null;
			}

			const pinPpsHeader = getPinningHeader();
			if (pinPpsHeader) {
				basicsLookupdataLookupDescriptorService.loadItemByKey({
					ngModel: pinPpsHeader.id,
					options: {lookupType: 'PpsHeader', version: 3}
				}).then(ppsHeader => {
					if (ppsHeader) {
						deferred.resolve({
							valid: true,
							filterObj: {
								projectId: ppsHeader.PrjProjectFk,
								ppsHeaderId: ppsHeader.Id,
								ordHeaderId: ppsHeader.OrdHeaderFk,
								jobIds: [ppsHeader.LgmJobFk],
								ppsItemIds: [],
								preselectionProducts: [],
							}
						});
					}
				});
			} else {
				deferred.resolve({
					valid: false,
					errorMsg: $translate.instant('productionplanning.item.wizard.billingDataOfProductAndMaterialSelection.selectingOrPinningPUIsRequired'),
				});
			}
		}

		function doesSelectedPUsHaveDifferentPpsHeaders(selectedPUs) {
			if (selectedPUs.length === 1) {
				return false;
			}
			const tmpPU = selectedPUs[0];
			return selectedPUs.some(p => p.PPSHeaderFk !== tmpPU.PPSHeaderFk && p.Id !== tmpPU.Id);
		}

		function createFilterObj(selectedPUs, selectedProducts = []) {
			return {
				projectId: selectedPUs[0].ProjectFk,
				ppsHeaderId: selectedPUs[0].PPSHeaderFk,
				ordHeaderId: selectedPUs[0].OrdHeaderFk,
				jobIds: Array.from(new Set(selectedPUs.map(e => e.LgmJobFk))),
				ppsItemIds: selectedPUs.map(e => e.Id),
				preselectedProducts: _.cloneDeep(selectedProducts),
				//preselectionProductIds: selectedProducts.map(e => e.Id),
				materialIds: selectedProducts?.length > 0 ? Array.from(new Set(selectedProducts.map(e => e.MaterialFk)))
					: Array.from(new Set(selectedPUs.map(e => e.MdcMaterialFk))),
				statusIds: selectedProducts?.length > 0 ? Array.from(new Set(selectedProducts.map(e => e.ProductStatusFk)))
					: undefined,
			};
		}

		function validatePpsHeadersOfSelectedPpsItems(selectedPUs, deferred, selectedProducts = [], forProduct = false) {
			const errorMsgTr = forProduct === true
				? 'productionplanning.item.wizard.billingDataOfProductAndMaterialSelection.ppsHeadersIsNotTheSameForProduct'
				: 'productionplanning.item.wizard.billingDataOfProductAndMaterialSelection.ppsHeadersIsNotTheSame';
			const result = doesSelectedPUsHaveDifferentPpsHeaders(selectedPUs)
				? {
					valid: false,
					errorMsg: $translate.instant(errorMsgTr),
				}
				: {
					valid: true,
					filterObj: createFilterObj(selectedPUs, selectedProducts)
				};
			deferred.resolve(result);
		}

		function validateForPpsItem(ppsItemDataSrv) {
			let deferred = $q.defer();
			let selectedPUs = ppsItemDataSrv.getSelectedEntities();
			if (selectedPUs?.length <= 0) {
				checkWithPinningContext(deferred);
			} else {
				validatePpsHeadersOfSelectedPpsItems(selectedPUs, deferred);
			}

			return deferred.promise;
		}

		function validateForProduct(productDataSrv) {
			let deferred = $q.defer();
			let selectedProducts = productDataSrv.getSelectedEntities();
			if (selectedProducts?.length <= 0) {
				deferred.resolve({
					valid: false,
					errorMsg: $translate.instant('productionplanning.item.wizard.billingDataOfProductAndMaterialSelection.selectingProductIsRequired'),
				});
			} else {
				const selectedPUIds = Array.from(new Set(selectedProducts.map(e => e.ItemFk)));
				const PUsObj = basicsLookupdataLookupDescriptorService.getData('PPSItem');
				const selectedPUs = [];
				selectedPUIds.forEach(id => {
					if (PUsObj[id]) {
						selectedPUs.push(PUsObj[id]);
					}
				});
				validatePpsHeadersOfSelectedPpsItems(selectedPUs, deferred, selectedProducts, true);
			}

			return deferred.promise;
		}

		function showErrorDialog(result) {
			const modalOptions = {
				headerText: $translate.instant('productionplanning.item.wizard.billingDataOfProductAndMaterialSelection.dialogTitle'),
				bodyText: result.errorMsg,
				iconClass: 'ico-info'
			};
			platformModalService.showDialog(modalOptions);
		}

		function showWizardDialog(filterObj) {
			const modalCreateConfig = {
				width: '1000px',
				height: 'max',
				resizeable: true,
				templateUrl: globals.appBaseUrl + 'productionplanning.item/templates/pps-billing-data-of-prod-n-mat-slctn-wiz-dlg.html',
				controller: 'ppsBillingDataOfProductAndMaterialSelectionWizardDialogController',
				resolve: {
					$options: function () {
						return {
							filterObj: filterObj
						};
					}
				}
			};
			platformModalService.showDialog(modalCreateConfig);
		}

		this.showDialogForPpsItem = function (ppsItemDataSrv) {
			validateForPpsItem(ppsItemDataSrv).then(result => {
				if (!result.valid) {
					showErrorDialog(result);
				} else {
					showWizardDialog(result.filterObj);
				}
			});
		};

		this.showDialogForProduct = function (productDataSrv) {
			validateForProduct(productDataSrv).then(result => {
				if (!result.valid) {
					showErrorDialog(result);
				} else {
					showWizardDialog(result.filterObj);
				}
			});
		};

	}
})(angular);