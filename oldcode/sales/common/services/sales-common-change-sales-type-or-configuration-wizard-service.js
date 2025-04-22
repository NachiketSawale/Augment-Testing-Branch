/**
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	let moduleName = 'sales.common';

	/**
	 * @ngdoc service
	 * @name salesCommonChangeSalesTypeOrConfigurationUIService
	 * @function
	 * @description retrieve ui configuration from this service
	 */
	angular.module(moduleName).factory('salesCommonChangeSalesTypeOrConfigurationUIService',
		['_', '$log', '$injector', 'platformTranslateService','basicsLookupdataConfigGenerator','$rootScope',
			function (_, $log, $injector, platformTranslateService,basicsLookupdataConfigGenerator,$rootScope) {
				let service = {};
				let typeId = '';
				let typeFilter = '';
				let filterForConfiguration = '';
				let filterForRubricCat = '';
				let filterForChangeEntity = '';
				let asyncRubCatValidator = null;
				let subModule2Context = {
					'sales.bid': {
						id: 1,
						mainService: 'salesBidService',
						codeProp: 'Code',
						titleIdentifier: 'sales.bid.bidSelectionMissing',
						msgIdentifier: 'sales.bid.noBidHeaderSelected',
						msgReadOnlyIdentifier: 'sales.bid.bidIsReadOnly',
						validationService: 'salesBidValidationService',
					},
					'sales.contract': {
						id: 2,
						mainService: 'salesContractService',
						codeProp: 'Code',
						titleIdentifier: 'sales.contract.contractSelectionMissing',
						msgIdentifier: 'sales.contract.noContractHeaderSelected',
						msgReadOnlyIdentifier: 'sales.contract.contractIsReadOnly',
						validationService: 'salesContractValidationService',
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
				let context = service.getContext();
				if (context.id === 1) {
					filterForConfiguration = 'sales-bid-configuration-filter';
					filterForRubricCat = 'sales-bid-rubric-category-by-rubric-filter';
					filterForChangeEntity = 'sales-bid-project-change-common-filter';
					asyncRubCatValidator = $injector.get('salesBidValidationService').asyncValidateRubricCategoryFk;
					typeFilter = 'sales-bid-type-with-rubric-filter';
					typeId = 'bidtype';
				} else if (context.id === 2) {
					filterForConfiguration = 'sales-contract-configuration-filter';
					filterForRubricCat = 'sales-contract-rubric-category-by-rubric-filter';
					filterForChangeEntity = 'sales-contract-project-change-common-filter';
					asyncRubCatValidator = $injector.get('salesContractValidationService').asyncValidateRubricCategoryFk;
					typeFilter = 'sales-contract-type-with-rubric-filter';
					typeId = 'ordertype';
				} else if (context.id === 3) {
					filterForConfiguration = 'sales-wip-configuration-filter';
					filterForRubricCat = 'sales-wip-rubric-category-by-rubric-filter';
					asyncRubCatValidator = $injector.get('salesWipValidationService').asyncValidateRubricCategoryFk;
					typeFilter = 'sales-bill-type-with-rubric-filter';
					typeId = 'billtype';
				} else if (context.id === 4) {
					filterForConfiguration = 'sales-billing-configuration-filter';
					filterForRubricCat = 'sales-billing-rubric-category-by-rubric-filter';
					asyncRubCatValidator = $injector.get('salesBillingValidationService').asyncValidateRubricCategoryFk;
					typeFilter = 'sales-bill-type-with-rubric-filter';
					typeId = 'billtype';
				}

				function onEntityTypeChanged(selectedEntity, typeId) {
					let module = service.getContext();
					// TODO: For Bid Module
					if (module.id === 1) {
						$injector.get('salesBidTypeLookupDataService').getItemByIdAsync(typeId).then(function (typeEntity) {
							// populate related values like rubric category
							let rubricCategoryId = typeEntity.RubricCategoryFk;
							selectedEntity.TypeEntity = typeEntity;
							selectedEntity.RubricCategoryFk = rubricCategoryId;
							onEntityRubricCategoryChanged(selectedEntity, rubricCategoryId);
						});
					}
					// TODO: For Contract Module
					else if (module.id === 2) {
						$injector.get('salesContractTypeLookupDataService').getItemByIdAsync(typeId).then(function (typeEntity) {
							// populate related values like rubric category
							let rubricCategoryId = typeEntity.RubricCategoryFk;
							selectedEntity.TypeEntity = typeEntity;
							selectedEntity.RubricCategoryFk = rubricCategoryId;
							onEntityRubricCategoryChanged(selectedEntity, rubricCategoryId);
						});
					}
					// TODO: For WIP Module
					else if (module.id === 3) {
						$injector.get('salesBillTypeLookupDataService').getItemByIdAsync(typeId).then(function (typeEntity) {
							// populate related values like rubric category
							let rubricCategoryId = typeEntity.RubricCategoryFk;
							selectedEntity.RubricCategoryFk = rubricCategoryId;
							onEntityRubricCategoryChanged(selectedEntity, rubricCategoryId);
						});
					}
					// TODO: For Billing Module
					else if (module.id === 4) {
						$injector.get('salesBillTypeLookupDataService').getItemByIdAsync(typeId).then(function (typeEntity) {
							// populate related values like rubric category
							let rubricCategoryId = typeEntity.RubricCategoryFk;
							selectedEntity.RubricCategoryFk = rubricCategoryId;
							onEntityRubricCategoryChanged(selectedEntity, rubricCategoryId);
						});
					}
				}

				function onEntityRubricCategoryChanged(selectedEntity, value) {
					let result = {
						'apply':true,
						'error': '',
						'valid':true,
					};
					let field = 'RubricCategoryFk';

					if (context.id === 3) {
						return $injector.get('platformRuntimeDataService').applyValidationResult(result,selectedEntity,field);
					}
				}
				let filters = [
					{
						key: 'sales-contract-configuration-filter',
						serverSide: true,
						fn: function (entity) {
							let rubricCat = entity.RubricCategoryFk > 0 ? ' AND RubricCategoryFk=' + entity.RubricCategoryFk : '';
							return `RubricFk=${$injector.get('salesCommonRubric').Contract}${rubricCat}`;
						}
					},
					{
						key: 'sales-bid-configuration-filter',
						serverSide: true,
						fn: function (entity) {
							var rubricCat = entity.RubricCategoryFk > 0 ? ' AND RubricCategoryFk=' + entity.RubricCategoryFk : '';
							return `RubricFk=${$injector.get('salesCommonRubric').Bid}${rubricCat}`;
						}
					},
					{
						key: 'sales-billing-configuration-filter',
						serverSide: true,
						fn: function (entity) {
							var rubricCat = entity.RubricCategoryFk > 0 ? ' AND RubricCategoryFk=' + entity.RubricCategoryFk : '';
							return `RubricFk=${$injector.get('salesCommonRubric').Billing}${rubricCat}`;
						}
					},
					{
						key: 'sales-wip-configuration-filter',
						serverSide: true,
						fn: function (entity) {
							var rubricCat = entity.RubricCategoryFk > 0 ? ' AND RubricCategoryFk=' + entity.RubricCategoryFk : '';
							return `RubricFk=${$injector.get('salesCommonRubric').Wip}${rubricCat}`;
						}
					},
					{
						key: 'sales-contract-main-contract-filter-by-server',
						serverKey: 'sales-contract-main-contract-filter-by-server',
						serverSide: true,
						fn: function () {
							let context = service.getContext();
							let mainService = context.mainService;
							let selectedHeader = $injector.get(mainService).getSelected();
							return {
								// if project already selected, show only contracts from project, otherwise all [server side check]
								ProjectId: selectedHeader.ProjectFk,
								// Todo: needed restriction for not to allow self reference
							};
						}
					},
					{
						key: 'sales-contract-project-change-common-filter',
						serverSide: true,
						serverKey: 'sales-contract-project-change-common-filter',
						fn: function (item) {
							if (item.ProjectFk) {
								return {ProjectFk: item.ProjectFk};
							}
						}
					},
					{
						key: 'sales-bid-project-change-common-filter',
						serverSide: true,
						serverKey: 'sales-bid-project-change-common-filter',
						fn: function (item) {
							if (item.ProjectFk) {
								return {ProjectFk: item.ProjectFk};
							}
						}
					},
					{
						key: 'sales-wip-rubric-category-by-rubric-filter',
						serverKey: 'rubric-category-by-rubric-company-lookup-filter',
						serverSide: true,
						fn: function () {
							let rubricId = $injector.get('salesCommonRubric').Wip;
							return { Rubric:rubricId };
						}
					},
				];

				$injector.get('basicsLookupdataLookupFilterService').registerFilter(filters);

				service.getFormConfig = function getFormConfig() {
					return {
						fid: 'Change Sales Type Or Configuration Wizard',
						version: '1.0.0',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['configurationfk', 'rubricCategoryFk', 'typeFk', 'ordHeaderFk','bidHeaderFk', 'changeEntityFk']
							}
						],
						rows: [
							{
								gid: 'baseGroup',
								rid: 'configurationfk',
								label: 'Configuration',
								label$tr$: 'sales.common.entityConfigurationFk',
								type: 'directive',
								model: 'ConfigurationFk',
								directive: 'basics-configuration-configuration-combobox',
								options: {
									filterKey: filterForConfiguration,
									showClearButton: true
								},
								sortOrder: 3,
							},
							{
								gid: 'baseGroup',
								rid: 'rubricCategoryFk',
								model: 'RubricCategoryFk',
								required: false,
								readonly: true,
								sortOrder: 2,
								label$tr$: 'project.main.entityRubric',
								label: 'Rubric Category',
								validator: onEntityRubricCategoryChanged,
								asyncValidator: asyncRubCatValidator,
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
									descriptionMember: 'Description',
									lookupOptions: {
										filterKey: filterForRubricCat,
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'RubricCategoryByRubricAndCompany',
									displayMember: 'Description'
								}
							},
							{
								gid: 'baseGroup',
								rid: 'ordHeaderFk',
								model: 'OrdHeaderFk',
								sortOrder: 4,
								label: 'Main Contract',
								required: false,
								label$tr$: 'sales.common.MainContract',
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'sales-common-contract-dialog-v2',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										filterKey: 'sales-contract-main-contract-filter-by-server',
										showClearButton: true
									}
								}
							},
							// Main Bid
							overloadBidHeaderFk(),
							{
								gid: 'baseGroup',
								rid: 'changeEntityFk',
								model: 'ChangeEntityFk',
								sortOrder: 6,
								label: 'Change Entity',
								label$tr$: 'sales.common.entityPrjChangeOrder',
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'project-change-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true,
										createOptions: {
											typeOptions: {
												isSales: true,
												isChangeOrder: true
											}
										},
										filterKey: filterForChangeEntity
									}
								}
							},
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
								'basics.customize.' + typeId,
								'Description',
								{
									gid: 'baseGroup',
									rid: 'typeFk',
									model: 'TypeFk',
									required: false,
									sortOrder: 1,
									label: 'Type',
									label$tr$: 'sales.contract.entityContractTypeFk',
									validator: onEntityTypeChanged
								},
								false, // caution: this parameter is ignored by the function
								{
									required: true,
									customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
									filterKey: typeFilter
								}
							),
						]
					};
				};

				function overloadBidHeaderFk() {
					var ret;
					ret = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'salesBidHeaderRefLookupDataService',
						filter: function (item) {
							let selectedItem = $injector.get(context.mainService).getSelected();
							if (item && item.ProjectChangeGenerateMode === 2) {
								return {
									Id: -1,
									ProjectFk: selectedItem.ProjectFk
								};
							} else if (selectedItem.BidId) {
								return selectedItem.BidId;// should set the bid code when using in "update bid"
							} else {
								return {
									Id: -1,
									ProjectFk: selectedItem.ProjectFk
								};
							}
						},
						showClearButton: true,
					},
						{
							gid: 'baseGroup',
							rid: 'bidheaderfk',
							model: 'BidHeaderFk',
							sortOrder: 5,
							label: 'Main Bid',
							label$tr$: 'sales.billing.entityBidHeaderFk'
						});

					ret.required = true;
					// adding bid status column
					ret.options.lookupOptions.columns.push({
						id: 'Status',
						field: 'BidStatusFk',
						name: 'Status',
						formatter: "lookup",
						name$tr$: 'entityBidStatusFk',
						formatterOptions: {
							displayMember: "Description",
							imageSelector: "platformStatusIconService",
							lookupModuleQualifier: "basics.customize.bidstatus",
							lookupSimpleLookup: true,
							valueMember: "Id"
						}
					});
					return ret;
				}

				return service;
			}]);

	/**
	 * @ngdoc service
	 * @name salesCommonChangeSalesTypeOrConfigurationWizardService
	 * @function
	 * @description wizard service for "Change Sales Type Or Configuration"
	 */
	angular.module(moduleName).factory('salesCommonChangeSalesTypeOrConfigurationWizardService',
		['_', '$log', '$q', '$http', '$rootScope', '$injector', '$translate', 'globals', 'platformDialogService',
			function (_, $log, $q, $http, $rootScope, $injector, $translate, globals, platformDialogService) {
				function getContext() {
					let subModule2Context = {
						'sales.bid': {id: 1,mainService: 'salesBidService', url: 'sales/bid/changesalestypeorconfiguration', salesHeaderPropName: 'BidId'},
						'sales.contract': {id: 2,mainService: 'salesContractService', url: 'sales/contract/changesalestypeorconfiguration', salesHeaderPropName: 'ContractId'},
						'sales.billing': {id: 4,mainService: 'salesBillingService', url: 'sales/billing/changesalestypeorconfiguration', salesHeaderPropName: 'BillId'},
						'sales.wip': {id: 3,mainService: 'salesWipService', url: 'sales/wip/changesalestypeorconfiguration', salesHeaderPropName: 'WipId'},
					};
					if (!_.includes(_.keys(subModule2Context), $rootScope.currentModule)) {
						$log.warn('No context available for given sub module!');
						return;
					}
					let context = subModule2Context[$rootScope.currentModule];
					let selectedEntity = $injector.get(context.mainService).getSelected();

					if (context.id === 1) {
						wizardTitle = 'Change Bid Type/Configuration';
						wizardTitle$tr$ = 'sales.bid.entityChangeSalesBidConfig';
					} else if (context.id === 2) {
						wizardTitle = 'Change Sales Contract Type/Configuration';
						wizardTitle$tr$ = 'sales.contract.entityChangeSalesContractConfig';
					} else if (context.id === 3) {
						wizardTitle = 'Change WIP Type/Configuration';
						wizardTitle$tr$ = 'sales.wip.entityChangeSalesWipConfig';
					} else if (context.id === 4) {
						wizardTitle = 'Change Bill Type/Configuration';
						wizardTitle$tr$ = 'sales.billing.entityChangeSalesBillingConfig';
					}
					if (_.isNil(selectedEntity)) {
						$log.warn('No sales header selected.');
						return context;
					}
					context.salesHeaderId = selectedEntity.Id;
					return context;
				}

				let service = {};
				let wizardTitle$tr$ = null;
				let wizardTitle = null;
				service.showChangeSalesTypeOrConfigurationWizard = function showChangeSalesTypeOrConfigurationWizard() {
					let context = getContext();
					let modalOptions = {
						headerText: wizardTitle,
						headerText$tr$: wizardTitle$tr$,
						showOkButton: true,
						showCancelButton: true,
						bodyTemplateUrl: globals.appBaseUrl + 'sales.common/partials/sales-common-change-sales-type-or-configuration-wizard-dialog.html',
						backdrop: false,
						width: '700px',
						height: 'auto',
						resizeable: true,
						value:{}
					};
					platformDialogService.showDialog(modalOptions).then(function (result) {
						let mainService = context.mainService;
						let item = $injector.get(mainService).getSelected();
						let postData = {
							'TypeFk': result.value.TypeFk,
							'RubricCategoryFk': result.value.RubricCategoryFk,
							'ConfigurationFk': result.value.ConfigurationFk,
							'ChangeEntityFk':result.value.ChangeEntityFk,
							'OrdHeaderFk':result.value.ChangeEntityFk,
							'BidHeaderFk':result.value.BidHeaderFk
						};
						// add custom sales header id property, e.g. 'BidHeaderFk' or 'OrdHeaderFk' or 'BillHeader' or 'WipHeader'
						if (_.get(context, 'salesHeaderPropName')) {
							postData[context.salesHeaderPropName] = context.salesHeaderId;
						} else {
							$log.warn('No salesHeaderPropName defined.');
							return;
						}
						if (result.ok) {
							$http.post(globals.webApiBaseUrl + context.url, postData).then(function (resp) {
								let title = wizardTitle$tr$;
								let message = resp.data.Message;
								let mainItemId = null;
								let changeId = null;

								if(context.id === 1) {
									mainItemId = 'value.BidHeaderFk';
									changeId =  'value.ChangeEntityFk';
								}
								if(context.id === 2) {
									mainItemId = 'value.OrdHeaderFk';
									changeId =  'value.ChangeEntityFk';
								}
								if(context.id === 3 || context.id === 4) {
									mainItemId = null;
									changeId = null;
								}
								if (resp.data.IsSuccess) {
									if (_.has(result, 'value.TypeFk') || _.has(result, 'value.RubricCategoryFk') || _.has(result, 'value.ConfigurationFk') || _.has(result, mainItemId) || _.has(result, changeId)) {
										$injector.get(mainService).changeSalesConfigOrType(_.get(result, 'value.TypeFk'),_.get(result, 'value.RubricCategoryFk'),_.get(result, 'value.ConfigurationFk'),_.get(result, mainItemId),_.get(result, changeId), item);
									}
									platformDialogService.showMsgBox($translate.instant(message), title, 'info');
								} else {
									platformDialogService.showErrorBox($translate.instant(message), title);
								}
							});
						}
					});
				};
				return service;
			}]);

})(angular);
