/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name sales.contract.services: salesContractCreateFrameworkWicCatalogWizardService
	 * @description
	 * Provides wizard configuration and implementation of all sales contract wizards
	 */
	angular.module('sales.contract').factory('salesContractCreateFrameworkWicCatalogWizardService',
		['$injector', 'globals', '$http', '_', '$translate', 'moment','basicsLookupdataConfigGenerator', 'salesContractService', 'basicsCustomWicTypeLookupDataService', 'platformTranslateService', 'platformModalFormConfigService', 'salesContractValidationService',
			function ($injector, globals, $http, _, $translate, moment,basicsLookupdataConfigGenerator, salesContractService, basicsCustomWicTypeLookupDataService, platformTranslateService, platformModalFormConfigService, salesContractValidationService) {
				var service = {};
				var contract = salesContractService.getSelected();
				var wicType = basicsCustomWicTypeLookupDataService.getDefault({lookupType: 'basicsCustomWicTypeLookupDataService'});
				if (!wicType) {
					basicsCustomWicTypeLookupDataService.getFilteredList({lookupType: 'basicsCustomWicTypeLookupDataService'})
						.then(function () {
							wicType = basicsCustomWicTypeLookupDataService.getDefault({lookupType: 'basicsCustomWicTypeLookupDataService'});
							dataItem.WicTypeFk = wicType ? wicType.Id : null;
						});
				}
				var dataItem = {
					OrdHeaderFk: contract.Id,
					WicGroupFk: null,
					WicTypeFk: wicType ? wicType.Id : null,
					ValidFrom: null,
					ValidTo: null,
					PaymentTermPaFk: contract.PaymentTermPaFk,
					ClerkFk: contract.ClerkFk,
					ConBoqItemFk: null,
					RelatedCallOffContract: null,
					SelectedFrameworkContract: null,
					buttonLogic: false
				};

				service.createWicFromContract = function createWicFromContract() {
					var wicTypeConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'basicsCustomWicTypeLookupDataService',
						enableCache: true
					}, {
						'sortOrder': 3,
						'gid': 'baseGroup',
						required: true,
						'rid': 'wicboq.mdcwictypefk',
						'model': 'WicTypeFk',
						'label': 'WIC Type',
						'label$tr$': 'basics.customize.wictype'
					});
					var selectedContract = salesContractService.getSelected();
					dataItem = {
						OrdHeaderFk: selectedContract.Id,
						WicGroupFk: selectedContract.BoqWicCatFk,
						WicTypeFk: wicType ? wicType.Id : null,
						ValidFrom: dataItem.ValidFrom ? dataItem.ValidFrom : null,
						ValidTo: dataItem.ValidTo ? dataItem.ValidTo : null,
						PaymentTermPaFk: selectedContract.PaymentTermPaFk,
						ClerkFk: selectedContract.ClerkFk,
						ConBoqItemFk: null,
						RelatedCallOffContract: null,
						SelectedFrameworkContract: null,
						buttonLogic: false
					};

					// Filter Framework Call Off Contract and related Framework Contract
					$http.get(globals.webApiBaseUrl + 'sales/contract/relatedcontracts?contractId=' + selectedContract.Id).then(function (response) {
						var isCallOffExist = _.find(response.data, {IsFramework: selectedContract.IsFramework === false});
						dataItem.SelectedFrameworkContract = _.find(response.data, {IsFramework: selectedContract.IsFramework === true});
						if (isCallOffExist !== undefined) {
							dataItem.RelatedCallOffContract = isCallOffExist;
							dataItem.RelatedDateEffective = isCallOffExist.DateEffective;
							// make Wic Type field read-only if if Framework Contract already have any CallOff
							if (dataItem.RelatedCallOffContract.OrdHeaderFk === dataItem.SelectedFrameworkContract.Id) {
								$injector.get('platformRuntimeDataService').readonly(dataItem, [{field: 'WicTypeFk', readonly: true}]);
							}
						}
					});

					// populating data on the wizard dialog
					if (!_.isNil(selectedContract.BoqWicCatBoqFk)) {
						$http.get(globals.webApiBaseUrl + 'boq/wic/boq/list?wicGroupId=' + selectedContract.BoqWicCatFk).then(function (response) {
							var filterItemByWicBoq = _.find(response.data, {Id: selectedContract.BoqWicCatBoqFk});
							dataItem.ValidFrom = filterItemByWicBoq.WicBoq.ValidFrom;
							dataItem.ValidTo = filterItemByWicBoq.WicBoq.ValidTo;
							dataItem.WicTypeFk = filterItemByWicBoq.WicBoq.MdcWicTypeFk;
							dataItem.PaymentTermPaFk = filterItemByWicBoq.WicBoq.BasPaymentTermFk;
						});
					}
					$injector.get('salesCommonBaseBoqLookupService').setCurrentProject(selectedContract.ProjectFk);
					$injector.get('salesCommonBaseBoqLookupService').getSalesBaseBoqList(true);
					$http.get(globals.webApiBaseUrl + 'sales/contract/boq/getboqitemfk?contractId=' + selectedContract.Id + '&projectId=' + selectedContract.ProjectFk).then(function(resp) {
						if (resp.data > 0) {
							dataItem.ConBoqItemFk = resp.data;
						}

						var myDialogOptions = {
							title: $translate.instant('sales.contract.frameworkWicCatalog.createUpdateWicCatalog'),
							dataItem: dataItem,
							formConfiguration: {
								fid: 'sales.contract.frameworkWicCatalog.createUpdateWicCatalog',
								version: '0.1.0',
								showGrouping: false,
								groups: [
									{
										gid: 'baseGroup',
										attributes: ['wicGroup', 'wicBoqItemId', 'WicTypeFk', 'validFrom', 'validTo', 'paymentTermFk', 'clerkFk'],
									},
								],
								rows: [
									{
										gid: 'baseGroup',
										rid: 'wicGroup',
										model: 'WicGroupFk',
										label: 'WIC Group',
										label$tr$: 'sales.contract.frameworkWicCatalog.wicGroup',
										type: 'directive',
										directive: 'basics-lookupdata-lookup-composite',
										required: true,
										readonly: false,
										sortOrder: 1,
										options: {
											lookupDirective: 'basics-lookup-data-by-custom-data-service',
											descriptionMember: 'DescriptionInfo.Translated',
											lookupOptions: {
												valueMember: 'Id',
												displayMember: 'Code',
												lookupModuleQualifier: 'estimateAssembliesWicGroupLookupDataService',
												dataServiceName: 'estimateAssembliesWicGroupLookupDataService',
												showClearButton: false,
												lookupType: 'estimateAssembliesWicGroupLookupDataService',
												columns: [
													{
														id: 'Code',
														field: 'Code',
														name: 'Code',
														formatter: 'code',
														name$tr$: 'cloud.common.entityCode'
													},
													{
														id: 'Description',
														field: 'DescriptionInfo',
														name: 'Description',
														formatter: 'translation',
														name$tr$: 'cloud.common.entityDescription'
													}
												],
												uuid: 'aee374374c634e27ba45e6e145f872ae',
												isTextEditable: false,
												treeOptions: {
													parentProp: 'WicGroupFk',
													childProp: 'WicGroups',
													initialState: 'expanded',
													inlineFilters: true,
													hierarchyEnabled: true
												}
											}
										}
									},
									{
										gid: 'baseGroup',
										rid: 'wicBoqItemId',
										model: 'ConBoqItemFk',
										label: 'Target WIC BoQ',
										label$tr$: 'sales.contract.frameworkWicCatalog.targetWicBoq',
										type: 'directive',
										directive: 'basics-lookupdata-lookup-composite',
										required: true,
										readonly: false,
										sortOrder: 2,
										options: {
											lookupDirective: 'sales-common-base-boq-lookup',
											descriptionMember: 'BoqRootItem.BriefInfo.Translated',
											editorOptions: {
												directive: 'sales-common-base-boq-lookup',
												'lookupOptions': {
													'additionalColumns': true,
													'displayMember': 'BoqRootItem.Reference',
													'descriptionMember': 'BoqRootItem.BriefInfo.Translated',
													'addGridColumns': [
														{
															id: 'briefinfo',
															field: 'BoqRootItem.BriefInfo.Translated',
															name: 'Description',
															formatter: 'description',
															width: 150,
															name$tr$: 'cloud.common.entityDescription'
														}
													],
													'filterKey': 'prc-con-wic-cat-boq-filter'
												}
											},
											formatter: 'lookup',
											formatterOptions: {
												lookupType: 'PrcWicCatBoqs',
												displayMember: 'BoqRootItem.Reference',
												descriptionMember: 'BoqRootItem.BriefInfo.Translated',
												pKeyMaps: [{pkMember: 'BoqWicCatFk', fkMember: 'BoqWicCatFk'}]
											},
										}
									},
									wicTypeConfig,
									{
										gid: 'baseGroup',
										rid: 'ValidFrom',
										model: 'ValidFrom',
										label: 'Valid From',
										label$tr$: 'sales.contract.frameworkWicCatalog.entityValidFrom',
										required: false,
										type: 'date',
										validator: salesContractValidationService.validateValidFrom,
										sortOrder: 4
									},
									{
										gid: 'baseGroup',
										rid: 'ValidTo',
										model: 'ValidTo',
										required: false,
										label: 'Valid To',
										label$tr$: 'sales.contract.frameworkWicCatalog.entityValidTo',
										type: 'date',
										validator: salesContractValidationService.validateValidTo,
										sortOrder: 5
									},
									{
										gid: 'baseGroup',
										rid: 'paymentTermFk',
										model: 'PaymentTermPaFk', // TODO: check: 'Pa' stand for progress application. correct here?
										label: 'Payment Term',
										required: false,
										label$tr$: 'sales.contract.frameworkWicCatalog.entityPaymentTermFk',
										type: 'directive',
										directive: 'basics-lookupdata-lookup-composite',
										options: {
											lookupDirective: 'basics-lookupdata-payment-term-lookup',
											descriptionMember: 'Description',
											lookupOptions: {
												showClearButton: true
											}
										},
										sortOrder: 6
									},
									{
										gid: 'baseGroup',
										rid: 'clerkFk',
										model: 'ClerkFk',
										label: 'Responsible',
										label$tr$: 'sales.contract.entityClerkFk',
										type: 'directive',
										directive: 'basics-lookupdata-lookup-composite',
										sortOrder: 7,
										options: {
											lookupDirective: 'cloud-clerk-clerk-dialog',
											descriptionMember: 'Description',
											lookupOptions: {
												filterKey: 'con-wizard-update-framework-material-catalog-clerk-filter', // TODO: this filter is probably defined in procurement? Where is the definition of the filter?
												showClearButton: true
											}
										}
									}
								]
							},
							showOkButton: false,
							// added Custom buttons for Create/Update WIC
							buttons: [
								// Update Button Logic
								{
									caption: 'Update',
									caption$tr$: 'cloud.common.buttonUpdate',
									disabled: function disabled() {
										contract = salesContractService.getSelected();
										let startDate = moment.utc(dataItem.ValidFrom);
										let endDate = moment.utc(dataItem.ValidTo);
										if (contract.IsFramework === false || startDate > endDate || dataItem.buttonLogic) {
											return true;
										}
										else if(!_.isNil(dataItem.RelatedCallOffContract) && !_.isUndefined(dataItem.RelatedCallOffContract)) {
											let entityDateEffectiveFromFrameworkCallOffOrder = moment.utc(dataItem.RelatedCallOffContract.DateEffective);
											if(entityDateEffectiveFromFrameworkCallOffOrder.isAfter(endDate) || entityDateEffectiveFromFrameworkCallOffOrder.isBefore(startDate)){
												return true;
											}
										}
									},
									fn: function (button, info) {
										var data = info.scope.options.dataItem;
										var postData = {
											OrdHeaderFk: data.OrdHeaderFk,
											WicGroupFk: data.WicGroupFk,
											ValidFrom: data.ValidFrom,
											ValidTo: data.ValidTo,
											PaymentTermPaFk: data.PaymentTermPaFk,
											ClerkFk: data.ClerkFk,
											WicTypeFk: data.WicTypeFk,
											WicBoqFk: data.ConBoqItemFk

										};
										$http.post(globals.webApiBaseUrl + 'sales/contract/' + 'updatewiccatalog', postData).then(function (res) {
											if (!res.data.withErrors) {
												contract.ClerkFk = res.data.BasClerkFk;
												var title = 'cloud.common.informationDialogHeader';
												var message = 'sales.contract.frameworkWicCatalog.updateSuccessfully';
												$injector.get('platformModalService').showMsgBox(message, title, 'info').then(function () {
													info.$close();
												});
											} else {
												return $injector.get('platformModalService').showMsgBox('sales.contract.frameworkWicCatalog.' + res.data.errors, 'cloud.common.informationDialogHeader', 'ico-info');
											}
											info.$close();
										});
									}
								},
								// Create Button Logic
								{
									caption: 'Create',
									caption$tr$: 'cloud.common.buttonCreate',
									disabled: function disabled(info) {
										contract = salesContractService.getSelected();
										var data = info.scope.options.dataItem;
										let startDate = moment.utc(data.ValidFrom);
										let endDate = moment.utc(data.ValidTo);
										if ((data.ConBoqItemFk === 0 || data.ConBoqItemFk === null || data.ConBoqItemFk === undefined ||
											data.WicTypeFk === 0 || data.WicTypeFk === null || data.WicTypeFk === undefined ||
											data.WicGroupFk === 0 || data.WicGroupFk === null || data.WicGroupFk === undefined || startDate > endDate) || contract.IsFramework) {
											return true;
										}
									},
									fn: function (button, info) {
										var data = info.scope.options.dataItem;
										var postData = {
											OrdHeaderFk: data.OrdHeaderFk,
											WicGroupFk: data.WicGroupFk,
											ValidFrom: data.ValidFrom,
											ValidTo: data.ValidTo,
											PaymentTermPaFk: data.PaymentTermPaFk,
											ClerkFk: data.ClerkFk,
											WicTypeFk: data.WicTypeFk,
										};
										$http.post(globals.webApiBaseUrl + 'sales/contract/' + 'createwiccatalog', postData).then(function (res) {
											if (!res.data.withErrors) {
												var selectedContract = salesContractService.getSelected();
												selectedContract.IsFramework = true;
												selectedContract.BoqWicCatBoqFk = res.data.data.Id;
												selectedContract.BoqWicCatFk = res.data.data.WicGroupFk;
												dataItem.buttonLogic = true;
												$injector.get('platformRuntimeDataService').readonly(selectedContract, [{field: 'BusinesspartnerFk', readonly: true}, {field: 'CustomerFk', readonly: true}, {field: 'SubsidiaryFk', readonly: true}, {
													field: 'BoqWicCatBoqFk',
													readonly: true
												}, {field: 'BoqWicCatFk', readonly: true}]);
												salesContractService.gridRefresh();
												return $http.get(globals.webApiBaseUrl + 'boq/wic/boq/list?wicGroupId=' + res.data.data.WicGroupFk).then(function (response) {
													$injector.get('basicsLookupdataLookupDescriptorService').updateData('PrcWicCatBoqs', response.data);
													return $http.post(globals.webApiBaseUrl + 'sales/contract/' + 'setisframework?contractId=' + data.OrdHeaderFk + '&boqWicCatFk=' + res.data.data.WicGroupFk + '&boqWicCatBoqFk=' + res.data.data.Id).then(function () {
														var title = 'cloud.common.informationDialogHeader';
														var message = 'sales.contract.frameworkWicCatalog.createSuccessfully';
														$injector.get('platformModalService').showMsgBox(message, title, 'info').then(function () {
															info.$close();
														});
														info.$close();
													});
												});
											} else {
												return $injector.get('platformModalService').showMsgBox('sales.contract.frameworkWicCatalog.' + res.data.errors, 'cloud.common.informationDialogHeader', 'ico-info');
											}

										});
									}
								}
							],
						};
						// make Wic BoQ field read-only if available
						if(!_.isNil(dataItem.ConBoqItemFk)){
							var rows = _.find(myDialogOptions.formConfiguration.rows,{rid:'wicBoqItemId'});
							rows.readonly = true;
						}

						// make Wic Group field read-only if available
						if(!_.isNil(dataItem.WicGroupFk)){
							var abc = _.find(myDialogOptions.formConfiguration.rows,{rid:'wicGroup'});
							abc.readonly = true;
						}

						platformTranslateService.translateFormConfig(myDialogOptions .formConfiguration);
						platformModalFormConfigService.showDialog(myDialogOptions );
					});
				};
				return service;
			}

		]);
})();
