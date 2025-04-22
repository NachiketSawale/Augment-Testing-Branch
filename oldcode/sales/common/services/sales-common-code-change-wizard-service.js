/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {
	'use strict';
	var moduleName = 'sales.common';
	var salesCommonModule = angular.module(moduleName);

	salesCommonModule.factory('salesCommonCodeChangeWizardService',
		['_', '$rootScope', '$injector', '$log', '$translate', 'platformSidebarWizardCommonTasksService', 'platformTranslateService', 'platformModalService', 'platformModalFormConfigService', 'platformRuntimeDataService',
			function (_, $rootScope, $injector, $log, $translate, platformSidebarWizardCommonTasksService, platformTranslateService, platformModalService, platformModalFormConfigService, platformRuntimeDataService) {

				var service = {};

				var subModule2Context = {
					'sales.bid': {
						id: 1,
						mainService: 'salesBidService',
						codeProp: 'Code',
						titleIdentifier: 'sales.bid.bidSelectionMissing',
						msgIdentifier: 'sales.bid.noBidHeaderSelected',
						msgReadOnlyIdentifier: 'sales.bid.bidIsReadOnly',
						validationService: 'salesBidValidationService'
					},
					'sales.contract': {
						id: 2,
						mainService: 'salesContractService',
						codeProp: 'Code',
						titleIdentifier: 'sales.contract.contractSelectionMissing',
						msgIdentifier: 'sales.contract.noContractHeaderSelected',
						msgReadOnlyIdentifier: 'sales.contract.contractIsReadOnly',
						validationService: 'salesContractValidationService'
					},
					'sales.wip': {
						id: 3,
						mainService: 'salesWipService',
						codeProp: 'Code',
						titleIdentifier: 'sales.wip.wipSelectionMissing',
						msgIdentifier: 'sales.wip.noWipHeaderSelected',
						msgReadOnlyIdentifier: 'sales.wip.wipIsReadOnly',
						validationService: 'salesWipValidationService'
					},
					'sales.billing': {
						id: 4,
						mainService: 'salesBillingService',
						codeProp: 'BillNo',
						titleIdentifier: 'sales.billing.billSelectionMissing',
						msgIdentifier: 'sales.billing.noBillHeaderSelected',
						msgReadOnlyIdentifier: 'sales.billing.billIsReadOnly',
						validationService: 'salesBillingValidationService'
					}
				};

				service.getContext = function getContext() {
					if (!_.includes(_.keys(subModule2Context), $rootScope.currentModule)) {
						$log.warn('No context available for given sub module!');
					}
					return subModule2Context[$rootScope.currentModule];
				};

				service.getAsyncValidator = function getAsyncValidator(context) {
					var validationService = $injector.get(context.validationService);
					return validationService.asyncValidateCode; // (info: asyncValidateBillNo is mapped to asyncValidateCode)
				};

				service.assertNotReadonlyStatus = function assertNotReadonlyStatus(selItem, context) {
					if (selItem && selItem.IsReadonlyStatus) {
						var title = $translate.instant('sales.common.codeChangeWizardTitle');
						var message = $translate.instant(context.msgReadOnlyIdentifier);
						platformModalService.showDialog({
							headerText: $translate.instant(title),
							bodyText: message,
							iconClass: 'ico-info'
						});
						return false;
					}
					return true;
				};

				service.checkAssertions = function checkAssertions(selItem, context) {
					if (platformSidebarWizardCommonTasksService.assertSelection(selItem, context.titleIdentifier, $translate.instant(context.msgIdentifier))) {
						return this.assertNotReadonlyStatus(selItem, context);
					}
					return false;
				};

				service.showDialog = function showDialog() {
					var context = this.getContext();
					var mainService = $injector.get(context.mainService);
					var selectedEntity = mainService.getSelected();

					// Check if entity is selected
					if (this.checkAssertions(selectedEntity, context)) {
						var changeCodeConfig = {
							title: $translate.instant('sales.common.codeChangeWizardTitle'),
							dataItem: {
								Code: selectedEntity[context.codeProp],
								NewCode: null,
								DescriptionInfo: selectedEntity.DescriptionInfo
							},
							formConfiguration: {
								fid: 'sales.common.codeChangeWizard',
								version: '0.1.0',
								showGrouping: false,
								groups: [
									{
										gid: 'baseGroup',
										attributes: ['Code', 'NewCode', 'DescriptionInfo']
									}
								],
								rows: [
									{
										gid: 'baseGroup',
										rid: 'Code',
										model: 'Code',
										label$tr$: 'cloud.common.entityCode',
										type: 'code',
										sortOrder: 1,
										readonly: true
									},
									{
										gid: 'baseGroup',
										rid: 'NewCode',
										model: 'NewCode',
										label$tr$: 'sales.common.entityNewCode',
										type: 'code',
										sortOrder: 2,
										asyncValidator: this.getAsyncValidator(context)
									},
									{
										gid: 'baseGroup',
										rid: 'DescriptionInfo',
										model: 'DescriptionInfo',
										label$tr$: 'cloud.common.entityDescription',
										type: 'translation',
										sortOrder: 3,
										readonly: true
									}
								]
							},
							handleOK: function handleOK(result) {
								if (result.ok === true) {
									mainService.getSelected()[context.codeProp] = result.data.NewCode;
									mainService.markCurrentItemAsModified();
									mainService.gridRefresh();
								}
							},
							dialogOptions: {
								disableOkButton: function () {
									return changeCodeConfig.dataItem.runningValidation ||
										platformRuntimeDataService.hasError(changeCodeConfig.dataItem, 'NewCode')
										|| _.isNil(changeCodeConfig.dataItem.NewCode)
										|| (_.isString(changeCodeConfig.dataItem.NewCode) && _.size(changeCodeConfig.dataItem.NewCode) <= 0);
								}
							}
						};

						platformTranslateService.translateFormConfig(changeCodeConfig.formConfiguration);
						platformModalFormConfigService.showDialog(changeCodeConfig);
					}
				};

				return service;

			}]);
})();
