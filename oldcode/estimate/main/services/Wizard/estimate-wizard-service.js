/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc factory
	 * @name estimateMainSidebarWizardService
	 * @description
	 * estimateMainSidebarWizardService provides update options for line item
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	estimateMainModule.factory('estimateMainSidebarWizardService',

		['$q', '$http', '$injector', '$timeout', 'PlatformMessenger', 'platformSidebarWizardConfigService', 'platformModalService', 'estimateMainService', '$translate',
			'platformTranslateService', 'platformSidebarWizardCommonTasksService', 'estimateMainResourceService',
			'platformModalFormConfigService', 'cloudCommonGridService', 'estimateMainResourceImageProcessor', 'estimateMainResourceProcessor',
			'estimateWizardGenerateSourceLookupService', 'basicsLookupdataLookupDescriptorService', 'estimateMainCalculatorService',
			'estimateMainSearchLineItemWizardService', 'estimateParameterFormatterService', 'estimateMainCreateMaterialPackageService', 'estimateMainUpdateMaterialPackageService',
			'estimateMainGenerateScheduleService', 'estimateMainLineItem2MdlObjectService', 'estimateMainUpdateCompositeAssemblyService', 'estimateMainScopeSelectionService',
			'estimateMainUpdatePackageBoqWizardService', 'platformWizardDialogService','platformRuntimeDataService', 'estimateMainImportOptionsService', 'estimateMainExportOptionsService', 'basicsImportService', 'basicsExportService', 'platformContainerUiAddOnService', 'cloudCommonFeedbackType',

			function ($q, $http,$injector, $timeout, PlatformMessenger, platformSidebarWizardConfigService, platformModalService, estimateMainService, $translate,
				platformTranslateService, platformSidebarWizardCommonTasksService, estimateMainResourceService,
				platformModalFormConfigService, cloudCommonGridService, estimateMainResourceImageProcessor,
				estimateMainResourceProcessor, estimateWizardGenerateSourceLookupService, basicsLookupdataLookupDescriptorService, estimateMainCalculatorService,
				searchLineItemWizardService, estimateParameterFormatterService,
				estimateMainCreateMaterialPackageService, estimateMainUpdateMaterialPackageService, estimateMainGenerateScheduleService, estimateMainLineItem2MdlObjectService, estimateMainUpdateCompositeAssemblyService,
				estimateMainScopeSelectionService,
				estimateMainUpdatePackageBoqWizardService, platformWizardDialogService,platformRuntimeDataService, estimateMainImportOptionsService, estimateMainExportOptionsService, basicsImportService, basicsExportService, platformContainerUiAddOnService, cloudCommonFeedbackType) {

				let lookupType = 'EstimateGenerate4LeadingSource',
					lookupkey = 1;
				let service = {
					setOkdisabale: setOkdisabale,
					onCalculationDone: new PlatformMessenger()
				};

				let localData = {};

				service.toggleSideBarWizard = function toggleSideBarWizard() {
					let wizService = $injector.get('basicsConfigWizardSidebarService');
					wizService.disableWizards(estimateMainService.isReadonly());
				};

				service.updateItemsFromProject = function updateItemsFromProject() {
					let estimateMainUpdateItemsService = $injector.get('estimateMainUpdateItemsService');
					estimateMainUpdateItemsService.showDialog();
				};

				service.updateCompositeAssemblyFromMasterData = function updateCompositeAssemblyFromMasterData() {
					estimateMainUpdateCompositeAssemblyService.showDialog();
				};

				service.removeEstimateRuleAssignments = function removeEstimateRuleAssignments() {
					let estimateMainRuleRemoveService = $injector.get('estimateMainRuleRemoveService');
					estimateMainRuleRemoveService.showDialog();
				};

				service.updateRulesDefinitionMaster = function updateRulesDefinitionMaster() {
					let estimateMainUpdateRulesDefinitionMasterService = $injector.get('estimateMainUpdateRulesDefinitionMasterService');
					estimateMainUpdateRulesDefinitionMasterService.showDialog();
				};

				service.GenerateBudgetsFromBM = function GenerateBudgetsFromBM() {
					let estGenerateBudgetSer = $injector.get('estimateMainGenerateBudgetCXBMDialogService');
					estGenerateBudgetSer.validateUserPermission().then(function (data) {
						if (data && data.length > 0) {
							estimateMainService.updateAndExecute(function () {
								estGenerateBudgetSer.showDialog(data);
							});
						} else {
							let title = $translate.instant('estimate.main.generateBudgetCXBMWizard.title'),
								msg = $translate.instant('estimate.main.generateBudgetCXBMWizard.externalConfig');
							platformModalService.showMsgBox(msg, title, 'warning');
						}
					});
				};

				service.uploadEstimateToBenchmark = function uploadEstimateToBenchmark() {
					let uploadEstToBMService = $injector.get('estimateMainUploadBenchmarkDialogService');
					uploadEstToBMService.validateUserPermission().then(function (data) {
						if (data && data.length > 0) {
							estimateMainService.updateAndExecute(function () {
								uploadEstToBMService.showDialog(data);
							});
						} else {
							let title = $translate.instant('estimate.main.generateBudgetCXBMWizard.title'),
								msg = $translate.instant('estimate.main.generateBudgetCXBMWizard.externalConfig');
							platformModalService.showMsgBox(msg, title, 'warning');
						}
					});
				};


				let IsDisable = false;

				function setOkdisabale(Okdisable) {
					IsDisable = Okdisable;
				}

				service.generateItemFromLeadingStructure = function generateItemFromLeadingStructure() {
					if (!basicsLookupdataLookupDescriptorService.getLookupItem(lookupType, lookupkey)) {
						service.refreshGenerateLineItemsByLS().then(function (){
							$injector.get('estimateMainGenerateEstimateFromLeadingStructureDialogService').showDialog();
						});
					}
				};

				service.refreshGenerateLineItemsByLS = function refreshGenerateLineItemsByLS() {
					// Initialize Data of getsourceleadingstructures where the cachedata has not
					let postData = {
						'EstHeaderFk': estimateMainService.getSelectedEstHeaderId(),
						'ProjectFk': estimateMainService.getProjectId()
					};
					return $http.post(globals.webApiBaseUrl + 'estimate/main/lookup/getsourceleadingstructures', postData)
						.then(function (response) {
							response.data = estimateWizardGenerateSourceLookupService.setList(response.data);
							return response.data;
						});
				};

				service.createBidFromEstimate = function createBidFromEstimate() {
					let estimateMainBidCreationService = $injector.get('estimateMainBidCreationService');
					estimateMainBidCreationService.showBidCreationWizardDialog();
				};

				/* jshint -W003 */
				let showDialog = function showDialog() {
					let modalOptions = {
						headerTextKey: 'estimate.main.infoCalculateDialogHeader',
						bodyTextKey: 'estimate.main.infoCalculateDialogBody',
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);
				};

				service.calculateRuleNParam = function calculateRuleNParam() {
					let seletcedHeaderId = estimateMainService.getSelectedEstHeaderId();
					if (seletcedHeaderId <= 0) {
						showDialog();
					} else {
						estimateMainCalculatorService.calculate(seletcedHeaderId, estimateMainService.getSelectedProjectId());
					}
				};

				service.searchLineItems = function searchLineItems() {
					estimateMainService.updateAndExecute(searchLineItemWizardService.showLineItemPortalDialog);
				};

				service.searchAssemblies = function searchAssemblies() {
					let assemblyWizardService = $injector.get('estimateMainSearchAssembliesWizardService');
					estimateMainService.updateAndExecute(assemblyWizardService.showAssembliesPortalDialog);
				};

				service.quantityMaintenance = function quantityMaintenance() {
					let qtydialogServ = $injector.get('estimateMainQuantityMaintenanceDialogService');
					qtydialogServ.showDialog();
				};

				service.updateActiviesQuantity = function updateActiviesQuantity() {
					let lineItemTransferMessage = $translate.instant('estimate.main.updateQuantitiesInSchedulingWizard.actQtyRelationNotSetToStructure');
					// let lineItemTransferMessage = 'Act Qty Relation not set to \'To Structure\':<br>';
					let lineItems = _.map(estimateMainService.getListOfLineItemsWhichTransferDataToActivity(), 'Id');
					let lineItemHeader = estimateMainService.getSelectedEstHeaderId();
					let lineItemsNotToStructure = estimateMainService.getListOfLineItemsWhichTransferDataNotToActivity();
					if (lineItemsNotToStructure.length > 0) {
						_.forEach(lineItemsNotToStructure, function (li) {
							lineItemTransferMessage = lineItemTransferMessage + li.Code + '\t' + li.DescriptionInfo.Translated + '<br>';
						});
					} else {
						lineItemTransferMessage = '';
					}
					lineItemTransferMessage = lineItemTransferMessage + $translate.instant('estimate.main.updateQuantitiesInSchedulingWizard.noQuantityTransferredFor');

					let updateScheduleConfig = {
						title: $translate.instant('estimate.main.updateQuantitiesInSchedulingWizard.updateQuantitiesInScheduling'),
						dataItem: {
							updateQuantities: true,
							updateHours: false,
							updateSummaryActivities: false
						},
						formConfiguration: {
							fid: 'estimate.main.updateQuantity',
							version: '0.1.1',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									attributes: ['selecteditem']
								}
							],
							'overloads': {},
							rows: [
								{
									rid: 'updateQty',
									gid: 'baseGroup',
									label: 'Update quantities',
									label$tr$: 'estimate.main.updateQuantitiesInSchedulingWizard.updateQuantity',
									type: 'boolean',
									model: 'updateQuantities',
									sortOrder: 1
								},
								{
									rid: 'updateHours',
									gid: 'baseGroup',
									label: 'UpdateHours',
									label$tr$: 'estimate.main.updateQuantitiesInSchedulingWizard.updateHours',
									type: 'boolean',
									model: 'updateHours',
									sortOrder: 2
								},
								{
									rid: 'updateSummaryActivities',
									gid: 'baseGroup',
									label: 'updateSummaryActivities',
									label$tr$: 'estimate.main.updateQuantitiesInSchedulingWizard.updateSummaryActivities',
									type: 'boolean',
									model: 'updateSummaryActivities',
									sortOrder: 2
								}
							]
						},
						handleOK: function handleOK(result) {
							if (result && result.ok && result.data) {
								let action = {
									Action: 16,
									LineItemIds: lineItems,
									LineItemHeader: lineItemHeader,
									UpdateActivityQuantity: result.data.updateQuantities,
									UpdateActivityDuration: result.data.updateHours,
									UpdateSummaryActivities: result.data.updateSummaryActivities
								};

								$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', action)
									.then(function (response) {
										lineItemTransferMessage = '';
										if (response.data.LineItemsWhichNotTransferredQuantity.length > 0) {
											lineItemTransferMessage = lineItemTransferMessage + $translate.instant('estimate.main.updateQuantitiesInSchedulingWizard.noQuantityTransferredForWrongUoM');
											_.forEach(response.data.LineItemsWhichNotTransferredQuantity, function (li) {
												lineItemTransferMessage = lineItemTransferMessage + li.Code + '\t' + li.DescriptionInfo.Translated + '<br>';
											});
										}
										if (response.data.ValidationError.length > 0) {
											lineItemTransferMessage += response.data.ValidationError + '<br>';
										}
										if (!lineItemTransferMessage) {
											lineItemTransferMessage = $translate.instant('cloud.common.doneSuccessfully');
										}
										platformModalService.showMsgBox(lineItemTransferMessage, $translate.instant('estimate.main.updateQuantitiesInSchedulingWizard.transferOfLineItemQuantityToActivitySuccessful'), 'info');
										//  platformModalService.showMsgBox(lineItemTransferMessage, 'Transfer of Line Item Quantity to Activity successful', 'info');
									}, function () {
									});
							}
						}
					};
					platformTranslateService.translateFormConfig(updateScheduleConfig.formConfiguration);
					updateScheduleConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
					platformModalFormConfigService.showDialog(updateScheduleConfig);
				};


				service.createMaterialPackage = function createMaterialPackage() {

					let projectId = estimateMainService.getSelectedProjectId();
					if (!projectId) {
						platformModalService.showMsgBox($translate.instant('estimate.main.createMaterialPackageWizard.noProjectItemSelected'), '', 'ico-info'); // jshint ignore:line
						return;
					}
					estimateMainCreateMaterialPackageService.showCreateMaterialPackageWizardDialog();
				};

				service.updateMaterialPackage = function updateMaterialPackage() {
					let projectId = estimateMainService.getSelectedProjectId();
					if (!projectId) {
						platformModalService.showMsgBox($translate.instant('estimate.main.createMaterialPackageWizard.noProjectItemSelected'), '', 'ico-info'); // jshint ignore:line
						return;
					}
					estimateMainUpdateMaterialPackageService.showUpdateMaterialPackageWizardDialog();
				};

				service.generateSchedule = function generateSchedule() {
					estimateMainGenerateScheduleService.startWizard();
				};

				let estimateWizardID = 'estimateMainSidebarWizards';

				let estimateWizardConfig = {
					showImages: true,
					showTitles: true,
					showSelected: true,
					cssClass: 'sidebarWizard',
					items: [
						{
							id: 1,
							text: 'estimateWizardTitle',
							text$tr$: 'estimate.main.estimateWizardTitle',
							groupIconClass:
								'sidebar-icons ico-wiz-change-status',
							visible: true,
							subitems: [
								{
									id: 11,
									groupId: 1,
									text: 'calculate',
									text$tr$: 'estimate.main.calculate',
									type: 'item',
									showItem: false,// estimateMainService.getNumberOfLineItems() > 0
									cssClass: 'rw md',
									fn: service.calculateRuleNParam
								},
								{
									id: 12,
									text: 'updateItemsFromProject',
									text$tr$: 'estimate.main.updateItemsFromProject',
									type: 'item',
									showItem: true,
									cssClass: 'rw md',
									fn: service.updateItemsFromProject
								},
								{
									id: 13,
									text: 'generateItemFromLeadingStructure',
									text$tr$: 'estimate.main.generateItemFromLeadingStructure',
									type: 'item',
									showItem: true,
									cssClass: 'rw md',
									fn: service.generateItemFromLeadingStructure
								},
								{
									id: 14,
									text: 'Installed Quantity Update',
									text$tr$: 'estimate.main.updateLineItemQuantity',
									type: 'item',
									showItem: true,
									cssClass: 'rw md',
									fn: service.updateLineItemQuantity
								}
							]
						},
						{
							id: 2,
							text: 'Create Wizard',
							text$tr$: 'sales.bid.wizardCreateWizard',
							groupIconClass: 'sidebar-icons ico-wiz-create-contracts',
							isOpen: true,
							subitems: [
								{
									id: 21,
									text: 'Create / Update Bid',
									text$tr$: 'sales.bid.wizard.generateBid',
									type: 'item',
									showItem: true,
									cssClass: 'rw md',
									fn: service.createBidFromEstimate
								}
							]
						},
						{
							id: 3,
							text: 'Scheduling',
							text$tr$: 'Scheduling',
							isOpen: true,
							subitems: [
								{
									id: 31,
									text: 'Update Quantities in Scheduling',
									text$tr$: 'estimate.main.updateQuantitiesInSchedulingWizard.updateQuantitiesInScheduling',
									type: 'item',
									showItem: true,
									cssClass: 'rw md',
									fn: service.updateActiviesQuantity
								}
							]
						}
					]
				};

				service.updateLineItemQuantity = function updateLineItemQuantity() {
					let title = 'estimate.main.wizardDialog.updateLineItemQuantityWizardTitle',
						msg = $translate.instant('estimate.main.noCurrentLineItemSelection');

					function updateQuantity(data) {

						// Show loading indicator
						let estMainStandardDynamicService = $injector.get('estimateMainDynamicConfigurationService');
						estMainStandardDynamicService.showLoadingOverlay();

						if (data && data.ProjectId > 0 && data.EstHeaderFk > 0) {
							$http.post(globals.webApiBaseUrl + 'estimate/main/lineitemquantity/updatequantity', data).then(function (responce) {
								let resp = responce.data;
								if (!resp.success) {
									let modalOptions = {
										headerText: $translate.instant(title),
										bodyText: resp.message,
										showOkButton: true,
										iconClass: 'ico-warning'
									};
									estMainStandardDynamicService.hideLoadingOverlay();
									platformModalService.showDialog(modalOptions);
								} else{
									estimateMainService.load().then(function () {
										estimateMainService.setSelected({}).then(function () {
											estimateMainService.setSelected(data.SelectedLineItem);
											estMainStandardDynamicService.hideLoadingOverlay();
											platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('estimate.main.wizardDialog.updateLineItemQuantityWizardTitle');
										});
									});
								}

							});
						}
					}
					let lineItemQtyUpdateConfig = {
						title: $translate.instant(title),
						resizeable: true,
						dataItem: {
							estimateScope: 'EntireEstimate',
							updatePlannedQuantity: true,
							updatePlannedQuantityConsiderScurve: false,
							updateBillingQuantity: true,
							hintText:'',
							isCompletePerformance: true,
							isUpdateFQ: true,
							isSchedule:true,
							isWip:false,
							isPes:false
						},
						formConfiguration: {
							fid: 'estimate.main.wizardDialog.updateLineItemQuantityWizardTitle',
							version: '0.1.1',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									attributes: ['selectedItem']
								}
							],
							'overloads': {},
							rows: [
								{
									gid: 'baseGroup',
									rid: 'SelectedItem',
									label: 'Select Estimate Scope',
									label$tr$: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.label',
									type: 'radio',
									model: 'estimateScope',
									options: {
										labelMember: 'Description',
										valueMember: 'Value',
										groupName: 'lineItemQtyUpdateConfig',
										items: [
											{
												Id: 1,
												Description: $translate.instant('estimate.main.splitLineItemWizard.entireEstimate'),
												Value: 'EntireEstimate'
											},
											{
												Id: 2,
												Description: $translate.instant('estimate.main.slectedLineItems'),
												Value: 'SelectedLineItems'
											}
										]
									}
								},
								{
									gid: 'baseGroup',
									rid: 'updatePlannedQuantityConsiderScurve',
									label: 'Consider SCurve',
									label$tr$: 'estimate.main.considerscurve',
									name: 'Structure Name',
									type: 'boolean',
									model: 'updatePlannedQuantityConsiderScurve'
								},
								{
									gid: 'baseGroup',
									rid: 'updatePlannedQuantity',
									label: 'Update Planned Quantity',
									label$tr$: 'estimate.main.wizardDialog.updatePlannedQuantity',
									type: 'directive',
									directive:'estimate-wizard-update-planned-quantity-checkbox'
								},
								{
									gid: 'baseGroup',
									rid: 'updateLineItemQuantity',
									label: 'Update LineItem Quantity',
									label$tr$: 'estimate.main.updateLineItemQuantity',
									model: 'updateLineItemQuantity',
									type: 'directive',
									directive: 'estimate-wizard-update-lineitem-quantity-checkbox'
								},
								{
									gid: 'baseGroup',
									rid: 'isUpdateFQ',
									label: 'Update Forecasting Planned Quantity',
									label$tr$: 'estimate.main.IsUpdateFQ',
									type: 'boolean',
									model: 'isUpdateFQ'
								},
								{
									gid: 'baseGroup',
									rid: 'updateBillingQuantity',
									label: 'Update Billing Quantity',
									label$tr$: 'estimate.main.wizardDialog.updateBillingQuantity',
									type: 'directive',
									directive:'estimate-wizard-update-billing-quantity-checkbox'
								},
								{
									rid: 'hintText',
									gid: 'baseGroup',
									label: 'Setting Project: ',
									label$tr$: 'estimate.main.hintText',
									type: 'text',
									model: 'hintText',
									readonly: true
								}
							]
						},
						handleOK: function handleOK(result) {
							if (result && result.ok && result.data) {
								let selectedLineItem = estimateMainService.getSelected();
								let postData = {
									'EstHeaderFk': estimateMainService.getSelectedEstHeaderId(),
									'ProjectId': estimateMainService.getSelectedProjectId(),
									'SelectedLineItem': selectedLineItem,
									'IsSchedule': result.data.isSchedule,
									'IsPes': result.data.isPes,
									'IsWip': result.data.isWip,
									'PlannedQuantityFrmSchedule': result.data.updatePlannedQuantity,
									'ConsiderScurve': result.data.updatePlannedQuantityConsiderScurve,
									'BillingQuantityFrmBill': result.data.updateBillingQuantity,
									'IsCompletePerformance': result.data.isCompletePerformance,
									'IsUpdateFQ': result.data.isUpdateFQ
								};
								postData.ProjectId = postData.ProjectId ? postData.ProjectId : selectedLineItem ? selectedLineItem.ProjectFk : 0;
								postData.LineItems = _.compact(postData.LineItems);

								if (result.data.estimateScope === 'SelectedLineItems') {
									if (platformSidebarWizardCommonTasksService.assertSelection(selectedLineItem, title, msg)) {
										let selectedLineItems = estimateMainService.getSelectedEntities();
										postData.EstLineItemIds = selectedLineItems && selectedLineItems.length ? _.map(selectedLineItems, 'Id') : null;
										updateQuantity(postData);
									}
								} else {
									updateQuantity(postData);
								}
							}
						}
					};

					function getProject(id) {
						const url = globals.webApiBaseUrl + 'project/main/byid?id=' + id;
						return $http(
							{
								method: 'GET',
								url: url
							}
						).then(function (response) {

							return response.data;
						});
					}
					let selectedLineItem = estimateMainService.getSelected();
					let selectedPrjId = estimateMainService.getProjectId() || (selectedLineItem ? selectedLineItem.ProjectFk : 0);

					getProject(selectedPrjId).then(function(projectItem){
						lineItemQtyUpdateConfig.dataItem.isCompletePerformance = projectItem && projectItem.IsCompletePerformance;
						lineItemQtyUpdateConfig.dataItem.hintText = projectItem && projectItem.IsCompletePerformance ? $translate.instant('estimate.main.wizardDialog.completePerformanceActiveText') : $translate.instant('estimate.main.wizardDialog.completePerformanceInActiveText');
						platformTranslateService.translateFormConfig(lineItemQtyUpdateConfig.formConfiguration);
						lineItemQtyUpdateConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
						platformModalFormConfigService.showDialog(lineItemQtyUpdateConfig);
					});
				};

				service.activate = function activate() {
					platformSidebarWizardConfigService.activateConfig(estimateWizardID, estimateWizardConfig);
				};

				service.deactivate = function deactivate() {
					platformSidebarWizardConfigService.deactivateConfig(estimateWizardID);
				};

				// loads or updates translated strings
				let loadTranslations = function () {
					platformTranslateService.translateObject(estimateWizardConfig, ['text']);
				};

				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule('cloud.desktop')) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}

				service.replaceResource = function replaceResource() {
					let estimateMainReplaceResourceService = $injector.get('estimateMainReplaceResourceService');
					estimateMainReplaceResourceService.showReplaceResourceWizardDialog();
				};

				service.modifyResource = function modifyResource() {
					let estimateMainReplaceResourceService = $injector.get('estimateMainReplaceResourceService');
					estimateMainReplaceResourceService.showModifyResourceWizardDialog();
				};

				service.splitBudget = function splitBudget() {
					let title = 'estimate.main.splitBudget';
					let splitBudgetConfig = {
						title: $translate.instant(title),
						dataItem: {
							estimateScope: 0,
						},
						formConfiguration: {
							fid: 'estimate.main.splitBudget',
							version: '0.1.1',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									attributes: ['selecteditem']
								}
							],
							'overloads': {},
							rows: []
						},
						handleOK: function handleOK(result) {
							if (!result || !result.ok || !result.data) {
								return;
							}

							function splitItemBudget() {
								$http.post(globals.webApiBaseUrl + 'estimate/main/calculator/splitbudget', data)
									.then(function (response) {
										let lineItems = response && response.data ? response.data.EstLineItems : null;
										if (!lineItems) {
											return;
										}
										estimateMainService.addList(lineItems);
										estimateMainService.fireListLoaded();
										estimateMainService.setSelected({}).then(function () {
											let list = estimateMainService.getList();
											let selected = _.find(list, {Id: data.SelectedItemId});
											estimateMainService.setSelected(selected);
										});
										// estimateMainResourceService.load();
									},
									function (/* error */) {
									});
							}

							if ((result.data.estimateScope === 1 || result.data.estimateScope === 2) && estimateMainService.getIfSelectedIdElse() <= 0) {
								return;
							}
							let data = {
								'EstHeaderId': estimateMainService.getSelectedEstHeaderId(),
								'ProjectId': estimateMainService.getSelectedProjectId(),
								'SelectedItemId': estimateMainService.getIfSelectedIdElse(null)
							};

							if (result.data.estimateScope === 2) {
								data.EstLineItems = estimateMainService.getSelectedEntities();
							} else if (result.data.estimateScope === 1) {
								data.EstLineItems = estimateMainService.getList();
							}
							estimateMainService.updateAndExecute(splitItemBudget);
						}
					};

					let selectlineItemscopeRow = estimateMainScopeSelectionService.getHighlightScopeFormRow();
					if (selectlineItemscopeRow) {
						selectlineItemscopeRow.gid = 'baseGroup';
						selectlineItemscopeRow.sortOrder = 1;
					}
					splitBudgetConfig.formConfiguration.rows.push(selectlineItemscopeRow);

					let resultSetScopeRow = estimateMainScopeSelectionService.getResultSetScopeFormRow();
					if (resultSetScopeRow) {
						resultSetScopeRow.gid = 'baseGroup';
						resultSetScopeRow.sortOrder = 1;
					}
					splitBudgetConfig.formConfiguration.rows.push(resultSetScopeRow);

					let allEstimateScopeRow = estimateMainScopeSelectionService.getAllEstimateScopeFormRow();

					if (allEstimateScopeRow) {
						allEstimateScopeRow.gid = 'baseGroup';
						allEstimateScopeRow.sortOrder = 1;
					}
					splitBudgetConfig.formConfiguration.rows.push(allEstimateScopeRow);

					platformTranslateService.translateFormConfig(splitBudgetConfig.formConfiguration);
					splitBudgetConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
					platformModalFormConfigService.showDialog(splitBudgetConfig);
				};

				service.generateEstimateFromBoq = function generateEstimateFromBoq() {
					let estimateMainGenerateEstimateFromBoqWizardService = $injector.get('estimateMainGenerateEstimateFromBoqWizardService');
					estimateMainGenerateEstimateFromBoqWizardService.showDialog();
				};

				let feedback;
				let canHide;
				service.generateBudget = function generateBudget() {
					let param = {
						EstHeaderFk:estimateMainService.getSelectedEstHeaderId ()
					};
					$http.post(globals.webApiBaseUrl + 'estimate/main/estimateallowance/getEstimateAllowances',param).then(function (response) {

						let isAtciveStandardAllowance = false;
						if(response && response.data){
							let list = _.filter(response.data,{'IsActive':true});
							isAtciveStandardAllowance = list && list.length;
						}

						let estScope = angular.isDefined(localData.estScope) && (localData.estScope !== null)  ? localData.estScope : 2;
						let estFactor = angular.isDefined(localData.estFactor) && (localData.estFactor !== null)  ? localData.estFactor : 1;
						let estbudgetFrm = angular.isDefined(localData.estbudgetFrm) && (localData.estbudgetFrm !== null) ? localData.estbudgetFrm : 1;
						let skipFixedBudgetItems = angular.isDefined(localData.skipFixedBudgetItems) && (localData.skipFixedBudgetItems !== null) ? localData.skipFixedBudgetItems : false;

						platformModalService.showDialog ({
							templateUrl: globals.appBaseUrl + 'estimate.main/templates/generate-budget/estimate-main-generate-budget.html',
							backdrop: false,
							windowClass: 'form-modal-dialog',
							width: 800,
							title: $translate.instant('estimate.main.generateBudget'),
							resizeable: true,
							dataItem: {
								estimateScope: estScope,
								factor: estFactor,
								budgetFrm: estbudgetFrm,
								isAtciveStandardAllowance:isAtciveStandardAllowance,
								skipFixedBudgetItems: skipFixedBudgetItems
							}

						}).then (function (result) {
							if (!result || !result.ok || !result.data) {
								return;
							}
							var $scope = platformSidebarWizardConfigService.getCurrentScope();
							if ($scope != null && $scope.getUiAddOns()) {
								let uiMgr = $scope.getUiAddOns();
								feedback = uiMgr.getFeedbackComponent();
								feedback.setOptions({ type: cloudCommonFeedbackType.long, info: $translate.instant('estimate.main.generateBudgetInfoMessage'), title: $translate.instant('estimate.main.generateBudgetInProgress') })
								feedback.show();
								canHide = true;
							}

							localData.estScope = result.data.estimateScope;
							localData.estFactor = result.data.factor;
							localData.estbudgetFrm = result.data.budgetFrm;
							localData.skipFixedBudgetItems = result.data.skipFixedBudgetItems;

							let wihtAllowances = _.filter (result.data.StandardAllowanceOption, {'checked': true});
							let allowanceTypes = _.map (wihtAllowances, 'value');

							if (result.data.estimateScope === 2 && estimateMainService.getIfSelectedIdElse () <= 0) {
								platformSidebarWizardCommonTasksService.showErrorNoSelection ('estimate.main.generateBudget', 'estimate.main.updateMaterialPackageWizard.selectLineItemTip');
							}
							let lineItemIds = result.data.estimateScope === 1 ? _.map (estimateMainService.getList (), 'Id') : _.map (estimateMainService.getSelectedEntities (), 'Id');
							if (result.data.estimateScope === 1 && lineItemIds.count <= 0) {
								platformSidebarWizardCommonTasksService.showErrorNoSelection ('estimate.main.generateBudget', 'estimate.main.estConfigDialogLoadEstimate');
							}

							let postData = {
								'EstHeaderFk': estimateMainService.getSelectedEstHeaderId (),
								'ProjectId': estimateMainService.getSelectedProjectId (),
								'Factor': result.data.factor,
								'EstScope': result.data.estimateScope,
								'SelectedItemId': estimateMainService.getIfSelectedIdElse (-1),
								'LineItemIds': lineItemIds,
								'IsBudgetFrm': result.data.budgetFrm,
								'GC': allowanceTypes.indexOf ('GC') > -1,
								'AM': allowanceTypes.indexOf ('AM') > -1,
								'GA': allowanceTypes.indexOf ('GA') > -1,
								'RP': allowanceTypes.indexOf ('RP') > -1,
								'SkipFixedBudgetItems': result.data.skipFixedBudgetItems
							};

							function generateBudgetFun() {
								let title = 'estimate.main.generateBudget';
								$http.post (globals.webApiBaseUrl + 'estimate/main/lineitem/generatebudget', postData)
									.then (function (response) {
										estimateMainService.addList (response.data);
										estimateMainService.fireListLoaded ();
										estimateMainService.setSelected ({}).then (function () {
											let list = estimateMainService.getList ();
											let selected = _.find (list, {Id: postData.SelectedItemId});
											estimateMainService.setSelected (selected);
											if(canHide)
											{
												feedback.hide();
											}
											platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage (title);
										});
									});
							}

							estimateMainService.updateAndExecute (generateBudgetFun);
						}
						);
					});
				};

				service.updateControllingBudget = function updateControllingBudget() {
					let data = {
						'EstHeaderId': estimateMainService.getSelectedEstHeaderId(),
						'ProjectId': estimateMainService.getSelectedProjectId()
					};

					function updateCntrBdgt() {
						$http.post(globals.webApiBaseUrl + 'estimate/main/calculator/updatecontrollingbudget', data)
							.then(function () {
								platformModalService.showMsgBox('estimate.main.updateControllingBudgetText', 'estimate.main.updateControllingBudgetHeader', 'info');
							},
							function (/* error */) {
							});
					}

					updateCntrBdgt();
				};

				service.exportBc3 = function exportBc3() {
					let link = angular.element(document.querySelectorAll('#downloadLink'));
					let data = {
						'EstHeaderId': estimateMainService.getSelectedEstHeaderId(),
						'ProjectId': estimateMainService.getSelectedProjectId()
					};

					function exportBc3Data() {
						$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/exportbc3', data)
							.then(function (response) {
								platformModalService.showMsgBox('The Bc3 File exported successfully', 'Export Bc3 File', 'info');
								let fileName = response.headers('Content-Disposition').slice(21);
								link[0].href = response.data;
								link[0].download = fileName;
								link[0].type = 'application/octet-stream';
								link[0].click();
							},
							function (/* error */) {
							});
					}

					exportBc3Data();
				};

				service.generatePrjBoqFromLI = function () {
					$injector.get('estimateMainGeneratePrjBoqService').showGeneratePrjBoqDialog();
				};

				service.removePackage = function removePackage() {
					let title = 'estimate.main.removePackage';
					let estimateMainRemovePackageResourcesDialogService = $injector.get('estimateMainRemovePackageResourcesDialogService');

					let removePackageConfig = {
						title: $translate.instant(title),
						resizeable: true,
						dataItem: {
							estimateScope: 2,
							IsLineItems: true,
							IsResources: true,
							IsGeneratePrc: false,
							IsDisablePrc: false
						},
						dialogOptions: {
							disableOkButton: function disableOkButton() {
								return estimateMainRemovePackageResourcesDialogService.getIsLoading();
							}
						},
						formConfiguration: {
							fid: 'estimate.main.removePackage',
							version: '0.1.1',
							showGrouping: true,
							groups: [
								{
									gid: 'baseGroup',
									header: 'Assigned Level',
									header$tr$: 'estimate.rule.removePackageWizard.groupTitle1',
									visible: true,
									isOpen: true,
									attributes: ['SelectedItem']
								},
								{
									gid: 'AdditionalSettings',
									header: 'Additional Settings',
									header$tr$: 'estimate.rule.removePackageWizard.groupTitle4',
									visible: true,
									isOpen: true,
									attributes: ['GeneratePrckage']
								},
								{
									gid: 'selectPackages',
									header: 'Select Packages',
									header$tr$: 'estimate.rule.removePackageWizard.groupTitle2',
									visible: true,
									isOpen: true,
									attributes: []
								},
								{
									gid: 'selectPackageResources',
									header: 'Select Resources',
									header$tr$: 'estimate.rule.removePackageWizard.groupTitle3',
									visible: false,
									isOpen: false,
									attributes: []
								}
							],
							'overloads': {},
							rows: [
								{
									gid: 'AdditionalSettings',
									rid: 'GeneratePrckage',
									type: 'directive',
									directive: 'estimate-wizard-remove-package-sdditional-settings-checkbox',
									model: 'GeneratePrckage',
									sortOrder: 1
								},
								{
									gid: 'selectPackages',
									rid: 'selectPackage',
									type: 'directive',
									model: 'selectPackages',
									required: true,
									'directive': 'estimate-Main-Remove-Package-Wizard-Generate-Grid',
									sortOrder: 2
								},
								{
									gid: 'selectPackageResources',
									rid: 'selectPackageResources',
									type: 'directive',
									model: 'PackageResources',
									required: true,
									'directive': 'estimate-main-remove-package-resources-Dialog',
									sortOrder: 3,
									visible: false
								}
							]
						},
						handleOK: function handleOK(result) {
							if (!result || !result.ok || !result.data) {
								return;
							}

							function removePackageFrmItems() {
								return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/removeprcpackage', postData).then(function (response) {
									let lineItems = response && response.data ? response.data.EstLineItems : [];
									estimateMainService.addList(lineItems);
									estimateMainService.refresh();
									estimateMainService.fireListLoaded();
									estimateMainService.setSelected({}).then(function () {
										let list = estimateMainService.getList();
										let selected = _.find(list, {Id: postData.SelectedItemId});
										estimateMainService.setSelected(selected);
									});
								},
								function (/* error */) {
								});
							}

							function getEstimateScope(estimateScope) {
								if (estimateScope === 1 || estimateScope === 2) {
									return 'SelectedLineItems';
								} else if (estimateScope === 0) {
									return 'AllItems';
								}
							}

							if ((result.data.estimateScope === 1 || result.data.estimateScope === 2) && estimateMainService.getIfSelectedIdElse() <= 0) {
								return;
							}

							let selectedPackages = $injector.get('estimateMainRemovePackageWizardDetailService').getPackagesToRemove();
							let selectedPackageIds = [];

							_.forEach(selectedPackages, function (item) {
								selectedPackageIds.push(item.Id);
							});

							let selectedPackageResources = $injector.get('estimateMainRemovePackageResourcesDialogService').getPackageResourcesToRemove();

							let postData = {
								'EstHeaderFk': estimateMainService.getSelectedEstHeaderId(),
								'PrjProjectFk': estimateMainService.getSelectedProjectId(),
								'SelectedLevel': getEstimateScope(result.data.estimateScope),
								'SelectedItemId': estimateMainService.getIfSelectedIdElse(null),
								'EstLineItems': estimateMainService.getSelectedEntities(),
								'EstResources': estimateMainResourceService.getSelectedEntities(),
								'IsLineItems': result.data.IsLineItems,
								'IsResources': result.data.IsResources,
								'PrcPackages': selectedPackageIds,
								'PackageResources': selectedPackageResources,
								'IsGeneratePrc': result.data.IsGeneratePrc,
								'IsDisablePrc':  result.data.IsDisablePrc
							};

							if (result.data.estimateScope === 2) {
								postData.EstLineItems = estimateMainService.getSelectedEntities();
							} else if (result.data.estimateScope === 1) {
								postData.EstLineItems = estimateMainService.getList();
							}
							estimateMainService.updateAndExecute(removePackageFrmItems);
						}
					};

					let selectlineItemscopeRow = estimateMainScopeSelectionService.getHighlightScopeFormRow();
					if (selectlineItemscopeRow) {
						selectlineItemscopeRow.gid = 'baseGroup';
						selectlineItemscopeRow.sortOrder = 1;
						selectlineItemscopeRow.change = function(result) {
							$injector.get('estimateMainRemovePackageWizardDetailService').setDataList(true,result.estimateScope);
						};
					}
					removePackageConfig.formConfiguration.rows.push(selectlineItemscopeRow);

					let resultSetScopeRow = estimateMainScopeSelectionService.getResultSetScopeFormRow();
					if (resultSetScopeRow) {
						resultSetScopeRow.gid = 'baseGroup';
						resultSetScopeRow.sortOrder = 1;
						resultSetScopeRow.change = function(result) {
							$injector.get('estimateMainRemovePackageWizardDetailService').setDataList(true,result.estimateScope);
						};
					}
					removePackageConfig.formConfiguration.rows.push(resultSetScopeRow);

					if(!estimateMainService.getSelected()){
						removePackageConfig.dataItem.estimateScope = 0;
					}
					let allEstimateScopeRow = estimateMainScopeSelectionService.getAllEstimateScopeFormRow();

					if (allEstimateScopeRow) {
						allEstimateScopeRow.gid = 'baseGroup';
						allEstimateScopeRow.sortOrder = 1;
						allEstimateScopeRow.change = function(result) {
							$injector.get('estimateMainRemovePackageWizardDetailService').setDataList(true,result.estimateScope);
						};
					}
					removePackageConfig.formConfiguration.rows.push(allEstimateScopeRow);

					platformTranslateService.translateFormConfig(removePackageConfig.formConfiguration);
					removePackageConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
					platformModalFormConfigService.showDialog(removePackageConfig);
				};

				service.updateRevenue = function updateRevenue() {
					let title = 'estimate.main.updateRevenue';
					let updateRevenueConfig = {
						title: $translate.instant(title),
						dataItem: {
							selectedLevel: 'AllLineItems',
							DistributeBy: 'Cost'
						},
						formConfiguration: {
							fid: 'estimate.main.updateRevenue',
							version: '0.1.1',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									attributes: ['selecteditem']
								}
							],
							'overloads': {},
							rows: [
								{
									gid: 'baseGroup',
									rid: 'SelectedItem',
									label: 'Update Revenue',
									label$tr$: 'estimate.main.updateRevenue',
									type: 'radio',
									model: 'selectedLevel',
									options: {
										labelMember: 'Description',
										valueMember: 'Value',
										groupName: 'updateRevenueConfig',
										items: [
											{
												Id: 1,
												Description: $translate.instant('estimate.main.allLineItems'),
												Value: 'AllLineItems'
											},
											{
												Id: 2,
												Description: $translate.instant('estimate.main.slectedLineItemsUpdRevenue'),
												Value: 'SelectedLineItems'
											}
										]
									}
								},
								{
									gid: 'baseGroup',
									rid: 'DistributeBy',
									label: 'Distribute By',
									label$tr$: 'estimate.main.distributeBy',
									type: 'radio',
									model: 'DistributeBy',
									options: {
										labelMember: 'Description',
										valueMember: 'Value',
										groupName: 'updateRevenueConfig1',
										items: [
											{
												Id: 1,
												Description: $translate.instant('estimate.main.cost'),
												Value: 'Cost'
											},
											{
												Id: 2,
												Description: $translate.instant('estimate.main.budget'),
												Value: 'Budget'
											}
										]
									}
								}
							]
						},
						handleOK: function handleOK(result) {
							if (!result || !result.ok || !result.data) {
								return;
							}

							function updateEstimateRevenue() {
								$http.post(globals.webApiBaseUrl + 'estimate/main/wizard/updaterevenue', data)
									.then(function (response) {
										let lineItems = response && response.data ? response.data : null;
										if (!lineItems) {
											return;
										}
										estimateMainService.addList(lineItems);
										estimateMainService.fireListLoaded();
										estimateMainService.setSelected({}).then(function () {
											let list = estimateMainService.getList();
											let selected = _.find(list, {Id: data.SelectedItemId});
											estimateMainService.setSelected(selected);
											platformModalService.showMsgBox($translate.instant('cloud.common.doneSuccessfully'), $translate.instant('estimate.main.updateRevenue'), 'info');
										});
									},
									function (/* error */) {
									});
							}

							if (result.data.selectedLevel === 'SelectedLineItems' && estimateMainService.getIfSelectedIdElse() <= 0) {
								return;
							}
							let data = {
								'EstHeaderId': estimateMainService.getSelectedEstHeaderId(),
								'ProjectId': estimateMainService.getSelectedProjectId(),
								'SelectedItemId': estimateMainService.getIfSelectedIdElse(null),
								'IsDistributeByCost': result.data.DistributeBy === 'Cost',
								'IsUpdateByWipQuantity': result.data.UpdateBy === 'WIP'
							};
							data.EstLineItems = result.data.selectedLevel === 'SelectedLineItems' ? estimateMainService.getSelectedEntities() : [];
							estimateMainService.updateAndExecute(updateEstimateRevenue);
						}
					};
					platformTranslateService.translateFormConfig(updateRevenueConfig.formConfiguration);
					updateRevenueConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
					platformModalFormConfigService.showDialog(updateRevenueConfig);
				};

				service.convertLineItemIntoAssembly = function convertLineItemIntoAssembly() {
					let title = 'estimate.main.convertLineItemToAssembly',
						msg = $translate.instant('estimate.main.noCurrentLineItemSelection');

					let isDisabled = true;

					function validateAssemblyCatId(entity, value) {
						isDisabled = !value;
					}

					let convertLineItemToAssemblyConfig = {
						title: $translate.instant(title),
						dataItem: {
							AssemblyCategoryId: null
						},
						dialogOptions: {
							disableOkButton: function () {
								return isDisabled;
							}
						},
						formConfiguration: {
							fid: 'estimate.main.convertLineItemToAssemblyDialog',
							version: '0.1.1',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									attributes: ['assemblycategoryid']
								}
							],
							'overloads': {},
							rows: [
								{
									gid: 'baseGroup',
									rid: 'AssemblyCategoryId',
									label$tr$: 'estimate.main.assemblyCategoryId',
									type: 'directive',
									model: 'AssemblyCategoryId',
									required: true,
									'directive': 'estimate-assemblies-category-lookup',
									'options': {
										'lookupDirective': 'estimate-assemblies-category-lookup',
										'descriptionField': 'DescriptionInfo',
										'descriptionMember': 'DescriptionInfo.Translated',
										'lookupOptions': {
											'initValueField': 'Code',
											'showClearButton': true
										}
									},
									validator: validateAssemblyCatId,
									sortOrder: 1
								}
							]
						},
						handleOK: function handleOK(result) {
							if (result && result.ok && result.data) {
								let selectedItemId = estimateMainService.getIfSelectedIdElse(null);
								if (selectedItemId) {
									let postData = {
										'EstAssemblyCatId': result.data.AssemblyCategoryId,
										'EstHeaderFk': estimateMainService.getSelectedEstHeaderId(),
										'ProjectId': estimateMainService.getSelectedProjectId(),
										'SelectedItemId': selectedItemId,
										'EstLineItems': estimateMainService.getSelectedEntities()
									};

									if (postData.ProjectId > 0 && postData.EstHeaderFk > 0) {
										$http.post(globals.webApiBaseUrl + 'estimate/main/wizard/convertlineitemintoassembly', postData)
											.then(function (response) {
												// refresh line item container
												if (response.data) {
													estimateMainService.load();
												}
											});
									}
								}
							}
						},
						handleCancel: function handleCancel() {
							isDisabled = false;
						}
					};
					platformTranslateService.translateFormConfig(convertLineItemToAssemblyConfig.formConfiguration);
					convertLineItemToAssemblyConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
					if (platformSidebarWizardCommonTasksService.assertSelection(estimateMainService.getSelected(), title, msg)) {

						let resourceData = estimateMainResourceService.getList();
						let showWarning = false;
						let estimateMainResourceType = $injector.get('estimateMainResourceType');
						angular.forEach(resourceData,function(item){
							if(item.EstResourceTypeFk === estimateMainResourceType.Plant){
								showWarning = true;
							}
						});
						if(showWarning){
							platformModalService.showMsgBox('estimate.main.convertLineItemToAssemblyErrorMsg', 'estimate.main.convertLineItemToAssembly', 'warning');
						} else {
							platformModalFormConfigService.showDialog(convertLineItemToAssemblyConfig);
						}
					}
				};

				service.updatePackageBoq = updatePackageBoq;

				service.importRisks = function importRisks() {
					let estimateMainRiskImportService = $injector.get('estimateMainRiskImportService');
					estimateMainRiskImportService.showImportRiskWizardDialog();
				};

				service.updateProjectBoqBudget = function updateProjectBoqBudget() {
					let data = {
						'EstHeaderId': estimateMainService.getSelectedEstHeaderId(),
						'ProjectId': estimateMainService.getSelectedProjectId()
					};

					function updateProjectBoqBdgt() {
						$http.post(globals.webApiBaseUrl + 'estimate/main/wizard/updateprojectboqbudget', data)
							.then(function () {
								platformModalService.showMsgBox('estimate.main.updateProjectBoqBudgetWizard.updatePrjConBoqBudgetText', 'estimate.main.updateProjectBoqBudgetWizard.updatePrjConBoqBudgetHeader', 'info');
							},
							function (/* error */) {
							});
					}

					estimateMainService.updateAndExecute(updateProjectBoqBdgt);
				};

				service.updateBaseCost = function updateBaseCost() {
					let title = 'estimate.main.updateBaseCost';
					let noteText = $translate.instant('estimate.main.generateBaseCost');
					let updateBaseCostConfig = {
						title: $translate.instant(title),
						dataItem: {
							estimateScope: 0,
							generateBaseCost: 'IsGenerateBaseCost',
							noteText: noteText
						},
						formConfiguration: {
							fid: 'estimate.main.updateBaseCost',
							version: '0.1.1',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									attributes: ['selecteditem']
								}
							],
							'overloads': {},
							rows: [
								{
									gid: 'baseGroup',
									rid: 'generateBaseCost',
									label: 'Generate / Update Base Cost',
									label$tr$: 'estimate.main.updateBaseCost',
									type: 'radio',
									model: 'generateBaseCost',
									sortOrder: 2,
									change: function (result) {
										if (result.generateBaseCost === 'IsGenerateBaseCost') {
											result.noteText = $translate.instant('estimate.main.generateBaseCost');
										} else {
											result.noteText = $translate.instant('estimate.main.updateBaseCostDescription');
										}
									},
									options: {
										labelMember: 'Description',
										valueMember: 'Value',
										groupName: 'updateBaseCostGroupConfig1',
										items: [
											{
												Id: 1,
												Description: $translate.instant('estimate.main.isGenerateBaseCost'),
												Value: 'IsGenerateBaseCost'
											},
											{
												Id: 2,
												Description: $translate.instant('estimate.main.isUpdateBaseCost'),
												Value: 'IsUpdateBaseCost'
											}]
									}
								},
								{
									rid: 'generateBaseCost',
									gid: 'baseGroup',
									label: 'Note:',
									label$tr$: 'estimate.main.note',
									type: 'text',
									model: 'noteText',
									sortOrder: 6,
									readonly: true
								}
							]
						},
						handleOK: function handleOK(result) {
							if (!result || !result.ok || !result.data) {
								return;
							}

							function updateBaseCost() {
								$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/updatelineitemsbasecost', postData)
									.then(function (response) {
										estimateMainService.addList(response.data);
										estimateMainService.fireListLoaded();
										estimateMainService.setSelected({}).then(function () {
											let list = estimateMainService.getList();
											let selected = _.find(list, {Id: postData.SelectedItemId});
											estimateMainService.setSelected(selected);
										});
									},
									function (/* error */) {
									});
							}

							function getEstimateScope(estimateScope) {
								if (estimateScope === 1 || estimateScope === 2) {
									return 'SelectedLineItems';
								} else if (estimateScope === 0) {
									return 'AllItems';
								}
							}

							if ((result.data.estimateScope === 1 || result.data.estimateScope === 2) && estimateMainService.getIfSelectedIdElse() <= 0) {
								return;
							}

							let postData = {
								'EstHeaderFk': estimateMainService.getSelectedEstHeaderId(),
								'ProjectId': estimateMainService.getSelectedProjectId(),
								'GenerateOrUpdateBaseCost': result.data.generateBaseCost,
								'SelectedLevel': getEstimateScope(result.data.estimateScope),
								'SelectedItemId': estimateMainService.getIfSelectedIdElse(null),
								'LineItemIds': _.map(estimateMainService.getSelectedEntities(), 'Id')
							};
							estimateMainService.updateAndExecute(updateBaseCost);
						}
					};

					let selectlineItemscopeRow = estimateMainScopeSelectionService.getHighlightScopeFormRow();
					if (selectlineItemscopeRow) {
						selectlineItemscopeRow.gid = 'baseGroup';
						selectlineItemscopeRow.sortOrder = 1;
					}
					updateBaseCostConfig.formConfiguration.rows.push(selectlineItemscopeRow);

					let resultSetScopeRow = estimateMainScopeSelectionService.getResultSetScopeFormRow();
					if (resultSetScopeRow) {
						resultSetScopeRow.gid = 'baseGroup';
						resultSetScopeRow.sortOrder = 1;
					}
					updateBaseCostConfig.formConfiguration.rows.push(resultSetScopeRow);

					let allEstimateScopeRow = estimateMainScopeSelectionService.getAllEstimateScopeFormRow();

					if (allEstimateScopeRow) {
						allEstimateScopeRow.gid = 'baseGroup';
						allEstimateScopeRow.sortOrder = 1;
					}
					updateBaseCostConfig.formConfiguration.rows.push(allEstimateScopeRow);

					platformTranslateService.translateFormConfig(updateBaseCostConfig.formConfiguration);
					updateBaseCostConfig.scope = platformSidebarWizardConfigService.getCurrentScope();

					platformModalFormConfigService.showDialog(updateBaseCostConfig);
				};

				service.createResRequisitionFromLineItems = function createResRequisitionFromLineItems(){

					let dataItem = {
						selection: {
							isFullEstimate: null,
							isSelectedLineItems: estimateMainService.getSelectedEntities()
						},
						processData: {
							processCostCodes: null,
							processMaterial: null,
							processPlant: null,
							inclResources: null
						},
						aggregation:{
							controllingUnit: null,
							procurementStructure: null
						}
					};

					let checkDisallowNextStep1 = function () {
						return !(!dataItem.selection.isFullEstimate || !dataItem.selection.isSelectedLineItems);
					};
					let checkDisallowNextStep2 = function () {
						return !(dataItem.processData.processCostCodes || dataItem.processData.processMaterial || dataItem.processData.processPlant || dataItem.processData.inclResources);
					};


					let step1Rows = [
						{
							gid: 'baseGroup',
							rid: 'selection',
							label: 'Create Requisition From',
							type: 'radio',
							model: 'selection',
							required: true,
							canFinish: true,
							options: {
								labelMember: 'Description',
								valueMember: 'Value',
								groupName: 'selection',
								items: [
									{
										Id: 1,
										Description: $translate.instant('estimate.main.createResRequisitionFromLineItemsWizard.fullEstimate'),
										Value: 'fullEstimate'
									},
									{
										Id: 2,
										Description: $translate.instant('estimate.main.createResRequisitionFromLineItemsWizard.lineItems'),
										Value: 'lineItems'
									}
								]
							}
						}
					];

					let step2Rows = [
						{
							gid: 'baseGroup',
							rid: 'processCostCodes',
							title: 'Process',
							label:'Process Cost Codes to Resource Type',
							label$tr$: 'estimate.main.createResRequisition',
							type: 'boolean',
							model: 'processData.processCostCodes',
							sortOrder: 1
						},
						{
							gid: 'baseGroup',
							rid: 'processMaterial',
							label:'Process Material',
							label$tr$: 'estimate.main.createResRequisition',
							type: 'boolean',
							model: 'processData.processMaterial',
							sortOrder: 2
						},
						{
							gid: 'baseGroup',
							rid: 'processPlant',
							label:'Process Plant To Resource',
							label$tr$: 'estimate.main.createResRequisition',
							type: 'boolean',
							model: 'processData.processPlant',
							sortOrder: 3
						},
						{
							gid: 'baseGroup',
							rid: 'processResResource',
							label:'Process Resources',
							label$tr$: 'estimate.main.createResRequisition',
							type: 'boolean',
							model: 'processData.processResResource',
							sortOrder: 4
						}
					];

					let step3Rows = [
						{
							gid: 'baseGroup',
							rid: 'controllingUnit',
							label:'Controlling Unit',
							label$tr$: 'estimate.main.createResRequisition',
							type: 'boolean',
							model: 'aggregation.controllingUnit',
							sortOrder: 1
						},
						{
							gid: 'baseGroup',
							rid: 'procurementStructure',
							label:'Procurement Structure',
							label$tr$: 'estimate.main.createResRequisition',
							type: 'boolean',
							model: 'aggregation.procurementStructure',
							sortOrder: 2
						},
					];

					let createResRequisitionWizard = {
						id: 'estimateWizard',
						title$tr$: 'estimate.main.createResRequisitionFromLineItemsWizard.title',
						steps: [
							{
								id: 'selection',
								title$tr$: 'estimate.main.createResRequisitionFromLineItemsWizard.step1Title',
								form: {
									fid: 'estimate.main.selection',
									version: '1.0.0',
									showGrouping: false,
									skipPermissionsCheck: true,
									groups: [{
										gid: 'baseGroup',
										attributes: ['selection']
									}],
									rows: step1Rows
								},
								disallowBack: true,
								disallowNext: true,
								canFinish: false,
								watches: [{
									expression: 'selection',
									fn: function (info) {
										let checkSelection = _.find(info.wizard.steps[0].form.rows, { rid: 'selection' });
										switch (info.newValue) {
											case 'fullEstimate':
												checkSelection.required = true;
												info.wizard.steps[0].disallowNext = checkDisallowNextStep1();
												break;
											case 'lineItems':
												checkSelection.required = true;
												info.wizard.steps[0].disallowNext = checkDisallowNextStep1();
												break;
											default:
												console.log('Unexpected createRequisitionsValue "${info.newValue}"');
										}
										info.wizard.steps[0].disallowNext = info.wizard.steps[0].canFinish;
										info.scope.$broadcast('form-config-updated');
									}
								}]
							},
							{
								id: 'processData',
								title$tr$: 'estimate.main.createResRequisitionFromLineItemsWizard.step2Title',
								form: {
									fid: 'estimate.main.createResRequisition',
									version: '1.0.0',
									showGrouping: false,
									skipPermissionsCheck: true,
									groups: [
										{
											gid: 'baseGroup'
										}
									],
									rows: step2Rows
								},
								disallowBack: false,
								disallowNext: true,
								canFinish: false,
								watches: [{
									expression: 'processData',
									fn: function (info) {
										info.wizard.steps[1].disallowNext = checkDisallowNextStep2();
										info.scope.$broadcast('form-config-updated');
									},
									deep: true
								}],
								prepareStep: function prepareStep() {

									/*
									if(info.model.selection === 'fullEstimate' && selectedEstimateHeader === null){
										info.commands.goToPrevious();
										platformModalService.showErrorBox('estimate.main.createResRequisitionFromLineItemsWizard.ErrorNoFullEstimateSelected');
									}
									else if(info.model.selection === 'lineItems' && selectedLineItems.length <= 0){
										info.commands.goToPrevious();
										platformModalService.showErrorBox('estimate.main.createResRequisitionFromLineItemsWizard.ErrorNoLineItemsSelected');
									}

									 */
								}
							},
							{
								id: 'aggregation',
								title$tr$: 'estimate.main.createResRequisitionFromLineItemsWizard.step3Title',
								form: {
									fid: 'estimate.main.createResRequisition',
									version: '1.0.0',
									showGrouping: false,
									skipPermissionsCheck: true,
									groups: [
										{
											gid: 'baseGroup'
										}
									],
									rows: step3Rows
								},
								disallowBack: false,
								disallowNext: true,
								canFinish: true,
								watches: []
							}
						]
					};

					platformWizardDialogService.translateWizardConfig(createResRequisitionWizard);
					platformWizardDialogService.showDialog(createResRequisitionWizard, dataItem).then(function (result) {
						if (result.success) {
							const actions = {
								Action: 18,
								EstimateId: estimateMainService.getSelectedEstHeaderItem() !== null ? estimateMainService.getSelectedEstHeaderItem().Id : null,
								LineItemIds : estimateMainService.getSelectedEntities().length > 0 ? _.map(estimateMainService.getSelectedEntities(), 'Id') : null,
								IsFullEstimate: result.data.selection === 'fullEstimate',
								IsSelectedLineItems : result.data.selection === 'lineItems',
								CreateRequisitionByCostCode: result.data.processData.processCostCodes !== null ? result.data.processData.processCostCodes : false,
								CreateRequisitionByMaterial: result.data.processData.processMaterial !== null ? result.data.processData.processMaterial : false,
								CreateRequisitionByPlant: result.data.processData.processPlant !== null ? result.data.processData.processPlant : false,
								CreateRequisitionByResResource: result.data.processData.processResResource !== null ? result.data.processData.processResResource : false,
								GroupByControllingUnit: result.data.aggregation.controllingUnit !== null ? result.data.aggregation.controllingUnit : false,
								GroupByPrcStructure: result.data.aggregation.procurementStructure !== null ? result.data.aggregation.procurementStructure : false
							};
							$http.post(globals.webApiBaseUrl + 'scheduling/main/activity/execute', actions).then(function (response) {
								if (response.data.Valid && !response.data.ValidationError) {
									// At least 1 entity was created
									var modalOptions = {
										headerTextKey: 'estimate.main.createResRequisitionFromLineItemsWizard.title',
										bodyTextKey: 'estimate.main.createResRequisitionFromLineItemsWizard.creationSuccess',
										showOkButton: true,
										showCancelButton: true,
										resizeable: true,
										height: '500px',
										iconClass: 'info'
									};
									platformModalService.showDialog(modalOptions);
								}
								else {
									if (response.data.ValidationError) {
										// Exception happened in the backend
										platformModalService.showMsgBox(
											$translate.instant('estimate.main.createResRequisitionFromLineItemsWizard.error'),
											$translate.instant('estimate.main.createResRequisitionFromLineItemsWizard.title'),
											'error');
									} else {
										// No requisitions were created
										platformModalService.showMsgBox(
											$translate.instant('estimate.main.createResRequisitionFromLineItemsWizard.warning'),
											$translate.instant('estimate.main.createResRequisitionFromLineItemsWizard.title'),
											'warning');
									}
								}
							});
						}
					});
				};

				service.dissolveAssembly = function dissolveAssembly() {
					let title = 'estimate.main.dissolveAssemblyWizard.dissolveAssembly';

					let isShowPlantAsOneRecord = estimateMainService.getShowPlantAsOneRecordOption();
					isShowPlantAsOneRecord = _.toLower(isShowPlantAsOneRecord) === 'true' || isShowPlantAsOneRecord === '1';

					let dissolveAssemblyConfig = {
						title: $translate.instant(title),
						resizeable: true,
						dataItem: {
							estimateScope: 2
						},
						formConfiguration: {
							fid:'estimate.main.dissolveAssemblyWizard.dissolveAssembly',
							version: '0.1.1',
							showGrouping: true,
							groups: [
								{
									gid: 'baseGroup',
									header: 'Assigned Level',
									header$tr$: 'estimate.main.dissolveAssemblyWizard.groupTitle1',
									visible: true,
									isOpen: true,
									attributes: ['SelectedItem']
								},
								{
									gid: 'selectAssemblies',
									header: 'Select Assemblies',
									header$tr$: 'estimate.main.dissolveAssemblyWizard.groupTitle2',
									visible: true,
									isOpen: true,
									attributes: []
								},
								{
									gid: 'updatePlantAssembly',
									header: 'Update Plant Assembly',
									header$tr$: 'estimate.main.dissolveAssemblyWizard.dissolvePlantAssembly',
									visible: isShowPlantAsOneRecord,
									isOpen: isShowPlantAsOneRecord,
									attributes: []
								}
							],
							'overloads': {},
							rows: [
								{
									gid: 'selectAssemblies',
									rid: 'selectAssembly',
									type: 'directive',
									model: 'selectAssemblies',
									required: true,
									'directive': 'estimate-main-dissolve-assembly-resource-dialog',
									sortOrder: 2
								},
								{
									gid: 'updatePlantAssembly',
									rid: 'updatePlantAssembly',
									type: 'directive',
									model: 'selectPlantAssemblies',
									required: true,
									'directive': 'estimate-main-dissolve-plant-assembly-resource-dialog',
									sortOrder: 3
								}
							]
						},
						handleOK: function handleOK(result) {
							if (!result || !result.ok || !result.data) {
								return;
							}

							function dissolveAssemblies() {
								return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/dissolveassemblies', postData).then(function (response) {
									let lastSelected = angular.copy(estimateMainService.getSelected());
									let updatedLineItems = response.data;
									estimateMainService.addList(updatedLineItems);
									_.each(updatedLineItems, function(item){
										estimateMainService.fireItemModified(item);
									});
									estimateMainService.setSelected(lastSelected);
								});
							}

							function getEstimateScope(estimateScope) {
								if (estimateScope === 1 || estimateScope === 2) {
									return 'SelectedLineItems';
								} else if (estimateScope === 0) {
									return 'AllItems';
								}
							}

							if ((result.data.estimateScope === 1 || result.data.estimateScope === 2) && estimateMainService.getIfSelectedIdElse() <= 0) {
								return;
							}

							let selectedAssemblies = $injector.get('estimateMainDissolveAssemblyWizardDetailService').getDissolveAssemblies();
							let selectedAssemblyIds = [];

							_.forEach(selectedAssemblies, function (item) {
								selectedAssemblyIds.push(item.Id);
							});

							let selectedPlantResources = $injector.get('estimateMainDissolvePlantAssemblyService').getDissolvePlantAssemblies();
							let selectedPlantIds = [],
								selectedWithoutPlantCodes = [];

							_.forEach(selectedPlantResources, function (item) {
								if(item.EtmPlantFk){
									selectedPlantIds.push(item.EtmPlantFk);
								}else{
									selectedWithoutPlantCodes.push(item.Code);
								}
							});

							let postData = {
								'EstHeaderFk': estimateMainService.getSelectedEstHeaderId(),
								'ResourceType': 4, // Assembly,
								'AssemblyIds': selectedAssemblyIds,
								'SectionId': 33,
								'ProjectId': estimateMainService.getSelectedProjectId(),
								'JobId': $injector.get('estimateMainJobDataService').getJobFkWhenCopyAssembly(),
								'SelectedLevel': getEstimateScope(result.data.estimateScope),
								'SelectedItemId': estimateMainService.getIfSelectedIdElse(null),
								'SelectedEstLineItems': estimateMainService.getSelectedEntities(),
								'IsShowPlantAsOneRecord': isShowPlantAsOneRecord,
								'PlantIds': _.uniq(selectedPlantIds),
								'WithoutPlantItemCodes': _.uniq(selectedWithoutPlantCodes)
							};

							if (result.data.estimateScope === 2) {
								postData.SelectedEstLineItems = estimateMainService.getSelectedEntities();
							} else if (result.data.estimateScope === 1) {
								postData.SelectedEstLineItems = estimateMainService.getList();
							}

							if (postData && (postData.AssemblyIds.length > 0 || postData.PlantIds.length > 0 || postData.WithoutPlantItemCodes.length > 0)) {
								estimateMainService.updateAndExecute(dissolveAssemblies);
							}
						}
					};

					let selectlineItemscopeRow = estimateMainScopeSelectionService.getHighlightScopeFormRow();
					if (selectlineItemscopeRow) {
						selectlineItemscopeRow.gid = 'baseGroup';
						selectlineItemscopeRow.sortOrder = 1;
						selectlineItemscopeRow.change = function(result) {
							$injector.get('estimateMainDissolveAssemblyWizardDetailService').setDataList(true,result.estimateScope);
						};
					}
					dissolveAssemblyConfig.formConfiguration.rows.push(selectlineItemscopeRow);

					let resultSetScopeRow = estimateMainScopeSelectionService.getResultSetScopeFormRow();
					if (resultSetScopeRow) {
						resultSetScopeRow.gid = 'baseGroup';
						resultSetScopeRow.sortOrder = 1;
						resultSetScopeRow.change = function(result) {
							$injector.get('estimateMainDissolveAssemblyWizardDetailService').setDataList(true,result.estimateScope);
						};
					}
					dissolveAssemblyConfig.formConfiguration.rows.push(resultSetScopeRow);

					let allEstimateScopeRow = estimateMainScopeSelectionService.getAllEstimateScopeFormRow();

					if (allEstimateScopeRow) {
						allEstimateScopeRow.gid = 'baseGroup';
						allEstimateScopeRow.sortOrder = 1;
						allEstimateScopeRow.change = function(result) {
							$injector.get('estimateMainDissolveAssemblyWizardDetailService').setDataList(true,result.estimateScope);
						};
					}
					dissolveAssemblyConfig.formConfiguration.rows.push(allEstimateScopeRow);

					platformTranslateService.translateFormConfig(dissolveAssemblyConfig.formConfiguration);
					dissolveAssemblyConfig.scope = platformSidebarWizardConfigService.getCurrentScope();

					platformModalFormConfigService.showDialog(dissolveAssemblyConfig);
				};

				service.processCreateExistedItem = function processCreateExistedItem(entity) {
					entity.CopyLeadingStructrueDesc = entity.CreateNew;
					let fields = [
						{field: 'CopyLeadingStructrueDesc', readonly: !entity.CreateNew}
					];

					entity.CopyRelatedWicAssembly = false;
					let structureType = $injector.get('estimateWizardGenerateSourceLookupService').getItemByKey(entity.StructureId);
					if (structureType) {
						let notByBoq = structureType.StructureName !== 'Boq';
						fields.push({field: 'CopyRelatedWicAssembly', readonly: !entity.CreateNew || notByBoq});
					}

					platformRuntimeDataService.readonly(entity, fields);
				};


				service.backWordCalculate = function backWordCalculate() {
					let estimateMainBackwardCalculationWizardService = $injector.get('estimateMainBackwardCalculationWizardService');
					estimateMainBackwardCalculationWizardService.showBackwardWizardDialog();
				};

				service.excelImport = function excelImport(wizardParameter) {
					var options = estimateMainImportOptionsService.getImportOptions(estimateMainService);
					options.wizardParameter = wizardParameter;
					basicsImportService.showImportDialog(options);
				};

				service.excelExport = function excelExport(wizardParameter) {
					var options = estimateMainExportOptionsService.getExportOptions(estimateMainService);
					options.MainContainer.Id = '1';
					options.wizardParameter = wizardParameter;
					basicsExportService.showExportDialog(options);
				};

				return service;

				// ///////////////////////
				function updatePackageBoq() {
					let lineItems = estimateMainService.getSelectedEntities();
					let lineItemIds = _.map(lineItems, 'Id');
					let estHeaderId = estimateMainService.getSelectedEstHeaderId();
					if (estHeaderId <= 0) {
						return;
					}
					estimateMainUpdatePackageBoqWizardService.execute({
						selectedIds: lineItemIds,
						filterRequest: estimateMainService.getLastFilter(),
						currentEstHeaderId: estHeaderId
					});
				}
			}
		]);
})(angular);
