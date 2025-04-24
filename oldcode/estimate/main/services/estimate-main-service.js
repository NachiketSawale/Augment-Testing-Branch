/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals, Platform, _ , $ */

(function () {
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainService
	 * @function
	 *
	 * @description
	 * estimateMainService is the data service for all estimate related functionality.
	 */
	/* jshint -W003 */
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W071 */

	angular.module(moduleName).factory('estimateMainService', ['$rootScope','$translate', '$http', '$q', '$injector', 'platformGridAPI', 'mainViewService', 'platformObjectHelper', 'PlatformMessenger', 'platformDataServiceFactory', 'estimateMainCreationService', 'estimateMainCommonService', 'estimateMainLookupService', 'estimateMainLineItemProcessor', 'estimateMainPrjMaterialLookupService', 'cloudDesktopInfoService',
		'estimateMainSelectEstimateHeaderDialog', 'estimateMainRuleUpdateService', 'estimateParamUpdateService', 'estimateParameterFormatterService', 'estimateRuleFormatterService', 'estimateMainExchangeRateService',
		'basicsLookupdataLookupFilterService', 'estimateMainFilterService', 'platformModalService',
		'projectMainPinnableEntityService', 'estimateMainPinnableEntityService', 'platformPermissionService', 'permissions', 'estimateMainCostCodeChartDataService',
		'estimateMainJobCostcodesLookupService', 'estimateProjectRateBookConfigDataService', 'platformContextService', 'ServiceDataProcessDatesExtension', 'estMainRuleParamIconProcess', 'estimateMainConflictType',
		function ($rootScope, $translate, $http, $q, $injector, platformGridAPI, mainViewService, platformObjectHelper, PlatformMessenger, platformDataServiceFactory, estimateMainCreationService, estimateMainCommonService, estimateMainLookupService,
			estimateMainLineItemProcessor, estimateMainPrjMaterialLookupService, cloudDesktopInfoService, estimateMainSelectEstimateHeaderDialog, estimateMainRuleUpdateService,
			estimateParamUpdateService, estimateParameterFormatterService, estimateRuleFormatterService, estimateMainExchangeRateService, basicsLookupdataLookupFilterService, estimateMainFilterService, platformModalService,
			projectMainPinnableEntityService, estimateMainPinnableEntityService, platformPermissionService, permissions, estimateMainCostCodeChartDataService, estimateMainJobCostcodesLookupService, estimateProjectRateBookConfigDataService, platformContextService, ServiceDataProcessDatesExtension, estMainRuleParamIconProcess, estimateMainConflictType) {

			let selectedEstHeaderFk = null,
				isUpdateDataByParameter = false,
				estimateMainParamStructureConstant = $injector.get('estimateMainParamStructureConstant'),
				selectedEstHeaderColumnConfigFk = null,
				selectedEstHeaderColumnConfigTypeFk = null,
				isColumnConfig = null,
				ruleToDelete =[],

				selectedEstHeaderItem = null,
				selectedEstProject = null,
				selectedProjectInfo = null,
				selectedLineItem = {},
				isLoadByNavigation = false,
				isLoadByPrjFavorites = false,
				selectedConstructionSystemInstance = null,
				ruleParamSaveToLevel = '',
				detailsParamAlwaysSave = '',
				characteristicColumn = '',
				isEstimate = false,
				isHeaderStatusReadOnly = false,
				isReadOnlyService = false,
				isRegisterContextUpdated = false,
				estiamteReadData = null,
				isCalcTotalWithWq = false,
				showDeleteMessage = true,
				isDoRefreshLD = false,
				estLineItemStatusList,
				isWQReadOnly = false,
				isTotalAQBudget = false,
				considerDisabledDirect = false,
				isBudgetEditable = true,
				isFixedBudgetTotal = true,
				isAllowAssemblyTemplateNavigate = true,
				lazyLoadCostCodeSystemOption = false,
				cacheExchangeProjectId = -1,
				LineItemContextEstHeaderId = null,
				systemOptionForPlantTypeResource = true,
				showPlantAsOneRecord = false;

			// options
			let useCreationService = true,
				isSelectEstimateHeaderDialogEnabled = false; // enable or disable dialog for project/estimate selection


			let gridId = null;

			let sidebarInquiryOptions = {
				active: true,
				moduleName: moduleName,
				getSelectedItemsFn: getSelectedItems,
				getResultsSetFn: getResultsSet
			};

			function compareCostGroupCatalog(source, target){
				if(!source || !target) {
					return false;
				}

				if(source.LicCostGroupCats.length !== target.LicCostGroupCats.length) {
					return false;
				}

				return source.PrjCostGroupCats.length === target.PrjCostGroupCats.length;
			}

			let serviceContainer = null;

			// The instance of the main service - to be filled with functionality below
			let estimateMainServiceOptions = {
				flatRootItem: {
					module: estimateMainModule,
					serviceName: 'estimateMainService',
					entityNameTranslationID: 'estimate.main.lineItemContainer',
					entityInformation: { module: 'Estimate.Main', entity: 'EstLineItem', specialTreatmentService: null},
					httpCreate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/'},
					httpUpdate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endUpdate: 'update'},
					httpDelete: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endDelete: 'delete'},
					httpRead: {
						useLocalResource: true,
						resourceFunction: resourceReadFunction,
						extendSearchFilter: extendSearchFilter,
						route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endRead: 'listfiltered_new',
						usePostForRead: true
					},
					entityRole: {
						root: {
							rootForModule: moduleName,
							codeField: 'Code',
							descField: 'Description',
							itemName: 'EstLineItems',
							moduleName: 'Estimate Main',
							handleUpdateDone: function (updateData, response, data) {
								sortCodeInfoToSave = [];
								_.forEach(response.SortCodeInfoToSave, function(scItem){
									if(!scItem.IsExist){
										let codeId = scItem.Field.slice(8);
										let SortCodeFk = 'SortCode' + codeId.toString() +'Fk';
										let SortCodeId = response.EstLineItems[0][SortCodeFk];
										let sortCodeServiceName = 'estimateMainSortCode' + codeId.toString() +'LookupDataService';
										let opt = {dataServiceName: sortCodeServiceName, displayMember: 'Code'};
										$injector.get(sortCodeServiceName).updateItemIdByCode(opt,scItem.Code,SortCodeId);
									}
								});
								estimateMainPrjMaterialLookupService.clear();
								estimateMainRuleUpdateService.clear();
								estimateParamUpdateService.clear();

								if(response.IsReload) {
									service.load();
									$injector.get('estimateMainCombinedLineItemClientService').load();
									return;
								}

								// Set the est line item read only based on Line item Status column
								if(Object.hasOwnProperty.call(response, 'EstLineItemStatusList')){
									setEstLineItemStatusList(_.get(response, 'EstLineItemStatusList'));
								}

								if(response.EstLineItems && response.EstLineItems.length > 0){
									let currentLineItem = response.EstLineItems[0];
									service.onSortCodeReset.fire(response.SortCodeInfoToSave);

									if(selectedProjectInfo){
										currentLineItem.ProjectId= selectedProjectInfo.ProjectId;
										currentLineItem.ProjectName= selectedProjectInfo.ProjectName;
										currentLineItem.ProjectNo= selectedProjectInfo.ProjectNo;
										if (selectedEstHeaderItem){
											currentLineItem.EstimationCode= selectedEstHeaderItem.Code;
											currentLineItem.EstimationDescription=selectedEstHeaderItem.DescriptionInfo;
										}
									}

									// the code will Generate by RubricCategory Number Generation Setting, set the code as readonly
									_.forEach(response.EstLineItems, function(item){
										$injector.get('platformRuntimeDataService').readonly(item, [{field: 'Code', readonly: false}]);
										estimateMainCommonService.translateCommentCol(item);

										// merge error info if exist
										let oldLineItem = _.find(updateData.EstLineItems, {Id: item.Id});
										if(oldLineItem && oldLineItem.__rt$data && oldLineItem.__rt$data.errors){
											item.__rt$data = item.__rt$data || {};
											item.__rt$data.errors = oldLineItem.__rt$data.errors;
										}
									});
								}

								if(response.EstResourceToSave && response.EstResourceToSave.length > 0){
									_.forEach(response.EstResourceToSave, function(resourceItem){
										estimateMainCommonService.translateCommentCol(resourceItem.EstResource);
									});
								}

								if(response.EstLineItemParametersToSave && response.EstLineItemParametersToSave.length > 0){
									// update lineitem parameter value to leading structure parameter lookup data
									estimateParameterFormatterService.handleUpdateDoneWithLineItemParams(response.EstLineItemParametersToSave);
								}

								estimateParameterFormatterService.handleUpdateDone(response);
								estimateRuleFormatterService.handleUpdateDone(response);
								$injector.get('estimateMainAllowanceAreaValueService').handleUpdateDone(updateData, response, data);
								$injector.get('estimateMainAllowanceAreaService').handleUpdateDone(updateData, response, data);
								$injector.get('estimateMainLineItemSelStatementListService').handleUpdateDone(updateData, response);
								$injector.get('estimateMainPlantListService').handleUpdateDone(updateData, response, data);
								// refresh the leading structure params data to the lineitem parameter data
								$injector.get('estimateMainLineitemParamertersService').refreshToLineItemParams(response);

								let estimateMainResourceService = $injector.get('estimateMainResourceService');

								if(response.IsQNARuleExecuteSuccess){
									if(angular.isArray(response.UserDefinedcolsOfResourceModified) && angular.isArray(response.EstResourcesAfterQNARuleExecuted)){
										let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
										let resourceUdps = response.UserDefinedcolsOfResourceModified.concat(estimateMainResourceDynamicUserDefinedColumnService.getData());

										estimateMainResourceDynamicUserDefinedColumnService.attachUpdatedValueToColumn(response.EstResourcesAfterQNARuleExecuted, resourceUdps);
									}

									estimateMainResourceService.updateList(response.EstResourcesAfterQNARuleExecuted, false);
								}else{
									if(angular.isArray(response.UserDefinedcolsOfResourceModified) && angular.isArray(response.EstResourceToSave)){
										let resourceEntities = _.map(response.EstResourceToSave,'EstResource');
										$injector.get('estimateMainResourceDynamicUserDefinedColumnService').attachUpdatedValueToColumn(resourceEntities, response.UserDefinedcolsOfResourceModified, true);
									}
								}

								if(response.EstResourceToDelete && response.EstResourceToDelete.length > 0){
									estimateMainResourceService.deleteResources(response.EstResourceToDelete);
								}

								if(response.EstResourceToSave && response.EstResourceToSave.length > 0){
									estimateMainResourceService.handleUpdateDone(response.EstResourceToSave);
								}

								if(response.EstBoq && response.EstBoq.length > 0){
									service.addList(response.EstLineItems);
									service.fireListLoaded();
									service.setSelected({}).then(function () {
										if(response.EstLineItems && response.EstLineItems.length) {
											service.setSelected(response.EstLineItems[0]);
										}
									});
									$injector.get('estimateMainBoqService').handleUpdateDone(updateData, response, false);
								}

								let combineService = $injector.get('estimateMainCombinedLineItemClientService');
								if(response.CombinedLineItemsToSave && response.CombinedLineItemsToSave.length > 0){
									combineService.setCombineFilters();
									combineService.handleUpdateDone(response);
								}

								if (response.CombinedLineItems && response.CombinedLineItems.length > 0){
									response.CombinedLineItems = response.CombinedLineItems[0];
									combineService.setCombineFilters();
									combineService.handleUpdateDone(response);

									service.refreshSelectedEntities();
								}

								if(response.EstRuleExecutionResults && response.EstRuleExecutionResults.length > 0){
									let estimateMainOutputDataService = $injector.get('estimateMainOutputDataService');
									estimateMainOutputDataService.setDataList(response.EstRuleExecutionResults);
									estimateMainOutputDataService.estMainRuleOutputResultChanged.fire();
								}

								let estimateMainRiskEventsDataService = $injector.get('estimateMainRiskEventsDataService');
								if(response.RiskRegistersToSave && response.RiskRegistersToSave.length > 0 ){
									estimateMainRiskEventsDataService.handleUpdateDone(updateData,response, response.RiskRegistersToSave[0]);
								}
								if(response.RiskRegistersToDelete && response.RiskRegistersToDelete.length > 0 ){
									estimateMainRiskEventsDataService.handleUpdateDone(updateData, response,response.RiskRegistersToDelete[0]);

								}

								if(response.EstLineItem2MdlObjectToSave && response.EstLineItem2MdlObjectToSave.length > 0) {
									_.forEach(response.EstLineItem2MdlObjectToSave, function (item){
										if(item.QuantityTarget === 0)
										{
											item.QuantityTarget = '';
											item.WqQuantityTarget = '';
										}
									});
								}

								// if Estimate header or lineItem has rule, aLL of lineItems or some part of lineItems are also be updated,
								// so there lineItems also need to update to UI, otherwise it will show concurrency exception after you save other lineItems.
								let originalUpdateLines = response.EstLineItems;
								if(response.EstLineItemsUpdatedByRule && response.EstLineItemsUpdatedByRule.length && !(response.EstLineItemToDelete && response.EstLineItemToDelete.length)){
									response.EstLineItems = response.EstLineItems || [];
									_.forEach(response.EstLineItemsUpdatedByRule, function (item){
										response.EstLineItems.push(item);
									});
								}

								if(angular.isArray(response.UserDefinedcolsOfLineItemModified)){
									$injector.get('estimateMainDynamicUserDefinedColumnService').attachUpdatedValueToColumn(response.EstLineItems, response.UserDefinedcolsOfLineItemModified, true);
								}

								if (response.EstimateAllowanceToSave && response.EstimateAllowanceToSave.length) {
									$injector.get('estimateMainStandardAllowancesDataService').updateSuccess(response.EstimateAllowanceToSave);
								}

								if (response.AllowanceMarkUp2CostCodeToSave && response.AllowanceMarkUp2CostCodeToSave.length){
									let responseData = [];
									_.forEach(response.AllowanceMarkUp2CostCodeToSave,function (item) {
										responseData.push(item.AllowanceMarkUp2CostCode);
									});
									$injector.get('estStandardAllowancesCostCodeDetailDataService').updateSuccess(responseData);
								}

								if(Object.hasOwnProperty.call(response, 'EstimatePriceAdjustmentToSave')){
									$injector.get('estimateMainPriceAdjustmentDataService').updateSuccess(response.EstimatePriceAdjustmentToSave);
								}

								data.handleOnUpdateSucceeded(updateData, response, data, true);

								let estimateMainFilterCommon = $injector.get('estimateMainFilterCommon');
								let filterCondition = estimateMainFilterCommon.getAllFilterConditions();
								let isFilterBoq = !!filterCondition.BoqItemFk?.length;

								if (isFilterBoq) {
									// fire method triggers all handlers of the listLoaded event to refresh UI components (grid, etc.) depend on the updated data
									serviceContainer.data.listLoaded.fire();
								}

								response.EstLineItems = originalUpdateLines;

								// clear updateData
								let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
								modTrackServ.clearModificationsInRoot(service);

								// handle updated lineitem and resource user defined price column value
								if(response.UserDefinedcolsOfResourceToUpdate){
									$injector.get('estimateMainResourceDynamicUserDefinedColumnService').handleUpdateDone(response.UserDefinedcolsOfResourceToUpdate);
									if(response.UserDefinedcolsOfResourceToUpdate.UserDefinedColumnValueToUpdate){
										let resourceEntities = _.map(response.EstResourceToSave,'EstResource');
										$injector.get('estimateMainResourceDynamicUserDefinedColumnService').attachDataToColumnFromColVal(resourceEntities, response.UserDefinedcolsOfResourceToUpdate.UserDefinedColumnValueToUpdate, true);
									}
								}
								if(response.UserDefinedcolsOfLineItemToUpdate){
									$injector.get('estimateMainDynamicUserDefinedColumnService').handleUpdateDone(response.UserDefinedcolsOfLineItemToUpdate);
								}
								service.onUpdated.fire();
								if((response.PrjCostCodesToDelete && response.PrjCostCodesToDelete.length > 0) || (response.PrjCostCodesToSave && response.PrjCostCodesToSave.length > 0)){
									estimateMainCommonService.setPrjCostCodes(service.getSelectedProjectId());
								}

								if(response.EstResourceToDelete && response.EstResourceToDelete.length){
									$injector.get('estimateMainPrcItemAssignmentListService').load();
								}

								let prcItemAssignment2Save = !!( response.EstimateMainPrcItemAssignmentsToSave && response.EstimateMainPrcItemAssignmentsToSave.length);
								let prcItemAssignment2delete =!!( response.EstimateMainPrcItemAssignmentsToDelete && response.EstimateMainPrcItemAssignmentsToDelete.length);
								if(prcItemAssignment2Save || prcItemAssignment2delete){
									$injector.get('estimateMainPrcItemAssignmentListService').updatePrcItemAssignment();
								}

								if (response.EstLineItemToDelete && response.EstLineItemToDelete.length) {
									service.load();
								}

								if(response.ParamsNotDeleted && response.ParamsNotDeleted.length){
									estimateParameterFormatterService.clear();
									let params = response.ParamsNotDeleted.map(function(e){
										if(e){return e;}
									}).join(',');
									platformModalService.showMsgBox( params+ ' ' + $translate.instant('estimate.main.infoParamDelete'), 'cloud.common.informationDialogHeader', 'ico-info');
								}

								if(response.EstLineItemQuantityNotDeleted ){
									$injector.get('estimateMainLineItemQuantityService').addUndeletedItems(response.EstLineItemQuantityNotDeleted);
								}

								estimateMainCommonService.collectRule2Deleted(updateData);

								// load the cost group list
								if((response.CostGroupToSave && response.CostGroupToSave.length > 0) ||
									(response.CostGroupToDelete && response.CostGroupToDelete.length > 0)) {
									$injector.get('estimateMainLineItemCostGroupService').load();
								}

								service.updateToolsAfterUpdated.fire();

								if(response.IsReLoadMdlObject) {
									let mdlObjectService = $injector.get('estimateMainLineItem2MdlObjectService');
									let item2MdlObjects = mdlObjectService.getList();
									if (item2MdlObjects.length > 0) {
										mdlObjectService.load();
									}
								}

							},
							handleSelection: function () {
								service.setSelectedLineItem(selectedLineItem);
							},
							mergeAffectedItems: function (affectedItems, data) {
								if (affectedItems && affectedItems.length) {
									angular.forEach(affectedItems, function (item) {
										let index = _.findIndex(data.itemList, {Id: item.Id});
										if (index !== -1) {
											angular.extend(data.itemList[index], item);
										}
									});
									service.gridRefresh();
								}
							},
							collaborationContextProvider: function () {
								if (serviceContainer) {
									const selectedItem = serviceContainer.service.getSelected();
									return {
										area: 'estimate.main',
										context: selectedItem ? `${selectedItem.EstHeaderFk}` : ''
									};
								}
							}
						}
					},
					entitySelection: {supportsMultiSelection: true},
					presenter: {
						list: {
							isDynamicModified: true,
							isInitialSorted: true,
							sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
							incorporateDataRead: function (readData, data) {
								// update the module info
								let project = $injector.get('cloudDesktopPinningContextService').getPinningItem('project.main');
								if (!project){
									service.setSelectedProjectInfo(null);
								}
								let estHeader = $injector.get('cloudDesktopPinningContextService').getPinningItem('estimate.main');
								if (!estHeader){
									service.setSelectedPrjEstHeader(null);
								}

								// DynamicConfigSetUp: 3. Initialize Dynamic  Configuration
								// service.registerDynamicConfiguration(readData.dtos, readData.dynamicColumns, data);

								return incorporateDataRead(readData, data, null);

							},
							initCreationData: function initCreationData(creationData) {
								let selectedItem = serviceContainer.service.getSelected();
								if (selectedItem && selectedItem.Id > 0) {
									creationData.EstHeaderFk = selectedItem.EstHeaderFk;
									creationData.SelectedItem = selectedItem;
									creationData.Currency1Fk = selectedItem.Currency1Fk;
									creationData.Currency2Fk = selectedItem.Currency2Fk;
								}
								else {
									creationData.EstHeaderFk = (selectedEstHeaderFk !== null) ? selectedEstHeaderFk : 1; // TODO:
								}

								service.assignQtyRelationOfLeadingStructures(creationData);

								if (useCreationService) {
									estimateMainCreationService.processItem(creationData);
								}

								if (!creationData.validStructure) {
									creationData.QtyRelFk = null;
								}

								if(selectedProjectInfo){
									creationData.ProjectId = selectedProjectInfo.ProjectId;
									creationData.ProjectName = selectedProjectInfo.ProjectName;
									creationData.ProjectNo = selectedProjectInfo.ProjectNo;
								}
								creationData.EstimationCode = selectedEstHeaderItem ? selectedEstHeaderItem.Code : creationData.EstimationCode;
								creationData.EstimationDescription = selectedEstHeaderItem ? selectedEstHeaderItem.DescriptionInfo : creationData.EstimationDescription;
								creationData.BasUomFk = creationData.BasUomFk ? creationData.BasUomFk : 0;
								creationData.BasUomTargetFk = creationData.BasUomTargetFk ? creationData.BasUomTargetFk : 0;
							},
							handleCreateSucceeded: function (item) {
								item.Info = {type: 'image'};
								item.BoqRootRef = {type: 'integer'};
								item.PsdActivitySchedule = {type: 'code'};
								item.Rule = [];

								let qtyToCalculate = isCalcTotalWithWq ? item.WqQuantityTarget : item.QuantityTarget;
								item.QuantityUnitTarget = item.IsDisabled? 0 : (item.Quantity * item.QuantityFactor1 * item.QuantityFactor2 * item.QuantityFactor3 * item.QuantityFactor4 * item.ProductivityFactor);

								let qtyTarget = item.IsLumpsum ? 1 : qtyToCalculate;
								item.QuantityTotal = estimateMainCommonService.isOptionItemWithoutIT(item) ? 0 : qtyTarget * item.QuantityUnitTarget;

								calculateCurrencies(item);
								setLineItemCurrenciesCreation(item);

								$injector.get('estimateMainColumnConfigService').attachExtendColumnsToLineItem(item, [], $injector.get('estimateMainConfigDetailService').getColumnConfigDetails());


								$injector.get('estimateMainLineItemCharacteristicsService').createDefaultCharacteristics(item);

								let estimateMainBoqService = $injector.get('estimateMainBoqService');
								let boqHeaderList = estimateMainBoqService.getBoqHeaderEntities();
								let boqHeader = _.find(boqHeaderList, {'Id': item.BoqHeaderFk});
								if (boqHeader) {
									item.IsGc = boqHeader.IsGCBoq;
									if(!boqHeader.IsGCBoq){
										let boqSelected = estimateMainBoqService.getSelected();
										item.IsOptional = estimateMainBoqService.IsLineItemOptional(boqSelected);
										item.IsOptionalIT = estimateMainBoqService.IsLineItemOptionalIt(boqSelected);
									}else{
										item.IsDaywork = false;
									}
								}

								// attach empty user defined column value to new item.
								let estimateMainDynamicUserDefinedColumnService = $injector.get('estimateMainDynamicUserDefinedColumnService');
								estimateMainDynamicUserDefinedColumnService.attachEmptyDataToColumn(item);
							}
						}
					},
					useItemFilter: true,
					dataProcessor: [estimateMainLineItemProcessor, new ServiceDataProcessDatesExtension(['FromDate', 'ToDate',]), estMainRuleParamIconProcess],
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: true,
							enhancedSearchVersion: '2.0',
							pattern: '',
							pageSize: 100,
							useCurrentClient: true,
							includeNonActiveItems: false,
							includeReferenceLineItems: true,
							showOptions: true,
							showProjectContext: false,
							pinningOptions: {
								isActive: true,
								showPinningContext: [{token: 'project.main', show: true}, {
									token: 'estimate.main',
									show: true
								}],
								setContextCallback: setCurrentPinningContext
							},
							withExecutionHints: false
						}
					},
					sidebarInquiry: {
						options: sidebarInquiryOptions
					},
					filterByViewer: true,
					translation: {
						uid: 'estimateMainService',
						title: 'estimate.main.lineItemContainer',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo',maxLength : 255},
							{header: 'estimate.main.estAssemblyDescriptionInfo', field: 'EstAssemblyDescriptionInfo',maxLength : 255}],
						dtoScheme: {
							typeName: 'EstLineItemDto',
							moduleSubModule: 'Estimate.Main'
						}
					},
				}
			};

			let packageReferenceLen = 252;

			let onLineItemChanged = new PlatformMessenger(); // line item is changed

			serviceContainer = platformDataServiceFactory.createNewComplete(estimateMainServiceOptions);
			serviceContainer.data.fireSelectionChangedEventAlways = false;
			let service = serviceContainer.service;

			service.Rates = null;

			service.onHighlightFields = new PlatformMessenger();

			service.processItems = function(){
				$injector.get('platformDataServiceDataProcessorExtension').doProcessData(serviceContainer.data.itemList, serviceContainer.data);
			}

			service.registerEntityCreated(registerEntityCreated);
			function registerEntityCreated(e, newEntity){
				// create the cost group reference to the lineitem
				let costGroupsStructureMainDataServiceFactory = $injector.get('costGroupsStructureMainDataServiceFactory');
				let costGroupsStructureMainDataService =costGroupsStructureMainDataServiceFactory.getService();
				if(costGroupsStructureMainDataService && costGroupsStructureMainDataService.assignCostGrpSturcutre2LineItem) {
					costGroupsStructureMainDataService.assignCostGrpSturcutre2LineItem(newEntity);
				}
			}

			service.getConcurrencyConfig = function(){
				return {
					mainService: service,
					mergeInClientSide: true,
					conflictConfigs : [{
						typeName: estimateMainConflictType.LineItem,
						title: 'estimate.main.lineItemContainer',
						configurationService: 'estimateMainStandardConfigurationService',
						dataService: service
					}, {
						typeName: estimateMainConflictType.Resource,
						title: 'estimate.main.resourceContainer',
						configurationService: 'estimateMainResourceConfigurationService',
						dataService: 'estimateMainResourceService'
					}]
				};
			};

			function incorporateDataRead(readData, data, refreshSelectedEntities){
				service.setIsUpdateDataByParameter(false);
				if(readData.packageReferenceLen){
					setPackageReferenceLen(readData.packageReferenceLen);
				}

				$injector.get('estimateMainContextDataService').initialize(readData);

				if(Object.hasOwnProperty.call(readData, 'EstLineItemStatusList')){
					setEstLineItemStatusList(_.get(readData, 'EstLineItemStatusList'));
				}

				$injector.invoke(['basicsLookupdataLookupDescriptorService', function (basicsLookupdataLookupDescriptorService) {
					basicsLookupdataLookupDescriptorService.removeData('estassemblyfk');
					basicsLookupdataLookupDescriptorService.updateData('estassemblyfk', readData.LookupAssemblies);

					basicsLookupdataLookupDescriptorService.removeData('costgroup');

					basicsLookupdataLookupDescriptorService.removeData('estlineitemlookup');
					basicsLookupdataLookupDescriptorService.updateData('estlineitemlookup', readData.dtos);
				}]);

				let prjEstComposite = {};
				if (_.get(readData, 'selectedPrj') && _.get(readData, 'prjEstComposites').length > 0) {
					// Module header title is updated here.
					service.setSelectedProjectInfo(readData.selectedPrj);
					service.updateModuleHeaderInfo();

					var pinnedEstHeader = $injector.get('cloudDesktopPinningContextService').getPinningItem('estimate.main');
					if (pinnedEstHeader) {
						prjEstComposite = _.first(_.get(readData, 'prjEstComposites'));
						// Project Estimate header is set here.
						service.setSelectedPrjEstHeader(prjEstComposite);
					}
				}

				if (Object.hasOwnProperty.call(readData, 'EstStructureDetails')){
					service.setEstConfigData(readData);
				}

				if(Object.hasOwnProperty.call(readData, 'EstRoundingConfigDetails')){
					let estRoundingConfigDetails = _.get(readData, 'EstRoundingConfigDetails');
					$injector.get('estimateMainRoundingDataService').setEstRoundingConfigData(estRoundingConfigDetails);
				}

				if(Object.hasOwnProperty.call(readData, 'EstCopyOptions')){
					let estCopyOptions = _.get(readData, 'EstCopyOptions');
					$injector.get('estimateMainCopySourceCopyOptionsDialogService').setCurrentItem(estCopyOptions);
				}

				estimateMainCommonService.setDynamicColumnsData(readData, serviceContainer.data.dynamicColumns);

				let refreshLineItemStructureContainer = false;
				if(!Object.hasOwnProperty.call(service, 'costGroupCatalogs')){
					refreshLineItemStructureContainer = true;
				}else{
					if(readData.CostGroupCats && service.costGroupCatalogs){
						refreshLineItemStructureContainer = !compareCostGroupCatalog(readData.CostGroupCats, service.costGroupCatalogs);
					}
				}

				$injector.invoke(['basicsCostGroupAssignmentService', function(basicsCostGroupAssignmentService){
					basicsCostGroupAssignmentService.process(readData, service, {
						mainDataName: 'dtos',
						attachDataName: 'LineItem2CostGroups',
						dataLookupType: 'LineItem2CostGroups',
						identityGetter: function identityGetter(entity){
							return {
								EstHeaderFk: entity.RootItemId,
								Id: entity.MainItemId
							};
						}
					});

					refreshStructureContainer(refreshLineItemStructureContainer);
				}]);

				if (Object.hasOwnProperty.call(readData, 'IsCalcTotalWithWQ')){
					isCalcTotalWithWq = _.get(readData, 'IsCalcTotalWithWQ');
				}

				if (Object.hasOwnProperty.call(readData, 'IsWQReadOnly')){
					isWQReadOnly = _.get(readData, 'IsWQReadOnly');
				}

				if (Object.hasOwnProperty.call(readData, 'IsTotalAQBudget')){
					isTotalAQBudget = _.get(readData, 'IsTotalAQBudget');
				}

				if(Object.hasOwnProperty.call(readData, 'DoConsiderDisabledDirect')){
					considerDisabledDirect = _.get(readData, 'DoConsiderDisabledDirect');
				}

				if (Object.hasOwnProperty.call(readData, 'IsBudgetEditable')){
					isBudgetEditable = _.get(readData, 'IsBudgetEditable');
				}

				if (Object.hasOwnProperty.call(readData, 'IsFixedBudgetTotal')){
					isFixedBudgetTotal = _.get(readData, 'IsFixedBudgetTotal');
				}

				if (Object.hasOwnProperty.call(readData, 'LazyLoadCostCode')){
					lazyLoadCostCodeSystemOption = _.get(readData, 'LazyLoadCostCode');
				}

				if (Object.hasOwnProperty.call(readData, 'IsAllowAssemblyTemplateNavigation')){
					isAllowAssemblyTemplateNavigate = _.get(readData, 'IsAllowAssemblyTemplateNavigation');
				}

				if (Object.hasOwnProperty.call(readData, 'Boq2CalcQtySplitMap')){
					estimateMainCommonService.setBoqHeader2Id2SplitQtyList(_.get(readData, 'Boq2CalcQtySplitMap'));
				}

				if (Object.hasOwnProperty.call(readData, 'EquipmentAssemblyCostUnitAlwaysEditable')){
					systemOptionForPlantTypeResource = _.get(readData, 'EquipmentAssemblyCostUnitAlwaysEditable');
				}

				if (Object.hasOwnProperty.call(readData, 'LineItemContextEstHeaderId')){
					LineItemContextEstHeaderId = _.get(readData, 'LineItemContextEstHeaderId');
				}

				if (Object.hasOwnProperty.call(readData, 'isShowPlantAsOneRecord')){
					showPlantAsOneRecord = _.get(readData, 'isShowPlantAsOneRecord');
				}

				// TODO: rework of pinning context needed
				// set pinning contextt
				if (isLoadByPrjFavorites && _.get(readData, 'selectedPrj') && _.get(readData, 'prjEstComposites').length > 0) {
					let projectId = _.get(readData, 'selectedPrj.Id');
					let estHeader = _.get(_.first(_.get(readData, 'prjEstComposites')), 'EstHeader');
					if(estimateMainPinnableEntityService.getPinned() !== estHeader.Id){
						service.onEstHeaderChanged.fire();
					}
					// project favorites are used, we set pinning context
					setEstimateToPinningContext(projectId, estHeader);
					isLoadByPrjFavorites = false;
					// boqFilterOffEvent.fire();
					wicBoqFilterOffEvent.fire();

					let resourceSummaryGrid = platformGridAPI.grids.element('id', '3c17c15475964e4fae3d1e8915a56947');
					if(isLoadByPrjFavorites && estHeader && resourceSummaryGrid && resourceSummaryGrid.instance){
						$injector.get('estimateMainResourceSummaryConfigDataService').onToolsUpdated.fire();
					}
				}

				// set company Context
				estimateMainCommonService.setCompanyContextFk(readData.companyMdcContextFk);

				$injector.get('estimateMainPrjMaterialLookupService').setEstHeaderJobFk(readData.jobFk - 0);

				// refresh the leadingStructure2Rule for formatter
				let estimateRuleFormatterService = $injector.get('estimateRuleFormatterService');
				if(estimateRuleFormatterService){
					estimateRuleFormatterService.refresh();
				}

				let estimateMainParameterValueLookupService = $injector.get('estimateMainParameterValueLookupService');
				estimateMainParameterValueLookupService.clear();

				estimateParamUpdateService.clear();
				$injector.get('estLineItemPrcPackageLookupDataService').clear();

				let estResourceTypeLookupService = $injector.get('estimateMainResourceTypeLookupService');
				if(estResourceTypeLookupService){
					estResourceTypeLookupService.loadLookupData();
				}
				let estimateRuleSequenceLookupService = $injector.get('estimateRuleSequenceLookupService');
				if(estimateRuleSequenceLookupService){
					estimateRuleSequenceLookupService.loadLookupData();
				}

				let basicCustomizeSystemoptionLookupDataService = $injector.get('basicCustomizeSystemoptionLookupDataService');
				if(basicCustomizeSystemoptionLookupDataService){
					// basicCustomizeSystemoptionLookupDataService.setList(readData.SystemOptions); This overwrites the original data
					estimateMainCommonService.setActivateEstIndicator();
				}

				$injector.get('basicsCustomizeQuantityTypeLookupDataService').setList(readData.QuantityTypes);

				service.setSidebarNFavInfo(readData);

				setLineItemCurrencies(readData);

				$injector.get('estimateMainResourceAssemblyLookupService').clear();

				serviceContainer.data.sortByColumn(readData.dtos);

				let moduleName = mainViewService.getCurrentModuleName();
				let constructionSystemProjectInstanceHeaderService = $injector.get('constructionSystemProjectInstanceHeaderService');
				let selectedConstructionSystemInstance = constructionSystemProjectInstanceHeaderService.getSelected();
				let isFilterByCurrentInstance = constructionSystemProjectInstanceHeaderService.getFilterByCurrentInstance();

				let items = readData.dtos;
				if(moduleName === 'estimate.main' && selectedConstructionSystemInstance && isFilterByCurrentInstance) {
					items = _.filter(readData.dtos, function (item) {
						return (item.CosInsHeaderFk === selectedConstructionSystemInstance.Id);
					});
					readData.dtos = items;
					constructionSystemProjectInstanceHeaderService.setFilterByCurrentInstance(false);
				}

				service.setDynamicQuantityColumns(readData.dtos);
				service.setEstiamteReadData(readData);

				service.onDataRead.fire();

				if(refreshSelectedEntities){
					return  readData;
				}

				if(!readData.dtos || !readData.dtos.length){
					// set or reset current PermissionObjectInfo
					if(prjEstComposite && (_.has(prjEstComposite, 'PermissionObjectInfo'))) {
						platformContextService.setPermissionObjectInfo(prjEstComposite.PermissionObjectInfo || null);
					}
				}else{
					_.forEach(readData.dtos, function (item){
						estimateMainCommonService.translateCommentCol(item);
					});
				}

				readData.dtos.forEach(item => {
					item.HasReferenceLineItem = readData.dtos.some(refItem => refItem.EstLineItemFk === item.Id);
				});

				let result = serviceContainer.data.handleReadSucceeded(readData, data);
				estimateMainCommonService.checkDetailFormat(readData.dtos, service);

				selectEstLineItem(result);

				// refresh estimate, cleare assembly cats
				$injector.get('estimateMainAssemblycatTemplateService').clearCategoriesCache();

				$injector.get('estimateMainLineItemSelStatementListService').load();

				let dataFilter = estimateMainFilterService.getFilterRequest();

				if(dataFilter.furtherFilters && dataFilter.furtherFilters.length > 0 ){
					let token = _.find(dataFilter.furtherFilters, {Token: 'FILTER_BY_STRUCTURE:EST_CONFIDENCE_CHECK'});

					if(token && token.Value && token.Value.length > 0){
						service.onHighlightFields.fire(readData.dtos, token.Value);
					}
				}
				return result;
			}

			let baseRefreshEntitiesFromComplete = serviceContainer.service.refreshEntitiesFromComplete;
			serviceContainer.service.refreshEntitiesFromComplete = function (complete){

				// TODO: this is a template solution, if framework fixing can fix this, this need to remove or do some more sence enhancement.  Long Wu
				let resourceMainService = $injector.get('estimateMainResourceService');
				let selectedResources = resourceMainService.getSelectedEntities();
				resourceMainService.setLastSelectedResource(selectedResources);

				// close cost/unit modify popup up window
				$('.ng-scope').each(function (){
					let scope = angular.element(this).scope();
					if(scope.gridId === 'e2661f71d1e24b07958b84ad026023d9'){
						scope.$close(false);
					}
				});

				baseRefreshEntitiesFromComplete(complete);
				let children = service.getChildServices();
				_.forEach(children, function (child){
					if(child && _.isFunction(child.load)){
						child.load();
					}
				});
			};

			let originalOnDeleteDone = serviceContainer.data.onDeleteDone;

			let estConfigData = [];

			let lookupFilter = [
				{
					key: 'costgroupfk-for-line-item',
					serverSide: true,
					fn: function () {
						let currentItem = service.getSelectedEstHeaderItem();
						return 'LineItemContextFk=' + (currentItem ? currentItem.MdcLineItemContextFk : '-1');
					}
				},
				{
					key: 'projectfk',
					serverSide: true,
					fn: function () {
						let id = service.getSelectedProjectId();
						return 'ProjectFk=' + (id);
					}
				},
				{
					key: 'est-controlling-unit-filter',
					serverSide: true,
					serverKey: 'basics.masterdata.controllingunit.filterkey',
					fn: function () {
						return {
							ProjectFk: service.getSelectedProjectId()
						};
					}
				},
				{
					key: 'est-prj-controlling-unit-filter',
					serverSide: true,
					serverKey: 'controlling.structure.prjcontrollingunit.filterkey',
					fn: function () {
						return 'ProjectFk=' + service.getSelectedProjectId();
					}
				},
				{
					key: 'estimate-prj-controlling-unit-filter',
					serverSide: true,
					serverKey: 'controlling.structure.estimate.prjcontrollingunit.filterkey',
					fn: function () {
						return {
							ByStructure: true,
							ExtraFilter: false,
							PrjProjectFk: service.getSelectedProjectId(),
							CompanyFk: platformContextService.getContext().clientId,
							FilterKey: 'controlling.structure.estimate.prjcontrollingunit.filterkey',
							IsProjectReadonly: function () {
								return true;
							},
							IsCompanyReadonly: function (){
								return true;
							}
						};
					}
				},
				{
					key: 'controlling.structure.estimate.prjcontrollingunit.filter',
					serverSide: true,
					serverKey: 'controlling.structure.estimate.prjcontrollingunit.filter',
					fn: function () {
						return {
							ByStructure: true,
							ExtraFilter: false,
							PrjProjectFk: service.getSelectedProjectId(),
							CompanyFk: platformContextService.getContext().clientId,
							FilterKey: 'controlling.structure.estimate.prjcontrollingunit.filter'
						};
					}
				},
				{
					key: 'est-model-object-filter',
					serverSide: false,
					fn: function (item) {
						return item.MdlModelFk || item.ModelFk;
					}
				},
				{
					key:'estimate-main-project-change-common-filter',
					serverSide: true,
					serverKey: 'estimate-main-project-change-common-filter',
					fn:function(/* item */){
						return {
							ProjectFk: service.getSelectedProjectId(),
							IsChangeOrder: false,
							IsProjectChange: true
						};
					}
				},
				{
					key: 'est-lineitem-reference-filter',
					serverSide: true,
					serverKey: 'est-lineitem-reference-filter',
					fn: function (entity) {
						return {
							estHeaderId: entity.EstHeaderFk,
							currentLineItemId:entity.Id
						};
					}
				}
			];

			let sortCodeInfoToSave = [];

			// make the rule controller
			let oldClear = service.clear;

			let boqFilterOffEvent = new Platform.Messenger();
			let wicBoqFilterOffEvent = new Platform.Messenger();

			let lastFilter = null;

			let lineItemsPromise;

			/* Data */
			angular.extend(serviceContainer.data, {
				onDeleteDone: onDeleteDone,
				provideUpdateData: provideUpdateData,
				setGridIdForRest:setGridIdForRest,
				setScope:setScope,

				lineItemsCalculatePromise: null
			});

			/* Service */
			angular.extend(serviceContainer.service, {
				/* Events */
				onUpdated: new Platform.Messenger(),
				onContextUpdated: new Platform.Messenger(),
				onClearItems: new Platform.Messenger(),
				onRefreshLookup: new Platform.Messenger(),
				onEstHeaderChanged: new Platform.Messenger(),
				/* onUpdateProjectData: new Platform.Messenger(), */
				onProjectChanged: new Platform.Messenger(),
				onSortCodeReset: new Platform.Messenger(),
				onDataRead: new Platform.Messenger(),
				onQuantityChanged: new Platform.Messenger(),
				onBoqItesmUpdated: new Platform.Messenger(),
				onEstHeaderSet: new Platform.Messenger(),
				updatePackageAssignment: new Platform.Messenger(),
				onCostGroupCatalogsLoaded : new Platform.Messenger(),
				clearBoqEvent : new Platform.Messenger(),
				updateToolsAfterUpdated: new Platform.Messenger(),

				setEstDefaultSettings: setEstDefaultSettings,

				deleteParamByPrjRule:deleteParamByPrjRule,
				setRuleToDelete:setRuleToDelete,
				getRuleToDelete:getRuleToDelete,

				canCreate: canCreate,
				registerLineItemValueUpdate: registerLineItemValueUpdate,
				unregisterLineItemValueUpdate: unregisterLineItemValueUpdate,
				fireLineItemValueUpdate: fireLineItemValueUpdate,

				getLgmJobId: getLgmJobId,
				getLineItemJobId: getLineItemJobId,
				getUpdateData: getUpdateData,
				getContainerData: getContainerData,
				handleOnCalculationUpdate: handleOnCalculationUpdate,

				deleteItem: deleteItem,
				getSelectedProjectId: getSelectedProjectId,
				setSelectedProjectId: setSelectedProjectId,
				setList: setList,
				getListOfLineItemsWhichTransferDataToActivity: getListOfLineItemsWhichTransferDataToActivity,
				getListOfLineItemsWhichTransferDataNotToActivity: getListOfLineItemsWhichTransferDataNotToActivity,

				getNumberOfLineItems: getNumberOfLineItems,
				activeLoadByNavigation: activeLoadByNavigation,
				updateList: updateList,
				addList: addList,
				fireListLoaded: fireListLoaded,
				setSelectedLineItem: setSelectedLineItem,
				setSelectedPrjEstHeader: setSelectedPrjEstHeader,
				getSelectedEstHeaderItem: getSelectedEstHeaderItem,
				getSelectedEstHeaderId: getSelectedEstHeaderId,
				setSelectedEstHeaderId: setSelectedEstHeaderId,
				getSelectedEstHeaderColumnConfigFk: getSelectedEstHeaderColumnConfigFk,
				setSelectedEstHeaderColumnConfigFk: setSelectedEstHeaderColumnConfigFk,
				getSelectedEstHeaderColumnConfigTypeFk: getSelectedEstHeaderColumnConfigTypeFk,
				getSelectedEstHeaderIsColumnConfig: getSelectedEstHeaderIsColumnConfig,
				getSelectedProjectInfo: getSelectedProjectInfo,
				setSelectedProjectInfo: setSelectedProjectInfo,
				setContext: setContext,
				updateModuleHeaderInfo: updateModuleHeaderInfo,
				setEstimateHeader: setEstimateHeader,
				getProjectId : getProjectId,
				setEstimateProject:setEstimateProject,

				navigateTo: navigateTo,
				navigateToLineItem: navigateToLineItem,
				navigateToLineItemFromScheduling: navigateToLineItemFromScheduling,
				navigateToLineItemFromEstimate: navigateToLineItemFromEstimate,
				navigateToInternalLineItem:navigateToInternalLineItem,
				navigateToLineItemFromBid:navigateToLineItemFromBid,
				navigateToLineItemFromBoq: navigateToLineItemFromBoq,

				setSidebarNFavInfo: setSidebarNFavInfo,

				updateCalculation: updateCalculation,
				setReminder: setReminder,
				getParamSaveReminder: getParamSaveReminder,

				setEstConfigData: setEstConfigData,
				clearEstConfigData: clearEstConfigData,
				registerLookupFilter: registerLookupFilter,
				unregisterLookupFilter: unregisterLookupFilter,

				deepCopy: deepCopy,
				addSortCodeChangeInfo: addSortCodeChangeInfo,
				setDetailsParamReminder: setDetailsParamReminder,
				getDetailsParamReminder: getDetailsParamReminder,
				getGridId: getGridId,
				setGridId: setGridId,
				setCharacteristicColumn: setCharacteristicColumn,
				getCharacteristicColumn: getCharacteristicColumn,
				setDynamicQuantityColumns: setDynamicQuantityColumns,
				setDynamicColumnsLayoutToGrid: setDynamicColumnsLayoutToGrid,

				setMdcCostCodeLookupLoaded: setMdcCostCodeLookupLoaded,
				isMdcCostCodeLookupLoaded: isMdcCostCodeLookupLoaded,
				isDynamicColumnActive: isDynamicColumnActive,

				setDynamicColumns: setDynamicColumns,
				getIsEstimate: getIsEstimate,
				setIsEstimate: setIsEstimate,
				clear: clear,
				loadItem: loadItem,
				clearLookupCache: clearLookupCache,
				clearSelectedProjectInfo:clearSelectedProjectInfo,
				registerBoqFilterOffEvent: registerBoqFilterOffEvent,
				unregisterBoqFilterOffEvent: unregisterBoqFilterOffEvent,
				registerwicBoqFilterOffEvent: registerwicBoqFilterOffEvent,
				unregisterwicBoqFilterOffEvent: unregisterwicBoqFilterOffEvent,
				registerClearBoqEvent : registerClearBoqEvent,
				unregisterClearBoqEvent : unregisterClearBoqEvent,

				extendSearchFilterAssign : extendSearchFilterAssign,

				getLastFilter: getLastFilter,
				getHeaderStatus: getHeaderStatus,
				getInquiryOptions: getInquiryOptions,
				isReadonly: isReadonly,
				isLineItemStatusReadonly: isLineItemStatusReadonly,
				assignQtyRelationOfLeadingStructures: assignQtyRelationOfLeadingStructures,
				assignDefaultLeadingStructures: assignDefaultLeadingStructures,
				isAssignAssemblyInProcess: false,
				getAssemblyLookupSelectedItems: getAssemblyLookupSelectedItems,
				isAssignPlantAssemblyInProcess: false,
				getPlantAssemblyLookupSelectedItems: getPlantAssemblyLookupSelectedItems,

				AssignAssemblyToLineItem: AssignAssemblyToLineItem,
				AssignPlantAssemblyToLineItem: AssignPlantAssemblyToLineItem,
				setLineItemCurrencies: setLineItemCurrencies,

				// Calculate line items on single and multiple selection (also supports bulkEditor update)
				isCalculateInProcess: false,
				getLineItemSelectedItemsToCalculate: getLineItemSelectedItemsToCalculate,
				calculateLineItemAndResource: calculateLineItemAndResource,

				setIsRegisterContextUpdated: setIsRegisterContextUpdated,
				getIsRegisterContextUpdated: getIsRegisterContextUpdated,
				setEstiamteReadData: setEstiamteReadData,
				getEstiamteReadData: getEstiamteReadData,
				setGridIdForRest: setGridIdForRest,
				setScope: setScope,
				setLineItemCurrenciesCreation:setLineItemCurrenciesCreation,
				calculateCurrencies:calculateCurrencies,
				hasCreateUpdatePermission: hasCreateUpdatePermission,
				hasUpdatePermission:hasUpdatePermission,
				setAoTQuantityRelationForWizard:setAoTQuantityRelationForWizard,
				getEstTypeIsTotalWq : getEstTypeIsTotalWq,
				getEstTypeIsWQReadOnly: getEstTypeIsWQReadOnly,
				getEstTypeIsTotalAQBudget: getEstTypeIsTotalAQBudget,
				getEstTypeIsBudgetEditable: getEstTypeIsBudgetEditable,
				deleteEntities : deleteEntities,
				deleteItemsVaildPackage : deleteItemsVaildPackage,
				setDeleteDialogFlag : setDeleteDialogFlag,
				getDeleteDialogFlag : getDeleteDialogFlag,
				loadPermissionByEstHeader:loadPermissionByEstHeader,
				setDoRefreshLS: setDoRefreshLS,
				getDoRefreshLS: getDoRefreshLS,
				getConsiderDisabledDirect: getConsiderDisabledDirect,
				getIsFixedBudgetTotalSystemOption: getIsFixedBudgetTotalSystemOption,
				getLazyLoadCostCodeSystemOption: getLazyLoadCostCodeSystemOption,
				getIsAssemblyTemplateNavigation: getIsAssemblyTemplateNavigation,
				getSystemOptionForPlantTypeResource:getSystemOptionForPlantTypeResource,
				getLineItemContextEstHeaderId:getLineItemContextEstHeaderId,
				getShowPlantAsOneRecordOption: getShowPlantAsOneRecordOption,

				loadCostRisks: loadCostRisks,
				getCostRisks: getCostRisks,
				getCostRisksById: getCostRisksById,
				extendSearchFilter: extendSearchFilter,
				setIsUpdateDataByParameter: setIsUpdateDataByParameter,
				getIsUpdateDataByParameter: getIsUpdateDataByParameter,

				lineItemStructureMarkersChanged: lineItemStructureMarkersChanged,
				doPrepareUpdateCall: doPrepareUpdateCall,
				getEstLineItemStatusList: getEstLineItemStatusList,
				setPackageReferenceLen:setPackageReferenceLen,
				getPackageReferenceLen:getPackageReferenceLen,
				updateItemSelection: updateItemSelection,
				setAAReadonly:setAAReadonly,
				handleOldAllowance:handleOldAllowance,

				setCacheExchangePrjId: setCacheExchangePrjId,
				getCacheExchangePrjId: getCacheExchangePrjId,
				setCharacteristicGridReadOnly:setCharacteristicGridReadOnly,
				clearSelectedItemOnBoqFilter: clearSelectedItemOnBoqFilter,
				getPlantEstimatePriceList:getPlantEstimatePriceList
			});

			function clearBoqLookupCache(){
				$injector.get('basicsLookupdataLookupDescriptorService').removeData('boqItemFk');
				$injector.get('basicsLookupdataLookupDescriptorService').removeData('estBoqHeaders');
			}

			function onEstHeaderChanged() {
				// remove All Filters
				$injector.get('estimateMainFilterService').removeAllFilters();

				// change LineItem Dynamic Fields
				let estMainStandardDynamicService = $injector.get('estimateMainDynamicConfigurationService');
				let estMainCombinedStandardDynamicService = $injector.get('estimateMainCombinedLineItemDynamicConfigurationService');
				if (estMainStandardDynamicService) {
					estMainStandardDynamicService.detachData('estConfig');
					estMainStandardDynamicService.detachData('costGroup');
				}
				if (estMainCombinedStandardDynamicService) {
					estMainCombinedStandardDynamicService.detachData('estConfig');
					estMainCombinedStandardDynamicService.detachData('costGroup');
				}

				// reLoad Container Data
				let estimateMainPriceAdjustmentDataService = $injector.get('estimateMainPriceAdjustmentDataService');
				if (estimateMainPriceAdjustmentDataService) {
					estimateMainPriceAdjustmentDataService.clear();
				}
			}

			service.onContextUpdated.register(service.updateModuleHeaderInfo);
			service.registerListLoadStarted(estimateMainCommonService.resetTotal);
			service.onContextUpdated.register($injector.get('estimateMainObjectSelectorService'));
			service.onEstHeaderChanged.register(onEstHeaderChanged);
			service.onProjectChanged.register($injector.get('estimateMainLookupStateService').clearData);
			service.registerRefreshRequested($injector.get('basicsCommonUserDefinedColumnConfigService').reLoad);
			service.registerRefreshRequested(clearBoqLookupCache);

			service.callRefresh = service.refresh || serviceContainer.data.onRefreshRequested;
			service._risks = null;



			return service;

			/*
			 * B reference to A. if delete A , B will update in server side(set estLineItemFk = null),
			 * and the version fo B will change.
			 * So we need to reload the lineItems
			 * */
			function onDeleteDone(deleteParams, data, response){

				// removeDeleteResourcesFromErrorList(deleteParams.entities);  all resources have been removed at Code-behind, don't need this action

				originalOnDeleteDone(deleteParams, data, response);

				let needToRefresh = false;
				let originalLineItemList = data.getList();

				if(deleteParams && deleteParams.entities && originalLineItemList){
					angular.forEach(deleteParams.entities, function(lineItem){
						if (_.some(originalLineItemList, ['EstLineItemFk', lineItem.Id])){
							_.forEach(originalLineItemList, function(item){
								if(item.EstLineItemFk === lineItem.Id){
									item.EstLineItemFk = null;
								}
							});

						}
					});

					needToRefresh = true;
				}

				$injector.get('estimateMainValidationService').validateLineItemsUniqueCode(deleteParams.entities);

				// remove the user defined column value of deleted line item
				$injector.get('estimateMainDynamicUserDefinedColumnService').clearValueComplete();
				$injector.get('estimateMainResourceDynamicUserDefinedColumnService').clearValueComplete();
				// estimateMainDynamicUserDefinedColumnService.update();

				if(needToRefresh) {
					service.load();
				}
			}
			function provideUpdateData(updateData, estHeaderIdFromCosMain) {
				updateData.IsHandleVersionConflict = true;
				if(service.getIsUpdateDataByParameter()){
					updateData.EntitiesCount =0;
					return;
				}

				updateData.EstHeaderId = service.getSelectedEstHeaderId();

				// skips budget calculation for reference line item
				updateData.SkipCalculationForRefLineItem = true;

				// get estimate rules to  save and delete
				estimateMainRuleUpdateService.updateRuleToSave(updateData, service.getSelectedEstHeaderId(), service.getSelectedProjectId());

				if (estHeaderIdFromCosMain && angular.isNumber(estHeaderIdFromCosMain)) {
					updateData.EstHeaderId = estHeaderIdFromCosMain;
				}
				updateData.fromModule = 'Estimate.Main';

				// get estimate parameters to save and delete
				estimateParamUpdateService.updateParamToSave(updateData, updateData.EstHeaderId);

				updateData.MainItemId = updateData.EntitiesCount > 0 ? service.getIfSelectedIdElse(-1) : updateData.MainItemId;
				if(_.isArray(sortCodeInfoToSave) && sortCodeInfoToSave.length > 0){
					updateData.SortCodeInfoToSave = sortCodeInfoToSave;
				}

				// TODO,when found parameter changed, should collect the estLeadingStructureContext
				// the code how to judge there is parameter changed is need here
				if (updateData.EntitiesCount > 0) {
					let complexLookupService = $injector.get('estimateParameterComplexInputgroupLookupService');
					if (complexLookupService.dataService.getEstLeadingStructureContext) {
						let leadingStructureInfo = complexLookupService.dataService.getEstLeadingStructureContext();
						updateData.EstLeadingStuctureContext = leadingStructureInfo.item;
					}

					if (updateData.CostGroupToSave !== null) {
						angular.forEach(updateData.CostGroupToSave, function (cg) {
							if (updateData.CombinedLineItems !== null) {
								_.forEach(updateData.CombinedLineItems, function (item) {
									if (item['costgroup_' + cg.CostGroupCatFk]) {
										cg.CostGroupFk = item['costgroup_' + cg.CostGroupCatFk];
									}
								});
							}
						});
					}

					if(updateData.CombinedLineItems && updateData.CombinedLineItems.length > 0)
					{
						updateData.confDetail = estimateMainCommonService.collectConfDetailColumnsToSave(updateData.CombinedLineItems, $rootScope.dynColumns);
					}

					if (_.size(updateData.EstLineItems) > 0){

						// Validation error issues
						_.forEach(updateData.EstLineItems, function(estLineItem){
							estLineItem.AdvancedAllowance = estLineItem.AdvancedAllowance || 0;
							estLineItem.AdvancedAllowanceCostUnit = estLineItem.AdvancedAllowanceCostUnit || 0;
						});
					}

					let allowanceMarkUp2CostCodeToSave = updateData.AllowanceMarkUp2CostCodeToSave;
					if(allowanceMarkUp2CostCodeToSave && _.isArray(allowanceMarkUp2CostCodeToSave)){
						_.forEach(allowanceMarkUp2CostCodeToSave, function(itemToSave){
							if(itemToSave.AllowanceMarkUp2CostCode){
								if (itemToSave.AllowanceMarkUp2CostCode.IsCustomProjectCostCode===true){
									itemToSave.AllowanceMarkUp2CostCode.Project2mdcCstCdeFk = itemToSave.AllowanceMarkUp2CostCode.MdcCostCodeFk;
									itemToSave.AllowanceMarkUp2CostCode.MdcCostCodeFk = null;
								}else{
									itemToSave.AllowanceMarkUp2CostCode.Project2mdcCstCdeFk = null;
								}
							}
						});
					}
				}

				if (!updateData.EstLeadingStuctureContext) {
					if (service.getSelected()) {
						updateData.EstLeadingStuctureContext = {
							Id: service.getSelected().Id,
							EstLineItemFk: service.getSelected().Id
						};
					} else {
						updateData.EstLeadingStuctureContext = {EstLineItemFk: -1};
					}
				}

				updateResourcesToSaveAndToDelete(updateData.EstResourceToSave, updateData.EstResourceToDelete);

				// remove the empty model or model object
				updateMdlObjectToSave(updateData.EstLineItem2MdlObjectToSave);

				let estimateMainCommonCopyAssemblyTemplateRuleService = $injector.get('estimateMainCommonCopyAssemblyTemplateRuleService');
				if(estimateMainCommonCopyAssemblyTemplateRuleService.isClearParameterFormatter()){
					estimateParameterFormatterService.clear();
					estimateMainCommonCopyAssemblyTemplateRuleService.resetClearParameterFormatter();
				}

				// get user defined cost(price) value to update
				if(isEstimate){
					let estimateMainDynamicUserDefinedColumnService = $injector.get('estimateMainDynamicUserDefinedColumnService');
					if(estimateMainDynamicUserDefinedColumnService.isNeedUpdate()){
						updateData.UserDefinedcolsOfLineItemToUpdate = estimateMainDynamicUserDefinedColumnService.getUpdateData();
					}

					let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
					if(estimateMainResourceDynamicUserDefinedColumnService.isNeedUpdate()){
						updateData.UserDefinedcolsOfResourceToUpdate = estimateMainResourceDynamicUserDefinedColumnService.getUpdateData();
					}
				}

				if(updateData.EstBoq && updateData.EstBoq.length > 0){
					_.forEach(updateData.EstBoq, function(itemToSave){
						if(itemToSave.BasUomFk === null){
							itemToSave.BasUomFk = 0;
						}
					});
				}

				return updateData;
			}

			/** Service Functions **/
			function loadCostRisks() {
				let deffered = $q.defer();
				let risks = service.getCostRisks();
				if(risks === null || risks.length === 0){
					$http.get(globals.webApiBaseUrl + 'estimate/main/lookup/costrisk')
						.then(function (response) {
							service._risks = [];

							for(let i =0; i < response.data.length; i++){
								let item = response.data[i];
								// eslint-disable-next-line no-prototype-builtins
								if(item.hasOwnProperty('DescriptionInfo')){
									service._risks.push({Id: item.Id, Description: item.DescriptionInfo.Description});
								}
							}
							let basLookupDescService = $injector.get('basicsLookupdataLookupDescriptorService');
							basLookupDescService.removeData('CostRiskSchema');
							basLookupDescService.updateData('CostRiskSchema', service._risks);
							deffered.resolve();
						});
				}else{
					deffered.resolve();
				}

				return deffered.promise;
			}

			function getCostRisks() {
				return service._risks;
			}

			function getCostRisksById(value) {
				let item = {};
				let risks = service.getCostRisks();
				for (let i = 0; i < risks.length; i++) {
					if (risks[i].Id === value) {
						item = risks[i];
						break;
					}
				}
				return item;
			}

			function setEstDefaultSettings(readData){
				// eslint-disable-next-line no-prototype-builtins
				if (readData.hasOwnProperty('isFromSideBar')){
					// From sidebar
					return loadPermissionByEstHeader(readData);
				}
			}

			function loadPermissionByEstHeader(readData) {
				setDoRefreshLS(true);
				let selectEstHeader = $injector.get('estimateProjectService').getSelected();
				let estHeaderId  = selectEstHeader ? selectEstHeader.EstHeader.Id : -1; //
				let gridIdLineItem = '681223e37d524ce0b9bfa2294e18d650';

				// 1. It is called from side bar favorites estimate selection
				if (readData){
					// eslint-disable-next-line no-prototype-builtins
					if (readData.hasOwnProperty('furtherFilters')){
						let estHeaderFilter = _.find(readData.furtherFilters, {Token: 'EST_HEADER'});
						estHeaderId = estHeaderFilter ? estHeaderFilter.Value : -1;
					}
				}

				if (estHeaderId < 0){
					// 2. This is called from estimate page initialization and refresh triggered
					let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
					let estHeaderContext = _.find(cloudDesktopPinningContextService.getContext(), {token: moduleName});
					estHeaderId = estHeaderContext ? estHeaderContext.id : -1;
				}
				if(readData && readData.EstHeader){
					estHeaderId = readData.EstHeader.Id;
				}
				if (estHeaderId < 0){ // multiple headers
					return $q.when();
				}

				let promiseSetDefault = function promiseSetDefault(estHeaderId){
					let defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'estimate/project/getestimatebyid?estHeaderFk=' + estHeaderId).then(function(response){
						let estDefaultSettings = response.data;
						let estHeader = estDefaultSettings.EstHeader;
						$injector.get('estimateMainWicRelateAssemblyService').setDefaultFilterBtn(estDefaultSettings.DefaultFilterOfRelatedAssembliesValue);

						// 1.
						// service.setSidebarNFavInfo(readData);
						// Permission
						isHeaderStatusReadOnly = estDefaultSettings.IsHeaderStatusReadOnly || estDefaultSettings.IsGCOrder || (estHeader && !!estHeader.EstHeaderVersionFk);
						let permissionFlag = isHeaderStatusReadOnly ? permissions.read : false;
						isReadOnlyService = !!isHeaderStatusReadOnly;

						// TODO：Walt
						platformPermissionService.restrict (gridIdLineItem, permissionFlag);


						platformPermissionService.restrict (gridIdLineItem, permissionFlag);

						let descriptor = ['1dd77e2e10b54f2392870a53fcb44982',
							'ecaf41be6cc045588297d5efb9745fe4',
							'75bbd8df20de4a3b8f132bdacbb203f6',
							'c6f28f5792c54dfd91409b16fa2e79a1',
							'4f3dd493c4e145a49b54506af6da02ef',
							'd4d807d4047e439d9ba536d7114e9009',
							'f3044885941741b8a9c0c8eea34fb647',
							'3416213311ef4b078db786669a80735e',
							'204663b245a146b4a23791b950833e61',
							'96e6498b2ffc429dbb1ef2336b45a369',
							'7925d8cdb20b4256a0808620c28d4666',
							'ee8a005db2cb4fccaf4228bb311b56bb',
							'7b1f2a36a94245ecb03dd964e79d2254',
							'5bafbad1e3fe4bc2a7a114e27972795c',
							'72e7c6850eec42e9aca9a0fd831cb7cc',
							'49e56a48a2b5481189f871774a0e641a',
							'a08569edfec7481fa903fc29273d8df5',
							'9719261f74544c80851daf3554c49cdb',
							'f423a7daa8cd474385097af443f3c73f',
							'4265ca844fcb457e83e0fd8fadda115f',
							'e92749dba52e4d6d8e70293530aff5e8'];
						platformPermissionService.restrict (descriptor, permissionFlag);

						let estimateMainStandardAllowancesDataService = $injector.get('estimateMainStandardAllowancesDataService');
						estimateMainStandardAllowancesDataService.processMarkupItem(estHeader,permissionFlag);
						estimateMainStandardAllowancesDataService.setIsReadOnlyContainer(permissionFlag);

						defer.resolve (response);
					});
					return defer.promise;
				};
				return promiseSetDefault(estHeaderId);
			}
			function setDoRefreshLS(value){
				isDoRefreshLD = value;
			}
			function getDoRefreshLS(){
				return isDoRefreshLD;
			}

			function setPackageReferenceLen(value){
				packageReferenceLen = value;
			}

			function getPackageReferenceLen() {
				return packageReferenceLen;
			}

			function getEstLineItemStatusList() {
				return estLineItemStatusList && _.size(estLineItemStatusList) > 0 ? estLineItemStatusList : {};
			}

			function setEstLineItemStatusList(statusList) {
				estLineItemStatusList =  statusList;
			}

			function canCreate() {
				let boqLineTypeFk = $injector.get('estimateMainBoqService').getLineItem();
				if (boqLineTypeFk === 110)
				{
					return false;
				}
				else
				{
					return service.getSelectedEstHeaderId() > 0;
				}
			}

			function registerLineItemValueUpdate(func) {
				onLineItemChanged.register(func);
			}

			function unregisterLineItemValueUpdate(func) {
				onLineItemChanged.unregister(func);
			}

			function fireLineItemValueUpdate(col, item){
				onLineItemChanged.fire(col, item);
			}

			function removeDeleteResourcesFromErrorList(lineItems){
				let estimateMainResourceService = $injector.get('estimateMainResourceService');
				angular.forEach(lineItems, function(lineItem){
					let resources = _.filter(estimateMainResourceService.getList(), { 'EstLineItemFk': lineItem.Id });
					estimateMainResourceService.deleteEntities(resources, true);
				});
			}

			function getLgmJobId(resource){
				if(!resource){return null;}
				if(resource.LgmJobFk){return resource.LgmJobFk;}

				let resources = $injector.get('estimateMainResourceService').getList();

				let parentIds = [];
				function getParent(item){
					return _.find(resources, {Id : item.EstResourceFk, EstLineItemFk : item.EstLineItemFk, EstHeaderFk : item.EstHeaderFk});
				}
				let parent = getParent(resource);
				while(parent){
					if (parentIds.indexOf(parent.Id) !== -1){
						return null;
					}else{
						parentIds.push(parent.Id);
					}
					if(parent.LgmJobFk){return parent.LgmJobFk;}
					parent = getParent(parent);
				}
				let lineItems = service.getList();
				let item = _.find(lineItems, {Id: resource.EstLineItemFk, EstHeaderFk : resource.EstHeaderFk});

				return getLineItemJobId(item);
			}

			function getLineItemJobId(lineItem){
				if(!lineItem){return null;}

				if(lineItem.LgmJobFk){return lineItem.LgmJobFk;}

				let selectedResource = $injector.get('estimateMainResourceService').getSelected();

				if(lineItem && lineItem.LgmJobFk){
					return lineItem.LgmJobFk;
				}else if(selectedResource && selectedResource.LgmJobFk){
					return selectedResource.LgmJobFk;
				}else{
					let headerItem = service.getSelectedEstHeaderItem();
					return headerItem && headerItem.Id === lineItem.EstHeaderFk ? headerItem.LgmJobFk : null;
				}
			}


			function getUpdateData(updateData, estHeaderIdFromCosMain) {
				return serviceContainer.data.provideUpdateData(updateData, estHeaderIdFromCosMain);
			}

			function getContainerData() {
				return serviceContainer.data;
			}

			function handleOnCalculationUpdate(calcData) {
				serviceContainer.data.handleOnUpdateSucceeded(calcData, calcData, serviceContainer.data, true);
			}

			function deleteItem(entity) {
				serviceContainer.data.deleteItem(entity, serviceContainer.data).then(function () {
					service.onUpdated.fire();
				});
			}

			function getSelectedProjectId() {
				return service.getProjectId() || -1;
			}

			function setSelectedProjectId(value){
				selectedEstProject = value;
			}

			function clearSelectedProjectInfo(){
				selectedEstProject = {};
				setSelectedProjectInfo (null);
			}

			function setList(data) {
				serviceContainer.data.itemList = data;
			}

			function getListOfLineItemsWhichTransferDataToActivity(){
				return _.filter( serviceContainer.data.itemList, function(item){
					return item.EstQtyRelActFk === 2 || item.EstQtyRelActFk === 4;
				});
			}

			function getListOfLineItemsWhichTransferDataNotToActivity(){
				return _.filter( serviceContainer.data.itemList, function(item){
					return item.EstQtyRelActFk !== 2 && item.EstQtyRelActFk !== 4;
				});
			}

			function getNumberOfLineItems() {
				return _.size(serviceContainer.data.itemList);
			}

			function activeLoadByNavigation() {
				isLoadByNavigation = true;
			}

			function updateList(updateData, response) {
				estimateMainRuleUpdateService.clear();
				estimateParamUpdateService.clear();
				estimateParameterFormatterService.handleUpdateDone(response);
				estimateRuleFormatterService.handleUpdateDone(response);
				if (response[serviceContainer.data.itemName]) {
					serviceContainer.data.handleOnUpdateSucceeded(updateData, response, serviceContainer.data, true);
				}
			}

			function addList(data) {
				let list = serviceContainer.data.itemList;
				let containerData = serviceContainer.data;
				// Added because format of dates are not updated by platform services
				let platformDataServiceDataProcessorExtension = $injector.get('platformDataServiceDataProcessorExtension');

				if (data && data.length) {
					angular.forEach(data, function (d) {
						let item = _.find(list, {Id: d.Id, EstHeaderFk: d.EstHeaderFk});
						if (item) {
							angular.extend(list[list.indexOf(item)], d);
						} else {
							serviceContainer.data.itemList.push(d);
						}
					});
					angular.forEach(list, function (li) {
						estimateMainLineItemProcessor.processItem(li);
						platformDataServiceDataProcessorExtension.doProcessItem(li, containerData);
					});
				}
			}

			function fireListLoaded() {
				serviceContainer.data.listLoaded.fire();
			}

			function updateItemSelection(selectedItem){
				return service.setSelected({}).then(function(){
					return service.setSelected(selectedItem);
				});
			}

			function setSelectedLineItem(selectedLineItem) {
				if (selectedLineItem && selectedLineItem.Id) {
					serviceContainer.data.selectionAfterSort.fire(selectedLineItem);
				}
			}

			function setSelectedPrjEstHeader(estimateCompositeItem) {
				if (estimateCompositeItem) {
					selectedEstProject = estimateCompositeItem.PrjEstimate;
					selectedEstHeaderItem = estimateCompositeItem.EstHeader;
					estimateMainLookupService.setSelectedProjectId(selectedEstProject.PrjProjectFk);
					estimateMainJobCostcodesLookupService.setSelectedProjectId(selectedEstProject.PrjProjectFk, selectedEstHeaderItem.LgmJobFk);
					estimateMainPrjMaterialLookupService.setProjectId(selectedEstProject.PrjProjectFk);
					estimateRuleFormatterService.setSelectedProject(selectedEstProject.PrjProjectFk);

					if (selectedEstHeaderItem) {
						$injector.get('estimateResourcesSummaryService').setCurrentEstHeaderId(selectedEstHeaderItem.Id);
						selectedEstHeaderFk = selectedEstHeaderItem.Id;
						selectedEstHeaderColumnConfigFk = selectedEstHeaderItem.EstConfigFk;
						selectedEstHeaderColumnConfigTypeFk = selectedEstHeaderItem.EstConfigtypeFk;
						isColumnConfig = selectedEstHeaderItem.IsColumnConfig;
						estimateParameterFormatterService.setSelectedEstHeaderNProject(selectedEstHeaderItem.Id, selectedEstProject.PrjProjectFk);
						estimateRuleFormatterService.setSelectedEstHeaderNProject(selectedEstHeaderItem.Id, selectedEstProject.PrjProjectFk);

						$injector.get('estimateMainResourceDynamicUserDefinedColumnService').setSelectedEstHeader(selectedEstHeaderItem);
					}

					// set or reset current PermissionObjectInfo
					if(estimateCompositeItem && (_.has(estimateCompositeItem, 'PermissionObjectInfo'))) {
						platformContextService.setPermissionObjectInfo(estimateCompositeItem.PermissionObjectInfo || null);
					}

				} else {
					selectedEstProject = selectedEstHeaderItem = selectedEstHeaderFk = null;
					selectedEstHeaderColumnConfigFk = selectedEstHeaderColumnConfigTypeFk = null;
				}
				// enable / disable add button in line item container
				service.onEstHeaderSet.fire();
			}

			function getSelectedEstHeaderItem() {
				return selectedEstHeaderItem;
			}

			function getSelectedEstHeaderId() {
				if (selectedEstHeaderFk<=0 || !selectedEstHeaderFk){
					// 1. This is called from estimate page when browser is reloaded
					let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
					let estHeaderContext = _.find(cloudDesktopPinningContextService.getContext(), {token: moduleName});
					selectedEstHeaderFk = estHeaderContext ? estHeaderContext.id : -1;
				}

				return (selectedEstHeaderFk !== null) ? selectedEstHeaderFk : -1;
			}

			function setSelectedEstHeaderId(headerfk) {
				selectedEstHeaderFk  = headerfk;
			}

			function handlePrcItemAssignments(response) {
				const hasItemsToSave = !!(response.EstimateMainPrcItemAssignmentsToSave && response.EstimateMainPrcItemAssignmentsToSave.length);
				const hasItemsToDelete = !!(response.EstimateMainPrcItemAssignmentsToDelete && response.EstimateMainPrcItemAssignmentsToDelete.length);

				if (hasItemsToSave || hasItemsToDelete) {
					$injector.get('estimateMainPrcItemAssignmentListService').updatePrcItemAssignment();
				}
			}

			function getSelectedEstHeaderColumnConfigFk() {
				return selectedEstHeaderColumnConfigFk;
				// return 2;
			}

			function setSelectedEstHeaderColumnConfigFk(columnConfigFk) {
				selectedEstHeaderColumnConfigFk = columnConfigFk;
			}

			function getSelectedEstHeaderColumnConfigTypeFk() {
				return selectedEstHeaderColumnConfigTypeFk;
			}

			function getSelectedEstHeaderIsColumnConfig() {
				return isColumnConfig;
			}

			function getSelectedProjectInfo() {
				return selectedProjectInfo;
			}

			function getProjectId(){
				let projectId;
				let existProjectContainer = platformGridAPI.grids.exist('713b7d2a532b43948197621ba89ad67a');

				if(!projectId && existProjectContainer){
					// should exist the project container
					let projectMainService = $injector.get('projectMainService');
					let project = projectMainService.getSelected();
					if (project) {
						projectId = project.Id;
					}
				}
				if(!projectId){
					let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
					let item = cloudDesktopPinningContextService.getPinningItem('project.main');
					if (item) {
						projectId = item.id;
					}
				}
				if(!projectId){
					if (selectedEstProject && selectedEstProject.PrjProjectFk) {
						projectId = selectedEstProject.PrjProjectFk;
					} else if (service.getSelectedProjectInfo()) {
						projectId = service.getSelectedProjectInfo().ProjectId;
					}
				}

				return projectId;
			}

			function setSelectedProjectInfo(projectEntity) {
				if (projectEntity) {
					selectedProjectInfo = {
						ProjectNo: projectEntity.ProjectNo,
						ProjectName: projectEntity.ProjectName,
						ProjectId: projectEntity.Id,
						ProjectCurrency: projectEntity.CurrencyFk,
						PrjCalendarId: projectEntity.CalendarFk,
						ProjectLongNo: projectEntity.ProjectLongNo,
						IsEstimateBoqDriven: projectEntity.IsEstimateBoqDriven

					};
				} else {
					selectedProjectInfo = null;
				}
			}

			function setContext(estimateCompositeItem) {
				if (estimateCompositeItem) {
					if (estimateCompositeItem.projectInfo) {
						selectedProjectInfo = estimateCompositeItem.projectInfo;
					}
					if (estimateCompositeItem.PrjEstimate && estimateCompositeItem.PrjEstimate.PrjProjectFk) {
						if (service.getSelectedProjectId() !== estimateCompositeItem.PrjEstimate.PrjProjectFk) {
							estimateMainLookupService.setSelectedProjectId(estimateCompositeItem.PrjEstimate.PrjProjectFk);
							estimateMainJobCostcodesLookupService.setSelectedProjectId(estimateCompositeItem.PrjEstimate.PrjProjectFk, estimateCompositeItem.EstHeader.LgmJobFk);
							// when change to another project, should clear lookup cache
							service.clearLookupCache();
						}
					}
				} else {
					selectedProjectInfo = null;
				}
				setLsumUom();
				service.setSelectedPrjEstHeader(estimateCompositeItem);

				// move to context chagne - lnt
				// service.onContextUpdated.fire();
			}

			function updateModuleHeaderInfo(lineItem) {
				let entityText = '';
				let headerInfo =  {};
				if (selectedProjectInfo) {
					headerInfo.project = {
						// moduleName: 'project.main',
						description: selectedProjectInfo.ProjectLongNo + ' - ' + selectedProjectInfo.ProjectName,
						id: selectedProjectInfo.ProjectId
					};

					if(selectedEstHeaderItem) {
						headerInfo.module = {
							moduleName: 'estimate.main',
							description: selectedEstHeaderItem.Code + ' - ' + selectedEstHeaderItem.DescriptionInfo.Translated,
							id: selectedEstHeaderItem.Id
						};
					}

					if(!_.isEmpty(lineItem)) {
						headerInfo.lineItem = {
							description: lineItem.Code,
							// cssClass: 'font-bold'
						};
					}

					entityText = selectedProjectInfo.ProjectLongNo + ' - ' + selectedProjectInfo.ProjectName;
					entityText += selectedEstHeaderItem ? ' / ' + selectedEstHeaderItem.Code + ' - ' + selectedEstHeaderItem.DescriptionInfo.Translated : '';
					entityText += !_.isEmpty(lineItem) ? ' / ' + lineItem.Code : '';
				}
				cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNameEstimate', headerInfo);
			}

			function setEstimateHeader(item, triggerField) {
				isLoadByNavigation = true;

				let projectId = _.get(item, 'PrjEstimate.PrjProjectFk');
				let estHeader = _.get(item, 'EstHeader');

				if(estimateMainPinnableEntityService.getPinned() !== estHeader.Id){
					service.onEstHeaderChanged.fire();
				}

				service.onProjectChanged.fire();

				setEstimateToPinningContext(projectId, estHeader, triggerField).then(function () {
					service.setContext(item);
					service.load();
				});
			}

			function navigateToLineItemFromEstimate(item, triggerField) {
				$injector.get('projectMainService').update().then(function(){
					service.clear();
					let estLineItemDatas =service.getEstiamteReadData();
					if(estLineItemDatas && estLineItemDatas.dtos){
						estLineItemDatas.dtos = [];
					}

					if(item && item.EstHeader){
						service.setSelectedEstHeaderId(item.EstHeader.Id);
					}
					if(item && item.PrjEstimate){
						service.setSelectedProjectId(item.PrjEstimate);
					}
					if (triggerField === 'Ids' && typeof item.Ids === 'string') {
						const ids = item.Ids.split(',').map(e => parseInt(e));
						item = { EstHeaderFk: ids[0], ProjectFk: item.projectContextId };
						service.setSelectedEstHeaderId(item.EstHeaderFk);
					}

					navigateTo(item, triggerField);
					refreshStructureContainer(true);
				});
			}

			function navigateToLineItemFromBid(item) {
				let execFilter = {
					setLoadByPrjFavorites : true,
					ProjectContextId: item.ProjectFk,
					furtherFilters: [{Token: 'EST_HEADER', Value: item.EstHeaderFk}],
					PKeys: [item.EstHeaderFk],
					isReadingDueToRefresh:false
				};
				clearAllowanceAndMarkupCostCodeContainer(item);
				$injector.get('cloudDesktopSidebarService').onExecuteSearchFilter.fire(null, execFilter);
				selectedLineItem = item;

				// set or reset current PermissionObjectInfo
				if(item && (_.has(item, 'PermissionObjectInfo'))) {
					platformContextService.setPermissionObjectInfo(item.PermissionObjectInfo || null);
				}

				// fix defect 90283,The Estimate still showing the deleted boq items
				service.onContextUpdated.fire('isForNagvitor');

				boqFilterOffEvent.fire();
				estimateMainCostCodeChartDataService.load();
			}

			function navigateTo(item, triggerField) {
				// see #96022 (TODO: navigation in estimate should be reworked)
				let execFilter = {};
				// clear main data
				clear();
				clearAllowanceAndMarkupCostCodeContainer(item);
				if (_.has(item, 'EstHeaderFk') && _.has(item, 'ProjectFk')) {
					execFilter = {
						setLoadByPrjFavorites: true,
						ProjectContextId: item.ProjectFk,
						furtherFilters: [{Token: 'EST_HEADER', Value: item.EstHeaderFk}]
					};
					let estHeader = {Id: item.EstHeaderFk};
					isLoadByNavigation = true;
					setEstimateToPinningContext(item.ProjectFk, estHeader, triggerField, isLoadByNavigation);
					$injector.get('cloudDesktopSidebarService').onExecuteSearchFilter.fire(null, execFilter);
					return;
				}
				if(item && item.EstHeader){
					loadPermissionByEstHeader(item);
				}
				if (triggerField === 'cosMainInstance.Id') {
					selectedConstructionSystemInstance = item.cosInstance;
				}
				else {
					selectedConstructionSystemInstance = null;
				}
				// set or reset current PermissionObjectInfo
				if(item && (_.has(item, 'PermissionObjectInfo'))) {
					platformContextService.setPermissionObjectInfo(item.PermissionObjectInfo || null);
				}

				// fix defect 90283,The Estimate still showing the deleted boq items
				service.onContextUpdated.fire('isForNagvitor');

				setEstimateHeader(item, triggerField);
				selectedEstProject = item.PrjEstimate;
				boqFilterOffEvent.fire();
				estimateMainCostCodeChartDataService.load();
			}

			function navigateToLineItem(item, triggerField) {
				let execFilter = {
					setLoadByPrjFavorites : true,
					ProjectContextId: triggerField.ProjectContextId,
					furtherFilters: [{Token: 'EST_HEADER', Value: triggerField.EstHeaderFk}, {Token: 'EST_LINE_ITEM', Value: triggerField.Id}],
					PageSize : 100,
					PageNumber : 0
				};
				setEstimateProject(triggerField,item);
				clearAllowanceAndMarkupCostCodeContainer(item);
				activeLoadByNavigation();
				selectedLineItem = triggerField;
				selectedEstHeaderFk = triggerField.EstHeaderFk;
				$injector.get('cloudDesktopSidebarService').onExecuteSearchFilter.fire(null, execFilter);
			}

			// write project information when jumping to estimate lineitem
			function setEstimateProject(item,triggerField) {
				isLoadByNavigation = true;
				let projectId = _.get(item, 'ProjectContextId');
				let estHeader = {Id: item.EstHeaderFk};
				item.PrjEstimate = {};
				item.EstHeader = {};
				item.EstHeader.DescriptionInfo =item.DescriptionInfo;
				item.EstHeader.LgmJobFk = item.LgmJobFk;
				item.PrjEstimate.PrjProjectFk = item.ProjectContextId;

				if(estimateMainPinnableEntityService.getPinned() !== estHeader.Id){
					service.onEstHeaderChanged.fire();
				}
				selectedEstProject = item.PrjEstimate;
				service.onProjectChanged.fire();

				// if project changed then clear original master data filter and then reload
				if(projectMainPinnableEntityService.getPinned() !== projectId || triggerField === 'EstHeader.Code'){
					estimateProjectRateBookConfigDataService.clearData();
					estimateProjectRateBookConfigDataService.initData(projectId);
				}

				setEstimateToPinningContext(projectId, estHeader, triggerField, isLoadByNavigation);
			}

			function navigateToLineItemFromScheduling(item) {
				let execFilter = {
					setLoadByPrjFavorites : true,
					ProjectContextId: item.ProjectFk,
					furtherFilters: [{Token: 'EST_HEADER', Value: item.EstHeaderFk}]
				};
				clearAllowanceAndMarkupCostCodeContainer(item);
				$injector.get('cloudDesktopSidebarService').onExecuteSearchFilter.fire(null, execFilter);
				selectedLineItem = item;
			}

			function navigateToLineItemFromBoq(selectedEstimateHeader, selectedBoqItem) {
				//TODO-Estimate-DEV23883 - If there are multiple Estimate Line Items assigned to the BoQ position, then the users should land on the first Estimate line item linked to that BoQ position
				//TODO-Estimate-DEV23883 - Filter line items based on boqheaderfk and boqitemfk(Id). Remove hardcoded values from triggerfield and refactor the further code. Set the selected boqitem in Boqs container in estimate.

				//TODO - Add check for IsEstimateBoqDriven
				var triggerField = {};
				triggerField.EstHeaderFk = selectedEstimateHeader.Id;
				triggerField.ProjectContextId = selectedEstimateHeader.ProjectId;

				let execFilter = {
					setLoadByPrjFavorites : true,
					ProjectContextId: selectedEstimateHeader.ProjectId,
					furtherFilters: [{Token: 'EST_HEADER', Value: triggerField.EstHeaderFk}, {Token: 'EST_LINE_ITEM', Value: triggerField.Id}],
				};
				setEstimateProject(triggerField,selectedBoqItem);
				selectedLineItem = triggerField;
				selectedEstHeaderFk = triggerField.EstHeaderFk;
				$injector.get('cloudDesktopSidebarService').onExecuteSearchFilter.fire(null, execFilter);
				$injector.get('estimateMainBoqService').markersChanged([selectedBoqItem]);
			}

			function navigateToInternalLineItem(item, triggerField) {
				let refLineItemId = item[triggerField.field];
				let list = service.getList();
				let refLineItem = _.find(list, {Id: refLineItemId});
				if(refLineItem){
					service.setSelectedLineItem(refLineItem);
				} else {
					let param = {
						Pattern:'',
						ProjectContextId: item.ProjectFk,
						furtherFilters: [{Token: 'EST_HEADER', Value: item.EstHeaderFk}, {Token: 'EST_LINE_ITEM_IDS', Value: refLineItemId}],
					};
					$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/listfiltered_new',param).then(function (response) {
						service.addList(response.data.dtos);
						service.fireListLoaded();
						service.setSelected({}).then(function () {
							service.setSelected(response.data.dtos[0]);
						});
					});
				}
			}

			function selectEstLineItem(list) {
				// todo, selectedLineItem maybe object{}, and its Id is undefined,,sai
				// eslint-disable-next-line no-prototype-builtins
				if (selectedLineItem && selectedLineItem.hasOwnProperty('Id')) {
					let item = _.find(list, {Id: selectedLineItem.Id});
					service.setSelected(item);
					selectedLineItem = {};
				}
			}

			// This function is designed to handle selection issue of line items when it is filtered by BoQ
			function clearSelectedItemOnBoqFilter() {
				if (serviceContainer.data.selectedItem) {
					serviceContainer.data.selectedItem = null;
				}
			}

			// set Sidebar search and favourites Information
			function setSidebarNFavInfo(info) {
				let prjEstComposites = info.prjEstComposites,
					selPrjEstComposites = _.size(prjEstComposites) === 1 ? prjEstComposites[0] : null,
					prjList = info.ProjectList;

				if (prjEstComposites && prjEstComposites.length) {
					// / TODO: extension for displayMember: currently no support for "displayMember: 'EstimateHeader.DescriptionInfo.Translated'"
					// / as soon as support is available, remove this code
					_.each(prjEstComposites, function (item) {
						item.displayMember = _.get(item, 'EstHeader.DescriptionInfo.Translated', '');
					});

					let setProjectAndContext = function (project, prjEstHeader) {
						service.setSelectedProjectInfo(project);
						service.setContext(prjEstHeader);// compositeItem
					};

					// project favourites / navigation endpoint (from project module)
					// or sidebar search if only one project with only one estimate header available
					if (selPrjEstComposites && !prjList) {
						setProjectAndContext(info.selectedPrj, prjEstComposites[0]);
					}
					// sidebar search with > 1 available estimate headers or even several projects
					else if (!selPrjEstComposites && prjList && _.size(prjEstComposites) > 1) {
						if (isSelectEstimateHeaderDialogEnabled) {
							// show dialog to choose from different projects and its estimate headers
							estimateMainSelectEstimateHeaderDialog.showDialog(prjList, prjEstComposites).then(
								function (result) {
									if (result.Ok) {
										setProjectAndContext(result.project, result.estHeader);
									} else {
										setProjectAndContext(null, null);
									}
								}
							);
						} else {
							// definition: take first estimate header from list
							let project = _.filter(prjList, {Id: prjEstComposites[0].PrjEstimate.PrjProjectFk})[0];
							setProjectAndContext(project, prjEstComposites[0]);
						}
					}
				}
			}

			// pinning context (project, estimate)
			function setEstimateToPinningContext(projectId, estHeader, triggerField, isPing) {
				let estHeaderId = _.get(estHeader, 'Id');

				// if project changed then clear original master data filter and then reload
				if(projectMainPinnableEntityService.getPinned() !== projectId || triggerField === 'EstHeader.Code'){
					estimateProjectRateBookConfigDataService.clearData();
					estimateProjectRateBookConfigDataService.initData(projectId);
					service.clearBoqEvent.fire();
				}

				if ((projectMainPinnableEntityService.getPinned() !== projectId) || (estimateMainPinnableEntityService.getPinned() !== estHeaderId) || isPing) {
					let ids = {};
					estimateMainPinnableEntityService.appendId(ids, estHeaderId);
					projectMainPinnableEntityService.appendId(ids, projectId);
					selectedEstHeaderFk = estHeaderId;
					return estimateMainPinnableEntityService.pin(ids, serviceContainer.service).then(function () {
						service.onContextUpdated.fire(); // the context was changed.
						return true;
					});
				}else {
					return $q.when(false);
				}
			}

			function setCurrentPinningContext(dataService) {
				let curLineItem = dataService.getSelected();

				if (curLineItem) {
					let estHeader = null;
					if (curLineItem.EstimationCode && curLineItem.EstimationDescription) {
						estHeader = {
							Id: curLineItem.EstHeaderFk,
							Code: curLineItem.EstimationCode,
							DescriptionInfo: curLineItem.EstimationDescription
						};
					}
					if(estimateMainPinnableEntityService.getPinned() !== estHeader.Id){
						service.onEstHeaderChanged.fire();
					}
					setEstimateToPinningContext(curLineItem.ProjectFk, estHeader).then(function () {
						service.load();
					});
				}
			}

			// detail formula calculation of line item and resources @server
			function updateCalculation() {
				service.update();
			}

			// reminder always save parameters to
			function setReminder(selected) {
				ruleParamSaveToLevel = selected;
			}

			// reminder always save parameters to
			function getParamSaveReminder() {
				return ruleParamSaveToLevel;
			}

			// setEstConfigData for structure assignment on line item create
			function setEstConfigData(data) {
				estConfigData = [];
				if(data && data.EstStructureDetails && data.EstStructureDetails.length){
					estConfigData = _.sortBy(data.EstStructureDetails, 'Sorting');
				}
			}

			function clearEstConfigData() {
				estConfigData = [];
			}

			function registerLookupFilter() {
				basicsLookupdataLookupFilterService.registerFilter(lookupFilter);
			}

			function unregisterLookupFilter() {
				basicsLookupdataLookupFilterService.unregisterFilter(lookupFilter);
			}

			/**
			 * this function will be called from Sidebar Inquiry container when user presses the "AddSelectedItems" Button
			 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
			 */
			function getSelectedItems() {
				let resultSet = service.getSelectedEntities();
				return createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
			}

			/**
			 * this function will be called from Sidebar Inquiry container when user presses the "AddAllItems" Button
			 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
			 */
			function getResultsSet() {
				let filteredSet = platformGridAPI.filters.items(gridId);
				let resultSet = filteredSet && filteredSet.length ? filteredSet : service.getList();
				return createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
			}

			/**
			 * This function creates a Inquiry Resultset from input resultset (lineitem specific)
			 *
			 * {InquiryItem} containing:
			 *     {  id:   {integer} unique id of type integer
			 *        name: {string}  name of item, will be displayed in inquiry sidebar as name
			 *        description: {string}  description  of item, will be displayed in inquiry sidebar as description
			 *     });
			 *
			 * @param resultSet
			 * @returns {Array} see above
			 */
			function createInquiryResultSet(resultSet) {
				let resultArr = [];
				_.forEach(resultSet, function (item) {
					if (item && item.Id) { // check for valid object
						resultArr.push({
							id: item.Id,
							name: item.Code,
							description: item.DescriptionInfo && item.DescriptionInfo.Description ? item.DescriptionInfo.Description : '',
							estHeaderId: item.EstHeaderFk
						});
					}
				});

				return resultArr;
			}

			// create deep copy as base or reference line item
			function deepCopy(copyAsRef) {
				let showDialog = function showDialog() {
					let modalOptions = {
						headerTextKey: 'estimate.main.infoDeepCopyLineItemHeader',
						bodyTextKey: 'estimate.main.infoDeepCopyLineItemBody',
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);
				};
				if (!service.getIfSelectedIdElse(null)) {
					showDialog();
				} else {
					let containerData = serviceContainer.data;
					let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
					let updateData = modTrackServ.getModifications(service);
					updateData.CopyAsRef = copyAsRef;
					updateData.CopiedLineItems = service.getSelectedEntities();
					updateData.MainItemName = service.getItemName();
					updateData.EstHeaderId = service.getSelectedEstHeaderId();
					updateData.ProjectId = service.getSelectedProjectId();

					let dataTemp = {
						'LineItems': service.getSelectedEntities(),
						'SourceProjectId': service.getSelectedProjectId(),
						'ProjectId': service.getSelectedProjectId(),
						'SourceEstHeaderFk': service.getSelectedEstHeaderId(),
						'EstHeaderFk': service.getSelectedEstHeaderId(),
						'FromAssembly': null,
						'IsCopyLineItems' : true,
						'CopyAsRef':copyAsRef,
						'IsCopyByDragDropSearchWizard': true
					};

					var copyPromise;
					if(copyAsRef){
						updateData.IsLookAtCopyOptions = true;
						copyPromise = $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/deepcopy', updateData);
					} else {
						dataTemp.IsLookAtCopyOptions = true;
						copyPromise = $http.post(globals.webApiBaseUrl + 'estimate/main/wizard/savecopyrequestdata', dataTemp);
					}

					return copyPromise.then(function (response) {
						copyPromise = null;
						let result = response.data;
						result[updateData.MainItemName] = result && result[updateData.MainItemName] && result[updateData.MainItemName].length ? result[updateData.MainItemName] : [];

						let basicsCostGroupAssignmentService = $injector.get('basicsCostGroupAssignmentService');
						basicsCostGroupAssignmentService.attachCostGroupValueToEntity(result.CopiedLineItems, result.EstLineItem2CostGroups, function identityGetter(entity) {
							return {
								EstHeaderFk: entity.RootItemId,
								Id: entity.MainItemId
							};
						},
						'LineItem2CostGroups'
						);

						// Update lineitem and resoruce user defined column value
						if (result && angular.isArray(result.UserDefinedcolsOfLineItemModified)) {
							let estimateMainDynamicUserDefinedColumnService = $injector.get('estimateMainDynamicUserDefinedColumnService');
							estimateMainDynamicUserDefinedColumnService.attachUpdatedValueToColumn(result.CopiedLineItems, result.UserDefinedcolsOfLineItemModified, true);
							estimateMainDynamicUserDefinedColumnService.updateValueList(result.UserDefinedcolsOfLineItemModified);
						}

						if (containerData.itemList.length > 0 && copyAsRef) {
							let sourceRefItem = [];

							updateData.CopiedLineItems.forEach(item => {
								sourceRefItem.push(item.Id);
							});

							containerData.itemList = containerData.itemList.map(item => {
								if (sourceRefItem.includes(item.Id)) {
									return {
										...item,
										HasReferenceLineItem: true
									};
								}
								return item;
							});
						}

						service.addList(result.CopiedLineItems);
						containerData.onUpdateSucceeded(result, containerData, updateData);
						// clear updateData
						modTrackServ.clearModificationsInRoot(service);
						updateData = {};
						service.fireListLoaded();
						// service.setSelectedEntities(copiedItems);
					});
				}
			}

			// add sortcode into ToSave array for update data
			function addSortCodeChangeInfo(scField, item) {
				let codeId = scField.slice(8,-2);
				let sortCodeServiceName = 'estimateMainSortCode' + codeId.toString() + 'LookupDataService';
				let opt = {dataServiceName: sortCodeServiceName, displayMember: 'Code'};
				let field = scField.slice(0, -2),
					value = item[scField],
					scItem = _.find(sortCodeInfoToSave, {Field: field}),
					isExist = _.isNumber(value);
				var maxId = $injector.get(sortCodeServiceName).getMaxId(opt);
				item[scField] = isExist ? item[scField] : maxId + 1;
				item['SortDesc'+codeId.toString()+'Fk'] = item[scField];
				if(!isExist) {
					let scObject = {
						Id: maxId + 1,
						Code: value,
						DescriptionInfo: {
							Description: value,
							Translated: value,
							Modified: false
						}
					};
					if (scItem) {
						$injector.get(sortCodeServiceName).removeItemByCode(opt,scItem.Code);
					}
					$injector.get(sortCodeServiceName).setItem(opt, scObject);
				}
				if (!scItem) {
					sortCodeInfoToSave.push({Field: field, Code: value, IsExist: isExist});
				}
				else{
					_.remove(sortCodeInfoToSave,{Field: field});
					scItem.Code = value;
					sortCodeInfoToSave.push(scItem);
				}
			}

			// reminder always save parameters to
			function setDetailsParamReminder(selectedLevel) {
				detailsParamAlwaysSave = selectedLevel;
			}

			// reminder always save details formula parameters to selected level
			function getDetailsParamReminder() {
				return detailsParamAlwaysSave;
			}

			function getGridId() {
				return gridId;
			}

			function setGridId(gId) {
				gridId = gId;
			}

			function setCharacteristicColumn(colName){
				characteristicColumn = colName;
			}

			function getCharacteristicColumn(){
				return characteristicColumn;
			}

			function setDynamicQuantityColumns(lineItems){
				if(lineItems && lineItems.length){
					let estDynamicQuantityColumnService = $injector.get('estimateMainDynamicQuantityColumnService');
					estDynamicQuantityColumnService.setDynamicQuantityColumns(lineItems);
					// estDynamicQuantityColumnService.updateDynamicQuantityColumns.fire();
				}
			}

			// Only get est config detail columns
			function getEstDynamicColumns(dynamicColumns){
				let dynamicColService = $injector.get('estimateMainDynamicColumnService');

				// Estimate configuration - column configuration details (which will be added to Line Items)
				let estLineItemConfigDetails = dynamicColumns.ColumnConfigDetails || [];

				// Get estimate column config columns
				let estLineItemConfigDetailsColumns = _.values(dynamicColService.generateDynamicColumns(estLineItemConfigDetails));

				// return serviceContainer.data.dynamicColumns;
				return angular.copy(estLineItemConfigDetailsColumns);
			}

			function getDynamicColumnsLayout(dynamicColumns){
				// eslint-disable-next-line no-prototype-builtins
				if (dynamicColumns && dynamicColumns.hasOwnProperty('Characteristics')){
					// Estimate line items characteristics
					let estLineItemCharacteristics = dynamicColumns.Characteristics || [];

					// Get characteristics line items columns
					let estLineItemCharacteristicsColumns = [];
					if(_.size(estLineItemCharacteristics) > 0){
						estLineItemCharacteristicsColumns = estimateMainCommonService.getCharactCols(estLineItemCharacteristics);
					}

					return angular.copy(estLineItemCharacteristicsColumns);
				}
				return [];
			}

			function setDynamicColumnsLayoutToGrid(dynamicColumns){
				let mainViewService = $injector.get('mainViewService');

				let lineItemGridId = '681223e37d524ce0b9bfa2294e18d650';
				let grid = platformGridAPI.grids.element('id', lineItemGridId);
				if (grid && grid.instance){
					let columnsDic = {};
					let columns = platformGridAPI.columns.configuration(lineItemGridId).current;
					// Add dynamic columns
					columns = columns.concat(dynamicColumns);
					_.forEach(columns, function(item){
						if (item.id !== 'indicator'){
							columnsDic[item.id] = item;
						}
					});

					let allColumns = [];

					// Persist column order
					let config = mainViewService.getViewConfig(lineItemGridId);
					if (config) {
						let propertyConfig = config.Propertyconfig || [];
						propertyConfig = parseConfiguration(propertyConfig);

						_.forEach(propertyConfig, function(propertyItem){
							let col = columnsDic[propertyItem.id];
							if (col){
								col.hidden = !propertyItem.hidden; // property config hidden is reversed, so we take their opposite value
								col.pinned = propertyItem.pinned;
								allColumns.push(col);

								// Remove from cache dictionary
								delete columnsDic[propertyItem.id];
							}
						});

						let columnToAddToEnd = [];
						for (let item in columnsDic){
							// eslint-disable-next-line no-prototype-builtins
							if (columnsDic.hasOwnProperty(item)){
								columnToAddToEnd.push(columnsDic[item]);
							}
						}
						allColumns = allColumns.concat(columnToAddToEnd);
					}

					platformGridAPI.columns.configuration(lineItemGridId, angular.copy(allColumns));
					platformGridAPI.grids.resize(lineItemGridId); // persist scroll bars
				}
			}

			function isMdcCostCodeLookupLoaded(){
				return serviceContainer.data.isMdcCostCodeLookupLoaded === true;
			}

			function setMdcCostCodeLookupLoaded(value){
				serviceContainer.data.isMdcCostCodeLookupLoaded = value;
			}

			function isDynamicColumnActive(){
				return serviceContainer.data.isDynamicColumnActive === true;
			}

			function setDynamicColumns(cols){
				let dynamicColumns = [];
				if (_.size(cols) > 0){
					dynamicColumns = _.filter(serviceContainer.data.dynamicColumns, function(col){
						return !(col.id.indexOf('ConfDetail') > -1 || col.id.indexOf('charactercolumn_') > -1 ||  col.id.indexOf('NotAssignedCostTotal') > -1 || col.id.indexOf('costgroup_') > -1 );
					});
					serviceContainer.data.dynamicColumns = dynamicColumns.concat(cols);
				}
			}

			function getIsEstimate(){
				return isEstimate;
			}

			function setIsEstimate(value){
				isEstimate = value;
			}

			function clear() {
				oldClear();
				let estimateRuleComboService = $injector.get('estimateRuleComboService');
				if (estimateRuleComboService) {
					estimateRuleComboService.clear();
				}
			}

			function loadItem(id){
				return service.getItemById(id);
			}

			function setGridIdForRest(gridId) {
				service.gridIdForReset = gridId;
			}

			function setScope(scope) {
				service.parentScope = scope;
			}

			function setLineItemCurrencies(readData){
				let dtos = readData.dtos ? readData.dtos : [];

				let basMultiCurrCommService =  $injector.get('basicsMultiCurrencyCommonService');

				if(dtos.length > 0 ){
					angular.forEach(dtos, function (lineitem) {

						basMultiCurrCommService.setCurrencies(lineitem);

					});

					readData.dtos = dtos;
				}


			}

			function setLineItemCurrenciesCreation(item){

				let basMultiCurrCommService =  $injector.get('basicsMultiCurrencyCommonService');

				basMultiCurrCommService.setCurrencies(item);
			}

			function calculateCurrencies(item){

				let basMultiCurrCommService =  $injector.get('basicsMultiCurrencyCommonService');

				basMultiCurrCommService.calculateMultiCurrencies(item);
			}

			/**
			 * @ngdoc function
			 * @name clearCache
			 * @function
			 * @methodOf estimateMainService
			 * @description this will be called when change the estimate or one estimate destroy
			 */
			function clearLookupCache() {
				$injector.get('estimateMainActivityLookupService').clear();
				$injector.get('estimateMainBoqLookupService').clear();
				$injector.get('estimateMainLocationLookupService').clear();
				$injector.get('estimateMainPrjChangeStatusLookupService').clear();
				$injector.get('estimateMainPrcPackageStatusLookupService').clear();
				estimateMainLookupService.clearCache();
				estimateMainJobCostcodesLookupService.clearCache();
				for(let i=1; i<=10; i++) {
					// let costGroupService = $injector.get('estimateMainCostGroupServiceFactory').getService(i);
					// costGroupService.clear();
					let sortCodeService = $injector.get('estimateMainSortCodesLookupDataService').getService(i);
					sortCodeService.clear();
				}
			}

			function registerBoqFilterOffEvent(callBackFn) {
				boqFilterOffEvent.register(callBackFn);
			}

			function unregisterBoqFilterOffEvent(callBackFn) {
				boqFilterOffEvent.unregister(callBackFn);
			}

			function registerwicBoqFilterOffEvent(callBackFn) {
				wicBoqFilterOffEvent.register(callBackFn);
			}

			function unregisterwicBoqFilterOffEvent(callBackFn) {
				wicBoqFilterOffEvent.unregister(callBackFn);
			}

			function registerClearBoqEvent(callBackFn) {
				service.clearBoqEvent.register(callBackFn);
			}

			function unregisterClearBoqEvent(callBackFn) {
				service.clearBoqEvent.unregister(callBackFn);
			}
			function getLastFilter() {
				return lastFilter;
			}

			function getHeaderStatus(){
				return isHeaderStatusReadOnly;
			}

			function hasCreateUpdatePermission() {
				if(!gridId){
					setGridId('681223e37d524ce0b9bfa2294e18d650');
				}
				return platformPermissionService.hasWrite(gridId) || platformPermissionService.hasCreate(gridId);
			}

			function hasUpdatePermission() {
				return platformPermissionService.hasWrite(gridId);
			}

			function getInquiryOptions(){
				return sidebarInquiryOptions;
			}

			function isReadonly(){
				return isReadOnlyService;
			}

			function isLineItemStatusReadonly(lineItemId, headerId){
				let lineItem = service.getItemById(lineItemId);

				if(lineItem && lineItem.EstHeaderFk === headerId){
					let lineItemStatusList =  getEstLineItemStatusList();

					return getHeaderStatus() || !hasCreateUpdatePermission() || (lineItem.EstLineItemStatusFk ? lineItemStatusList[lineItem.EstLineItemStatusFk] : false);
				}
				return false;
			}

			function  updateMdlObjectToSave(estLineItem2MdlObjectToSave) {
				if (estLineItem2MdlObjectToSave) {
					// Case 1: New modelobject with validation error(empty model or moedelobject) will not be saved and will be removed here
					let modelobjects = angular.copy(estLineItem2MdlObjectToSave);

					_.forEach(modelobjects, function (modelObject) {
						if (!modelObject.MdlModelFk || !modelObject.MdlObjectFk) {
							// Remove modelobject with empty code
							_.remove(estLineItem2MdlObjectToSave, {Id: modelObject.Id});
						}
					});
				}
			}

			function updateResourcesToSaveAndToDelete(estResourcesToSave, estResourcesToDelete){
				estResourcesToSave = estResourcesToSave || [];
				estResourcesToDelete = estResourcesToDelete || [];

				// Prepare
				let estimateMainResourceService = $injector.get('estimateMainResourceService');
				let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
				let estimateMainCompleteCalculationService = $injector.get('estimateMainCompleteCalculationService');
				let cloudCommonGridService = $injector.get('cloudCommonGridService');
				let estimateMainResourceType = $injector.get('estimateMainResourceType');

				let resources = angular.copy(estResourcesToSave);
				let resTypesToValidate = [estimateMainResourceType.CostCode, estimateMainResourceType.Material, estimateMainResourceType.Plant, estimateMainResourceType.PlantDissolved, estimateMainResourceType.Assembly, estimateMainResourceType.SubItem]; // CostCode, Material,Equipment, Assembly and SubItem
				let resFieldToValidate = 'Code';

				let resourcesToRemoveFromCache = _.filter(resources, function(res){
					let resDto = res.EstResource;
					// Created Items without Code assignment will be removed
					return resDto && resTypesToValidate.indexOf(resDto.EstResourceTypeFk) > -1 && (_.isEmpty(resDto[resFieldToValidate]) || platformRuntimeDataService.hasError(resDto, resFieldToValidate)) && resDto.Version === 0;
				});
				let resourcesToRevertFromCache = _.filter(resources, function(res){
					let resDto = res.EstResource;
					return resDto && resTypesToValidate.indexOf(resDto.EstResourceTypeFk) > -1 && platformRuntimeDataService.hasError(resDto, resFieldToValidate) && resDto.Version > 0;
				});

				// Case 1: New resources with validation error(empty Code) will not be saved and will be removed here
				_.forEach(resourcesToRemoveFromCache, function(r){

					let resToSave = _.map(estResourcesToSave, 'EstResource');
					let childrenRelationIds = [];
					let childRelated = _.find(resToSave, { EstResourceFk: r.MainItemId, Version: 0 });

					while (childRelated !== undefined){
						childrenRelationIds.push(childRelated.Id);
						childRelated = _.find(resToSave, { EstResourceFk: childRelated.Id, Version: 0 });
					}
					// Remove children relation
					_.forEach(childrenRelationIds, function(id){
						_.remove(estResourcesToSave,{ MainItemId: id });
					});
					// Remove resource with error
					_.remove(estResourcesToSave,{ MainItemId: r.MainItemId });
				});

				// Case 2: Existing resources were updated and were left with errors
				let resDataOriginal = estimateMainResourceService.getDataOriginal();
				let resDataToUpdate = [];

				_.forEach(resourcesToRevertFromCache, function(r){

					// Revert changes from UI
					let resOriginal = _.find(resDataOriginal, { Id: r.MainItemId });
					let resItemToRevert = estimateMainResourceService.getItemById(r.MainItemId);
					if (resItemToRevert.__rt$data && resItemToRevert.__rt$data.errors) {
						resItemToRevert.__rt$data.errors = null;
					}

					// Keep current resources items and do not revert from original otherwise will mismatch will occur
					if (resOriginal.EstAssemblyFk > 0){
						// Restore composite resources
						let itemCompositeList = [];
						cloudCommonGridService.flatten([resOriginal], itemCompositeList, 'EstResources');
						_.forEach(itemCompositeList, function(c){
							let itemComposite = _.find(estResourcesToDelete,{ Id: c.Id} );
							if (itemComposite){
								_.remove(estResourcesToDelete,{ Id: c.Id });
								estResourcesToSave.push({ MainItemId: c.Id, EstResource: itemComposite });
								estimateMainResourceService.getList().push(itemComposite);
							}
						});
					}else{
						delete resOriginal.EstResources;
					}
					// Restore
					angular.extend(resItemToRevert, resOriginal);

					while (resOriginal !== undefined){
						resDataToUpdate.push(resOriginal);
						resOriginal = _.find(resDataOriginal, { Id: resOriginal.EstResourceFk || 0 });
					}
				});

				// Re-Calculate resources
				if (resDataToUpdate.length > 0){
					let r = resourcesToRevertFromCache[0].EstResource;
					let lineItem = service.getItemById(r.EstLineItemFk);
					let resourceTree = estimateMainResourceService.getTree();
					estimateMainCompleteCalculationService.updateResourcesNew(lineItem, resourceTree);

					// Update to Save
					let resourceList = estimateMainResourceService.getList();
					_.forEach(resDataToUpdate, function(r){
						let resToSave = _.find(estResourcesToSave, { MainItemId: r.Id });
						let resCalculated = _.find(resourceList, { Id: r.Id });

						angular.extend(resToSave.EstResource, resCalculated);
					});
				}

				// Refresh UI for current line item
				if (resourcesToRemoveFromCache.length > 0 || resourcesToRevertFromCache.length > 0){
					let selectedLineItem = service.getSelected() || {};
					let lineItemId = (resourcesToRemoveFromCache.concat(resourcesToRevertFromCache))[0].EstResource.EstLineItemFk;

					// eslint-disable-next-line no-prototype-builtins
					if (selectedLineItem && selectedLineItem.hasOwnProperty('Id') && selectedLineItem.Id === lineItemId){

						// Remove errors from UI
						let resourcesToDelete = _.map(resourcesToRemoveFromCache, 'EstResource');

						let selectedResource = estimateMainResourceService.getSelected() || {};
						estimateMainResourceService.deleteEntities(resourcesToDelete, true);

						// highlight the selected resource if it is reverted
						estimateMainResourceService.setSelected(selectedResource);
					}
				}
			}

			function assignQtyRelationOfLeadingStructures(entityToAssign){
				entityToAssign = entityToAssign || {};
				let availableStructures = estimateMainCreationService.getCreationProcessors();
				entityToAssign.validStructure = false;
				let assignAotQtyRelation = false;

				angular.forEach(estConfigData, function (d) {
					if (!d) {
						return;
					}

					let selectedBoq = null
						,selectedActivity = null
						,selectedLocation = null
						,selectedCu = null
						,selectedProcuStructure = null
						,selectedAssemblyCat = null
						,selectedCostGroup = null
						,costGroupService = null;

					// consider the directional relation type
					switch (d.EstStructureFk) {
						case estimateMainParamStructureConstant.BoQs:// 1 boq
							selectedBoq = $injector.get('estimateMainBoqService').getSelected();
							if (!entityToAssign.validStructure && _.has(availableStructures, 'estimateMainBoqListController') && !!selectedBoq && selectedBoq.Id > 0) {
								takeOverStruct(entityToAssign,d.EstStructureFk, d.EstQuantityRelFk,null,false);
							}
							if (!entityToAssign.DescStructure && !!selectedBoq && selectedBoq.Id > 0) {
								entityToAssign.DescStructure = d.EstStructureFk;
							}
							break;
						case estimateMainParamStructureConstant.ActivitySchedule:// 2 schedule activity
							selectedActivity = $injector.get('estimateMainActivityService').getSelected();
							if (!entityToAssign.validStructure && _.has(availableStructures, 'estimateMainActivityListController') && selectedActivity && selectedActivity.Id > 0) {
								takeOverStruct(entityToAssign,d.EstStructureFk, d.EstQuantityRelFk,null,false);
							}
							if (!entityToAssign.DescStructure && !!selectedActivity && selectedActivity.Id > 0) {
								entityToAssign.DescStructure = d.EstStructureFk;
							}
							break;
						case estimateMainParamStructureConstant.Location:// 3 location
							selectedLocation = $injector.get('estimateMainLocationService').getSelected();
							if (!assignAotQtyRelation && _.has(availableStructures, 'estimateMainLocationListController') && selectedLocation && selectedLocation.Id > 0) {
								takeOverStruct(entityToAssign,d.EstStructureFk, d.EstQuantityRelFk,null,true);
								assignAotQtyRelation = true;
							}
							if (!entityToAssign.DescStructure && !!selectedLocation && selectedLocation.Id > 0) {
								entityToAssign.DescStructure = d.EstStructureFk;
							}
							break;
						case estimateMainParamStructureConstant.Controllingunits:// 4 CTU
							selectedCu = $injector.get('estimateMainControllingService').getSelected();
							if (!entityToAssign.validStructure && _.has(availableStructures, 'estimateMainControllingListController') && selectedCu && selectedCu.Id > 0) {
								takeOverStruct(entityToAssign,d.EstStructureFk, d.EstQuantityRelFk,null,false);
							}
							if (!entityToAssign.DescStructure && !!selectedCu && selectedCu.Id > 0) {
								entityToAssign.DescStructure = d.EstStructureFk;
							}
							break;
						case estimateMainParamStructureConstant.ProcurementStructure:// 5 Procurement-Structure
							selectedProcuStructure = $injector.get('estimateMainProcurementStructureService').getSelected();
							if (!assignAotQtyRelation && _.has(availableStructures, 'estimateMainProcurementStructureService') && selectedProcuStructure && selectedProcuStructure.Id > 0) {
								takeOverStruct(entityToAssign,d.EstStructureFk, d.EstQuantityRelFk,null,true);
								assignAotQtyRelation = true;
							}
							if (!entityToAssign.DescStructure && !!selectedProcuStructure && selectedProcuStructure.Id > 0) {
								entityToAssign.DescStructure = d.EstStructureFk;
							}
							break;
						case estimateMainParamStructureConstant.AssemblyCategoryStructure:// 16 Assembly-Structure
							selectedAssemblyCat = $injector.get('estimateMainAssembliesCategoryService').getSelected();
							if (!assignAotQtyRelation && _.has(availableStructures, 'estimateMainAssemblyCategoryTreeController') && selectedAssemblyCat && selectedAssemblyCat.Id > 0) {
								takeOverStruct(entityToAssign,d.EstStructureFk, d.EstQuantityRelFk,null,true);
								assignAotQtyRelation = true;
							}
							if (!entityToAssign.DescStructure && !!selectedAssemblyCat && selectedAssemblyCat.Id > 0) {
								entityToAssign.DescStructure = d.EstStructureFk;
							}
							break;
						case  estimateMainParamStructureConstant.EnterpriseCostGroup:
						case  estimateMainParamStructureConstant.ProjectCostGroup:
							costGroupService = $injector.get('costGroupsStructureMainDataServiceFactory').getService();
							selectedCostGroup = costGroupService && costGroupService.getHightLightCostGrpStrus ? costGroupService.getHightLightCostGrpStrus() : null;
							if (!assignAotQtyRelation &&_.has(availableStructures, 'costGroupStructureController') && selectedCostGroup && selectedCostGroup.length > 0) {
								assignQtyRelationByCostGroup(entityToAssign);
								assignAotQtyRelation = true;
							}

							if (!entityToAssign.DescStructure && !!selectedCostGroup && selectedCostGroup.Id > 0) {
								entityToAssign.DescStructure = d.EstStructureFk;
							}
							break;
					}
				});


				if (!entityToAssign.validStructure || typeof(entityToAssign.Quantity)=== 'undefined'){
					entityToAssign.Quantity = 1;
					entityToAssign.validStructure = true;
				}
			}

			function assignQtyRelationByCostGroup(entityToAssign, assignAotQtyRelation){
				let configData =_.filter(estConfigData,function(d){
					if(d.EstStructureFk === estimateMainParamStructureConstant.EnterpriseCostGroup || d.EstStructureFk ===  estimateMainParamStructureConstant.ProjectCostGroup){
						return d;
					}
				});

				function getMatchCostGroup(configData,index){
					if(index < configData.length) {
						let costGroupConfig = configData[index];
						if(costGroupConfig){
							let costGroupsStructureMainDataServiceFactory = $injector.get('costGroupsStructureMainDataServiceFactory');
							let costGroupsStructureMainDataService =costGroupsStructureMainDataServiceFactory.getService();
							let hightLightCostGrpStrus = costGroupsStructureMainDataService.getHightLightCostGrpStrus();
							let matchResult = _.filter(hightLightCostGrpStrus,{'CostGroupCode':costGroupConfig.Code});
							if(matchResult && matchResult.length){
								return costGroupConfig;
							}else{
								index++;
								return getMatchCostGroup(configData, index);
							}
						}
					}
				}

				configData = _.sortBy(configData, 'Sorting');
				let index =0;
				let costGroupsStructureMainDataServiceFactory = $injector.get('costGroupsStructureMainDataServiceFactory');
				let costGroupsStructureMainDataService =costGroupsStructureMainDataServiceFactory.getService();
				if(costGroupsStructureMainDataService && costGroupsStructureMainDataService.getHightLightCostGrpStrus) {
					let hightLightCostGrpStrus = costGroupsStructureMainDataService.getHightLightCostGrpStrus();

					if (hightLightCostGrpStrus && hightLightCostGrpStrus.length) {

						let macthCostGroupConfig = getMatchCostGroup(configData, index);

						if (macthCostGroupConfig) {
							if (!assignAotQtyRelation) {
								takeOverStruct(entityToAssign, macthCostGroupConfig.EstStructureFk, macthCostGroupConfig.EstQuantityRelFk, macthCostGroupConfig.Code,true);
							}
						}
					}

				}

			}

			function takeOverStruct(entityToAssign,structFk, qtyRelFk,costGroupStructureCode,isChangeAotRelation) {
				if(isChangeAotRelation){
					entityToAssign.EstQtyTelAotFk = qtyRelFk;
				}
				if(!entityToAssign.validStructure && (qtyRelFk ===1 || qtyRelFk ===4 || qtyRelFk ===6 || qtyRelFk===7)) {
					entityToAssign.QtyTakeOverStructFk = structFk;
					entityToAssign.QtyRelFk = qtyRelFk;
					entityToAssign.CostGroupStructureCode = costGroupStructureCode;
					entityToAssign.validStructure = true;
				}
			}

			function assignDefaultLeadingStructures(entityToAssign){
				entityToAssign = entityToAssign || {};

				let availableStructures = estimateMainCreationService.getCreationProcessors();

				function assignStructure(structure){
					let hasStr = _.has(availableStructures, structure);
					if (hasStr) {
						let lStructureFn = availableStructures[structure];
						if (lStructureFn){
							lStructureFn(entityToAssign);
						}
					}
				}

				// boq
				assignStructure('estimateMainBoqListController');

				// schedule activity
				assignStructure('estimateMainActivityListController');

				// location
				assignStructure('estimateMainLocationListController');

				// CTU
				assignStructure('estimateMainControllingListController');

				// Procurement-Structure
				assignStructure('estimateMainProcurementStructureService');

				// Assembly-Structure
				assignStructure('estimateMainAssemblyCategoryTreeController');

				assignStructure('costGroupStructureController');

			}

			function getAssemblyLookupSelectedItems(entity, assemblySelectedItems, isResolvedFromValidation){
				if(!service.isAssignAssemblyInProcess) {
					service.isAssignAssemblyInProcess = true;
					service.parentScope.isLoading = true;

					if (!_.isEmpty(assemblySelectedItems) && _.size(assemblySelectedItems) >= 1) {

						let assemblyIds = _.map(assemblySelectedItems, 'Id');
						let currentSelectedLineItems = isResolvedFromValidation ? [entity] : service.getSelectedEntities();

						let postData = {
							LineItemCreationData: {
								SelectedItems: currentSelectedLineItems,
								ProjectId: service.getSelectedProjectId(),
								EstHeaderFk: service.getSelectedEstHeaderId()
							},
							AssemblyIds: assemblyIds,
							DragDropAssemlySourceType : $injector.get('estimateMainDragDropAssemblyTypeConstant').AssemblyLookUp,
							// SectionId:
							IsResolvedFromValidation: isResolvedFromValidation,
							IsFromAssemblyLookup: true
						};

						if (!isResolvedFromValidation){
							angular.extend(postData.LineItemCreationData, _.first(currentSelectedLineItems));
						}

						lineItemsPromise = service.AssignAssemblyToLineItem(postData, currentSelectedLineItems, isResolvedFromValidation);


					}
				}
				return lineItemsPromise.then(function(data) {
					let lineitem = _.filter(data, {'Id': entity.Id, 'EstHeaderFk': entity.EstHeaderFk});
					if (lineitem && lineitem.length > 0){
						entity.EstAssemblyFk = lineitem[0].EstAssemblyFk;
						entity.EstAssemblyCatFk = lineitem[0].EstAssemblyCatFk;
						service.markItemAsModified(entity);

						// load the cost group list
						$injector.get('estimateMainLineItemCostGroupService').load();

						return true;
					} else {
						return false;
					}
				});
			}

			function getPlantAssemblyLookupSelectedItems(entity, plantAssemblySelectedItems, isResolvedFromValidation, isTakeOverFromLineItem){
				if(!service.isAssignPlantAssemblyInProcess) {
					service.isAssignPlantAssemblyInProcess = true;
					service.parentScope.isLoading = true;

					if (!_.isEmpty(plantAssemblySelectedItems) && _.size(plantAssemblySelectedItems) >= 1) {
						let plantAssemblyDictionary = $injector.get('estimateMainResourceService').groupEntitiesByPlantFK(plantAssemblySelectedItems);
						let plantAssemblyIds = _.map(plantAssemblySelectedItems, 'Id');
						let plantAssemblyHeaderIds = _.map(plantAssemblySelectedItems, 'EstHeaderFk');
						let currentSelectedLineItems = service.getSelectedEntities();

						// Todo1 select only LineItems of Type Plant Assembly

						let postData = {
							LineItemCreationData: {
								SelectedItems: currentSelectedLineItems,
								ProjectId: service.getSelectedProjectId(),
								EstHeaderFk: service.getSelectedEstHeaderId()
							},
							PlantAssemblyIds: plantAssemblyIds,
							PlantAssemblyHeaderIds: plantAssemblyHeaderIds,
							IsTakeOverFromLineItem: isTakeOverFromLineItem
						};
						if(plantAssemblyDictionary){
							postData.PlantAssemblyDictionary = plantAssemblyDictionary;
						}

						if (!isResolvedFromValidation){
							angular.extend(postData.LineItemCreationData, _.first(currentSelectedLineItems));
						}

						lineItemsPromise = service.AssignPlantAssemblyToLineItem(postData, currentSelectedLineItems, isResolvedFromValidation);
					}
				}
				return lineItemsPromise.then(function(data){
					let lineitem = _.filter(data, {'Id': entity.Id, 'EstHeaderFk': entity.EstHeaderFk});
					if (lineitem && lineitem.length > 0){

						service.markItemAsModified(entity);

						// load the cost group list
						$injector.get('estimateMainLineItemCostGroupService').load();

						return true;
					} else {
						return false;
					}
				});
			}

			function AssignAssemblyToLineItem(postData, currentSelectedLineItems, isResolvedFromValidation){
				if(postData.api ==='copy' && postData.type === 'estWic2Assemblies'){
					// create the cost group reference to the lineitem
					postData = getCostGroupsToSave(postData);
				}else if(postData.IsFromAssemblyLookup) {
					let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
					let updateData = modTrackServ.getModifications(service);
					if (updateData.CostGroupToSave && updateData.CostGroupToSave.length > 0) {
						// get current lineitem new assignment cost group(the cost group have not been updated yet)
						postData.CostGroupToSave = updateData.CostGroupToSave;
					}
					if (updateData.CostGroupToDelete && updateData.CostGroupToDelete.length > 0) {
						postData.CostGroupToDelete = updateData.CostGroupToDelete;
					}
				}

				return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/resolveassembliestolineitem', postData).then(function(response){
					let platformDataServiceDataProcessorExtension = $injector.get('platformDataServiceDataProcessorExtension');
					let platformGridAPI = $injector.get('platformGridAPI');
					let resourcesTreeFromMultiAssembly = response.data.LineItemsTotal || [];

					let data = serviceContainer.data;
					let gridId = '681223e37d524ce0b9bfa2294e18d650';
					let currentSelectedLineItem = null; // It is used at the end to highlight line item

					currentSelectedLineItems = currentSelectedLineItems || [];

					if(resourcesTreeFromMultiAssembly.length>0){
						let processList = function processList(items, level, callBack){
							_.forEach(items, function (item){
								if ( level === 0){
									item.nodeInfo = { collapsed: false, level: level };
								}

								item.RuleAssignment =[];
								item.Rule = [];

								if (callBack){
									callBack(item);
								}
							});
						};

						processList(resourcesTreeFromMultiAssembly, 0, function(item){
							platformDataServiceDataProcessorExtension.doProcessItem(item, data);

							currentSelectedLineItem = _.find(currentSelectedLineItems,{'Id':item.Id});
							if (currentSelectedLineItem){

								item.ProjectName = currentSelectedLineItem.ProjectName;
								item.ProjectNo = currentSelectedLineItem.ProjectNo;
								item.EstimationCode = currentSelectedLineItem.EstimationCode;
								item.EstimationDescription = currentSelectedLineItem.EstimationDescription;

								angular.extend(currentSelectedLineItem, item);
							}else{
								// add item to save
								data.itemList.push(item);
								data.addEntityToCache(item, data);
								data.markItemAsModified(item, data);
							}
						});

						let estLineItems2EstRules = response.data.EstLineItems2EstRules || [];

						let estLineItemsParams = response.data.EstLineItemsParams || [];

						let estPrjRules = response.data.EstPrjRules ||[];

						estimateRuleFormatterService.processData(estLineItems2EstRules);

						estimateRuleFormatterService.setEstLineItems2EstRules('EstLineItems2EstRules',estLineItems2EstRules);

						estimateRuleFormatterService.setEstPrjRules(estPrjRules);

						if(estLineItemsParams && estLineItemsParams.length>0){
							_.forEach(estLineItemsParams,function(litem){
								litem.MainId = litem.Id;
							});
						}
						estimateParameterFormatterService.setEstLineItemsParam('EstLineItemsParam',estLineItemsParams);

						if(response.data.copyBoqItem){
							let output = [];
							$injector.get('cloudCommonGridService').flatten([response.data.copyBoqItem], output, 'BoQItems');
							_.forEach(output, function (boqitem) {
								boqitem.BoqItems = boqitem.BoQItems;
							});
							$injector.get('estimateMainBoqLookupService').addLookupData(output);
						}

						let estimateMainResourceService = $injector.get('estimateMainResourceService');
						// Clear estimate resource modifications
						estimateMainResourceService.clearModifications();

						if (isResolvedFromValidation){ // BulkEditor
							// Add logic after resolved from validation
							estimateMainResourceService.load();
						}else{
							// Refresh the line item grid and load resources
							serviceContainer.data.listLoaded.fire();

							// Highlight is gone but
							// serviceContainer.Data.selectedItem is kept, so we just highlight it instead of deselect and select  service.deselect({}).then(function(){ service.select(resource); })
							if (currentSelectedLineItem){
								let gridLineItem = platformGridAPI.grids.element('id', gridId);
								if (gridLineItem && gridLineItem.instance){
									let rows = gridLineItem.dataView.mapIdsToRows([currentSelectedLineItem.Id]);
									gridLineItem.instance.setSelectedRows(rows);
								}
							}

							// Refresh parameters
							estimateParameterFormatterService.refresh();
						}

						let estimateMainLineItem2MdlObjectService = $injector.get('estimateMainLineItem2MdlObjectService');
						estimateMainLineItem2MdlObjectService.gridRefresh();
					}
					service.isAssignAssemblyInProcess = false;

					service.parentScope.isLoading = false;

					if(response.data.lineItemsNoNeedToUpdate &&  response.data.lineItemsNoNeedToUpdate.length>0 ) {
						if (!isResolvedFromValidation) {
							let platformModalService = $injector.get('platformModalService');
							let modalOptions = {
								headerTextKey: 'estimate.main.assignAssembly.reportTitle',
								templateUrl: globals.appBaseUrl + 'estimate.main/templates/assign-assembly/line-item-assign-assembly-result-report.html',
								iconClass: 'ico-info',
								dataItems: response.data
							};
							platformModalService.showDialog(modalOptions);
						}
					}

					$injector.get('basicsLookupdataLookupDescriptorService').updateData('LineItem2CostGroups', response.data.LineItem2CostGroups);

					if(response.data.lineItemsUpdated && response.data.lineItemsUpdated.length > 0) {
						let lineItemsAdded = [];
						_.forEach(response.data.lineItemsUpdated, function (lineitem) {
							let lineItemNew = _.find(service.getList(), {
								EstHeaderFk: lineitem.EstHeaderFk,
								Id: lineitem.Id
							});
							if (lineItemNew) {
								_.extend(lineItemNew, lineitem);
								lineItemsAdded.push(lineItemNew);
							}
						});

						$injector.get('basicsCostGroupAssignmentService').attachCostGroupValueToEntity(lineItemsAdded, response.data.LineItem2CostGroups, function identityGetter(entity) {
							return {
								EstHeaderFk: entity.RootItemId,
								Id: entity.MainItemId
							};
						},
						'LineItem2CostGroups');

						_.forEach(lineItemsAdded, function (item) {
							let oldItem = service.getItemById(item.Id);
							oldItem.EstAssemblyFkPrjProjectAssemblyFk = item.EstAssemblyFk;
							service.fireItemModified(item);
						});
					}

					// Update lineitem and resoruce user defined column value
					if(response && response.data && angular.isArray(response.data.UserDefinedcolsOfLineItemModified)){
						let updateItemIds = _.map(response.data.lineItemsUpdated,'Id');
						let list = serviceContainer.data.getList();
						let updatedItems = _.filter(list, function(item){
							return updateItemIds.includes(item.Id);
						});

						let estimateMainDynamicUserDefinedColumnService = $injector.get('estimateMainDynamicUserDefinedColumnService');
						estimateMainDynamicUserDefinedColumnService.attachUpdatedValueToColumn(updatedItems, response.data.UserDefinedcolsOfLineItemModified, true);
						estimateMainDynamicUserDefinedColumnService.updateValueList(response.data.UserDefinedcolsOfLineItemModified);
						service.gridRefresh();
					}

					return response.data.lineItemsUpdated;

				}, function(err){
					service.isAssignAssemblyInProcess = false;
					service.parentScope.isLoading = false;
					// eslint-disable-next-line no-console
					console.error(err);
					return [];
				});
			}

			function AssignPlantAssemblyToLineItem(postData, currentSelectedLineItems, isResolvedFromValidation){
				// if(postData.api ==='copy' && postData.type === 'estWic2Assemblies'){

				// create the cost group reference to the lineitem
				postData = getCostGroupsToSave(postData);
				// }

				return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/resolveplantassembliestolineitem', postData).then(function(response){
					let platformDataServiceDataProcessorExtension = $injector.get('platformDataServiceDataProcessorExtension');
					let platformGridAPI = $injector.get('platformGridAPI');
					let resourcesTreeFromMultiAssembly = response.data.LineItemsTotal || [];

					let data = serviceContainer.data;
					let gridId = '681223e37d524ce0b9bfa2294e18d650';
					let currentSelectedLineItem = null; // It is used at the end to highlight line item

					currentSelectedLineItems = currentSelectedLineItems || [];

					if(resourcesTreeFromMultiAssembly.length>0){
						let processList = function processList(items, level, callBack){
							_.forEach(items, function (item){
								if ( level === 0){
									item.nodeInfo = { collapsed: false, level: level };
								}

								item.RuleAssignment =[];
								item.Rule = [];

								if (callBack){
									callBack(item);
								}
							});
						};

						processList(resourcesTreeFromMultiAssembly, 0, function(item){
							platformDataServiceDataProcessorExtension.doProcessItem(item, data);

							currentSelectedLineItem = _.find(currentSelectedLineItems,{'Id':item.Id});
							if (currentSelectedLineItem){

								item.ProjectName = currentSelectedLineItem.ProjectName;
								item.ProjectNo = currentSelectedLineItem.ProjectNo;
								item.EstimationCode = currentSelectedLineItem.EstimationCode;
								item.EstimationDescription = currentSelectedLineItem.EstimationDescription;

								angular.extend(currentSelectedLineItem, item);
							}else{
								// add item to save
								data.itemList.push(item);
								data.addEntityToCache(item, data);
								data.markItemAsModified(item, data);
							}
						});

						let estLineItems2EstRules = response.data.EstLineItems2EstRules || [];

						let estLineItemsParams = response.data.EstLineItemsParams || [];

						let estPrjRules = response.data.EstPrjRules ||[];

						estimateRuleFormatterService.setEstLineItems2EstRules('EstLineItems2EstRules',estLineItems2EstRules);

						estimateRuleFormatterService.setEstPrjRules(estPrjRules);

						if(estLineItemsParams && estLineItemsParams.length>0){
							_.forEach(estLineItemsParams,function(litem){
								litem.MainId = litem.Id;
							});
						}
						estimateParameterFormatterService.setEstLineItemsParam('EstLineItemsParam',estLineItemsParams);

						let estimateMainResourceService = $injector.get('estimateMainResourceService');
						// Clear estimate resource modifications
						estimateMainResourceService.clearModifications();

						if (isResolvedFromValidation){ // BulkEditor
							// Add logic after resolved from validation
							estimateMainResourceService.load();
						}else{
							// Refresh the line item grid and load resources
							serviceContainer.data.listLoaded.fire();

							// Highlight is gone but
							// serviceContainer.Data.selectedItem is kept, so we just highlight it instead of deselect and select  service.deselect({}).then(function(){ service.select(resource); })
							if (currentSelectedLineItem){
								let gridLineItem = platformGridAPI.grids.element('id', gridId);
								if (gridLineItem && gridLineItem.instance){
									let rows = gridLineItem.dataView.mapIdsToRows([currentSelectedLineItem.Id]);
									gridLineItem.instance.setSelectedRows(rows);
								}
							}
						}

						let estimateMainLineItem2MdlObjectService = $injector.get('estimateMainLineItem2MdlObjectService');
						estimateMainLineItem2MdlObjectService.gridRefresh();
					}
					service.isAssignPlantAssemblyInProcess = false;
					service.parentScope.isLoading = false;

					// Todo1 commented code
					/* if(response.data.lineItemsNoNeedToUpdate &&  response.data.lineItemsNoNeedToUpdate.length>0 ) {
						if (!isResolvedFromValidation) {
							let platformModalService = $injector.get('platformModalService');
							let modalOptions = {
								headerTextKey: 'estimate.main.assignAssembly.reportTitle',
								templateUrl: globals.appBaseUrl + 'estimate.main/templates/assign-assembly/line-item-assign-assembly-result-report.html',
								iconClass: 'ico-info',
								dataItems: response.data
							};
							platformModalService.showDialog(modalOptions);
						}
					} */

					$injector.get('basicsLookupdataLookupDescriptorService').updateData('LineItem2CostGroups', response.data.LineItem2CostGroups);

					if(response.data.lineItemsUpdated && response.data.lineItemsUpdated.length > 0) {
						let lineItemsAdded = [];
						_.forEach(response.data.lineItemsUpdated, function (lineitem) {
							let lineItemNew = _.find(service.getList(), {
								EstHeaderFk: lineitem.EstHeaderFk,
								Id: lineitem.Id
							});
							if (lineItemNew) {
								lineItemsAdded.push(lineItemNew);
							}
						});

						$injector.get('basicsCostGroupAssignmentService').attachCostGroupValueToEntity(lineItemsAdded, response.data.LineItem2CostGroups, function identityGetter(entity) {
							return {
								EstHeaderFk: entity.RootItemId,
								Id: entity.MainItemId
							};
						},
						'LineItem2CostGroups');

						_.forEach(lineItemsAdded, function (item) {
							var oldItem = service.getItemById(item.Id);
							// Todo1 check this
							oldItem.EstAssemblyFkPrjProjectAssemblyFk = item.EstAssemblyFk;
							service.fireItemModified(item);
						});
					}

					return response.data.lineItemsUpdated;

				}, function(err){
					service.isAssignPlantAssemblyInProcess = false;
					service.parentScope.isLoading = false;
					// eslint-disable-next-line no-console
					console.error(err);
					return [];
				});
			}

			function getCostGroupsToSave(postData)
			{
				let costGroupsStructureMainDataServiceFactory = $injector.get('costGroupsStructureMainDataServiceFactory');
				let costGroupsStructureMainDataService =costGroupsStructureMainDataServiceFactory.getService();
				if(costGroupsStructureMainDataService && costGroupsStructureMainDataService.getHightLightCostGrpStrus) {
					let costgrps  = costGroupsStructureMainDataService.getHightLightCostGrpStrus();
					_.forEach(costgrps, function (item){
						item.CostGroupCatFk = item.CostGroupCatalogFk;
					});
					postData.CostGroupToSave = costgrps;
				}

				return postData;
			}

			function getLineItemSelectedItemsToCalculate(entity, field, value, isFromBulkEditor){
				if (service.isCalculateInProcess){
					return serviceContainer.data.lineItemsCalculatePromise;
				}else{
					service.isCalculateInProcess = true;

					// Lock container while it calculating
					$injector.get('estimateMainDynamicConfigurationService').showLoadingOverlay();
					$injector.get('estimateMainCombinedLineItemDynamicConfigurationService').showLoadingOverlay();

					// Update fields and then send to server
					// let currentSelectedLineItem = service.getSelected();
					let currentSelectedLineItems = service.getSelectedEntities();

					_.forEach(currentSelectedLineItems, function(item){
						item[field] = value;
					});

					let postData = {
						LineItemCreationData: {
							SelectedItems: currentSelectedLineItems,
							ProjectId: service.getSelectedProjectId(),
							EstHeaderFk: service.getSelectedEstHeaderId(),
							ChangedField: field
						}
					};

					serviceContainer.data.lineItemsCalculatePromise = calculateLineItemAndResource(postData, isFromBulkEditor);
					return serviceContainer.data.lineItemsCalculatePromise;
				}
			}

			function calculateLineItemAndResource(postData, updateOptionalReadonly){
				return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/resolvecalculationlineitem', postData).then(function(response){

					let lineItemsCalculatedResolved = response.data.lineItemsUpdated || [];
					let lineItems = service.getList();
					// let currentSelectedLineItem = service.getSelected();
					// let currentSelectedLineItems = angular.copy(service.getSelectedEntities());

					let processList = function processList(items, callBack){
						_.forEach(items, function (item){
							if (callBack){
								callBack(item);
							}
						});
					};

					processList(lineItemsCalculatedResolved, function(item){
						// platformDataServiceDataProcessorExtension.doProcessItem(item, data);

						let itemToUpdate = _.find(lineItems,{'Id':item.Id});
						if (itemToUpdate){
							item.ProjectName = itemToUpdate.ProjectName;
							item.ProjectNo = itemToUpdate.ProjectNo;
							item.EstimationCode = itemToUpdate.EstimationCode;
							item.EstimationDescription = itemToUpdate.EstimationDescription;

							angular.extend(itemToUpdate, item);

							if(updateOptionalReadonly){
								$injector.get('estimateMainValidationService').validateIsOptional(itemToUpdate, itemToUpdate.IsOptional, 'IsOptional');
							}

							// $injector.get('estimateMainLineItemDetailService').valueChangeCallBack(itemToUpdate, field, value);
						}
					});

					// Update recalculated lineitem and resoruce user defined column value
					if(response && response.data && angular.isArray(response.data.UserDefinedcolsOfLineItemModified)){
						$injector.get('estimateMainDynamicUserDefinedColumnService').attachUpdatedValueToColumn(lineItems, response.data.UserDefinedcolsOfLineItemModified, true);
					}

					// Refresh the line item grid and load resources
					// serviceContainer.data.listLoaded.fire();
					service.gridRefresh();

					// Highlight is gone but
					// serviceContainer.Data.selectedItem is kept, so we just highlight it instead of deselect and select  service.deselect({}).then(function(){ service.select(resource); })

					// reload resources
					let resourceContainerGridId = 'bedd392f0e2a44c8a294df34b1f9ce44';
					if (platformGridAPI.grids.exist(resourceContainerGridId)) {
						let selectedLineItem = service.getSelected();
						let estimateMainResourceService = $injector.get('estimateMainResourceService');
						if (selectedLineItem && selectedLineItem.EstLineItemFk > 0) {
							let estimateMainRefLineItemService = $injector.get('estimateMainRefLineItemService');
							estimateMainRefLineItemService.getRefBaseResources(selectedLineItem, false, true).then(function (resList) {
								// calculate(resList, true);
								estimateMainResourceService.updateList(resList, true);

								// get and set resource characteristics
								let resCharsService = $injector.get('estimateMainResourceCharacteristicsService');
								resCharsService.getResourceCharacteristicsByLineItem(selectedLineItem.EstHeaderFk, selectedLineItem.EstLineItemFk).then(function(response){
									resCharsService.setDynamicColumnsLayout({ dynamicColumns: { Characteristics: response.data}, dtos: resList });
								});

								let defer = $q.defer();
								$injector.get('estimateMainResourceDetailService').setResourcesBusinessPartnerName(selectedLineItem, resList).then(function () {
									if(resList && resList.length > 0) {
										let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
										if(response && response.data && angular.isArray(response.data.UserDefinedcolsOfResourceModified)){
											$injector.get('estimateMainResourceDynamicUserDefinedColumnService').updateValueList(resList, response.data.UserDefinedcolsOfResourceModified);
											estimateMainResourceDynamicUserDefinedColumnService.calculateResources(selectedLineItem, resList);
										}
									}

									defer.resolve(estimateMainResourceService.gridRefresh());
								});
								return defer.promise;
							});
						}
						else {
							estimateMainResourceService.load();
						}
					}

					// Unlock container when calculation is done
					$injector.get('estimateMainDynamicConfigurationService').hideLoadingOverlay();
					$injector.get('estimateMainCombinedLineItemDynamicConfigurationService').hideLoadingOverlay();

					service.isCalculateInProcess = false;
				}, function(err){
					if(err && err.status === 409){
						// remove loading icon
						$('.ng-scope').each(function (){
							let scope = angular.element(this).scope();
							if(scope.gridId === '681223e37d524ce0b9bfa2294e18d650' || scope.gridId === 'bedd392f0e2a44c8a294df34b1f9ce44'){
								scope.isLoading = false;
							}
						});
					}
					service.isCalculateInProcess = false;
					// eslint-disable-next-line no-console
					console.log(err);
					return [];
				});
			}

			function setAoTQuantityRelationForWizard(param){
				_.forEach(estConfigData, function(d) {
					if(d.EstStructureFk === estimateMainParamStructureConstant.EnterpriseCostGroup || d.EstStructureFk ===  estimateMainParamStructureConstant.ProjectCostGroup){
						if(d.EstStructureFk === param.EstStructureId && d.Code === param.StructureName){
							param.EstQtyTelAotFk = d.EstQuantityRelFk;
						}
					}else if(param.StructureId === d.EstStructureFk){
						param.EstQtyTelAotFk = d.EstQuantityRelFk;
					}
				});
			}

			function setIsRegisterContextUpdated(value){
				isRegisterContextUpdated = value;
			}

			function getIsRegisterContextUpdated(){
				return isRegisterContextUpdated;
			}

			function setEstiamteReadData(readData){
				estiamteReadData = readData;
			}

			function getEstiamteReadData(){
				return estiamteReadData;
			}

			/** Private Functions **/
			function resourceReadFunction(data, readData, onReadSucceeded){
				if(!readData.PinningContext){
					readData.PinningContext = $injector.get('cloudDesktopSidebarService').getFilterRequestParams().PinningContext;

					if(readData.PinningContext) {
						let estimateContext = _.find(readData.PinningContext, {'token': 'estimate.main'});
						let furtherFilterEstimateToken = _.find(readData.furtherFilters, {'Token': 'EST_HEADER'});
						if(furtherFilterEstimateToken && estimateContext){
							$injector.get('cloudDesktopPinningContextService').clearPinningItem('estimate.main');
						}
					}
				}
				let httpReadLineItemPromise = $http({
					url: estimateMainServiceOptions.flatRootItem.httpRead.route + estimateMainServiceOptions.flatRootItem.httpRead.endRead,
					method: estimateMainServiceOptions.flatRootItem.httpRead.usePostForRead ? 'POST': 'GET',
					data: readData
				});
				let promises = [];
				// 1. Set estimate default settings
				promises.push(setEstDefaultSettings(readData));
				// 2. Retrieve estimate line items
				promises.push(httpReadLineItemPromise);

				estimateParameterFormatterService.refresh();

				return $q.all(promises).then(function (response) {
					let responseEstHeader = response[0];
					let responseLineItem = response[1];

					let responseEstHeaderData = responseEstHeader ? responseEstHeader.data : {};
					let responseLineItemData = responseLineItem ? responseLineItem.data : {};


					handleBeforeEstHeaderResponse(responseEstHeaderData);
					handleBeforeLineItemResponse(responseLineItemData);

					let pers = [];
					if(responseLineItemData.dtos){
						let refLineItemReadData = [];
						_.forEach(responseLineItemData.dtos, function (dto){
							if(dto.EstLineItemFk && dto.EstLineItemFk > 0){
								refLineItemReadData.push({
									EstHeaderFk : dto.EstHeaderFk,
									Id : dto.EstLineItemFk
								});
							}
						});

						// Collect reference lineitem
						if(refLineItemReadData.length > 0){
							let estimateMainLineItemDialogService = $injector.get('estimateMainLineItemDialogService');
							pers.push(estimateMainLineItemDialogService.loadDataByRefLineItemIds(refLineItemReadData));
						}

					}else{
						pers.push($q.when(''));
					}

					$q.all(pers).then(function (){
						if(onReadSucceeded.name === 'onReloadSucceeded'){
							responseLineItemData = incorporateDataRead(responseLineItemData, data, readData);

							// 1: remove some deleted entities those have been deleted by other user.
							// 2: merge new entity to UI grid
							if(!!readData && !!readData.PKeys && readData.PKeys.length > 0){
								let oldEntities = service.getList();
								for(let i=0; i<readData.PKeys.length; i++){
									let newEntity = _.find(responseLineItemData.dtos, {Id: readData.PKeys[i]});
									let oldEnttiy = _.find(oldEntities, {Id: readData.PKeys[i]});

									// if newEntity is empty, it means this entity has been deleted by other user
									if(!newEntity){
										data.moveItem([oldEnttiy]);
									}else{
										oldEnttiy.Rule = null;
										oldEnttiy.RuleAssignment = null;
										oldEnttiy.Param = null;
									}
								}
							}
						}

						onReadSucceeded(responseLineItemData, data);
					});
				});
			}

			function handleBeforeEstHeaderResponse(){
				// Add logic here
			}

			function handleBeforeLineItemResponse(data) {
				// Add logic here
				let estMainStandardDynamicService = $injector.get('estimateMainDynamicConfigurationService');
				let estMainCombinedStandardDynamicService = $injector.get('estimateMainCombinedLineItemDynamicConfigurationService');

				let dynCols = [];
				// 1. Estimate configuration details
				let estimateMainConfigDetailService = $injector.get('estimateMainConfigDetailService');
				// Set ColumnIds lookup data to generate dynamic column in Line Items grid
				if (data && Object.prototype.hasOwnProperty.call(data, 'dynamicColumns')) {
					estimateMainConfigDetailService.setInfo({DynamicColumns: data.dynamicColumns.DynamicColumns});

					estimateMainConfigDetailService.setInfo({Main: data.dynamicColumns.ColumnConfigDetails});
				}

				if (Object.prototype.hasOwnProperty.call(data, 'isEstDynamicColumnActive') && data.isEstDynamicColumnActive === true) {
					let estConfigColumns = getEstDynamicColumns(data.dynamicColumns);
					$rootScope.dynColumns = estConfigColumns;
					estMainStandardDynamicService.attachData({estConfig: estConfigColumns});
					angular.forEach(estConfigColumns, function (item) {
						if (item.toolTip === 'Cost Total') {
							item.editor = 'money';
						}
					}
					);
					estMainCombinedStandardDynamicService.attachData({estConfig: estConfigColumns});
					dynCols = dynCols.concat(estConfigColumns);

				}
				// 2. Characteristics columns to add
				let estCharacteristicsColumns = getDynamicColumnsLayout(data.dynamicColumns);
				estMainStandardDynamicService.attachData({estCharacteristics: estCharacteristicsColumns});
				estMainCombinedStandardDynamicService.attachData({estCharacteristics: estCharacteristicsColumns});
				dynCols = dynCols.concat(estCharacteristicsColumns);

				// 3 cost group column
				let costGroupColumns = [];
				if(service.costGroupService){
					let costGroupGenerated = estMainStandardDynamicService.attachCostGroup(data.CostGroupCats, service.costGroupService);
					if(costGroupGenerated && _.isArray(costGroupGenerated.costGroupColumnsForList)){
						costGroupColumns = costGroupGenerated.costGroupColumnsForList;
					}
				}else {
					costGroupColumns = $injector.get('basicsCostGroupAssignmentService').createCostGroupColumns(data.CostGroupCats, false);
					estMainStandardDynamicService.attachData({costGroup: costGroupColumns});
				}

				estMainCombinedStandardDynamicService.attachData({costGroup: costGroupColumns});
				dynCols = dynCols.concat(costGroupColumns);

				// 4 quantity dynamic columns
				service.setDynamicQuantityColumns(data.dtos);
				let quantityTypeColumns = $injector.get('estimateMainDynamicQuantityColumnService').getDynamicQuantityColumns();
				estMainStandardDynamicService.attachData({quantityType: quantityTypeColumns});
				estMainCombinedStandardDynamicService.attachData({quantityType: quantityTypeColumns});
				dynCols = dynCols.concat(quantityTypeColumns);

				// TODO-VICTOR:Add CostGroup Validation
				let validationService = $injector.get('estimateMainValidationService');
				_.forEach(_.filter(costGroupColumns, {bulkSupport: true}), function (costGroup) {
					validationService['validate' + costGroup.field] = validationService['validate' + costGroup.field + 'ForBulkConfig'] = function (entity, value, field, isBulkEditor) {
						if (isBulkEditor) {
							entity[field] = value;
							service.costGroupService.createCostGroup2Save(entity, costGroup);
						}
						return true;
					};
				});

				// Add async validation to cost group columns
				_.forEach(costGroupColumns, function (costGroup) {
					validationService['asyncValidate' + costGroup.field] = costGroup.asyncValidator = function (destItem, value, model) {

						let platformDataValidationService = $injector.get('platformDataValidationService');
						let asyncMarker = platformDataValidationService.registerAsyncCall(destItem, value, model, service);

						// get the CostGroupCatFk from column
						let index = model.indexOf('_');
						let substring = model.substring(index + 1);
						let costGroupCatFk = parseInt(substring);

						let result = {apply: true, valid: true, error: ''};
						let isProjectCostGroup;
						let structureFk;
						let costGroupPromise = null;
						let costGroupCatalogs = $injector.get('basicsLookupdataLookupDescriptorService').getData('costGroupCatalogs');
						if (costGroupCatalogs && _.size(costGroupCatalogs) > 0) {
							let prjCostGroup = _.filter(costGroupCatalogs, function (item) {
								return item.ProjectFk && !item.LineItemContextFk;
							});

							isProjectCostGroup = _.filter(prjCostGroup, {Id: costGroupCatFk});
							if (isProjectCostGroup.length >= 1) {
								structureFk = $injector.get('estimateMainParamStructureConstant').ProjectCostGroup;
							} else {
								structureFk = $injector.get('estimateMainParamStructureConstant').EnterpriseCostGroup;
							}
						}

						let costGroupCol = {};
						costGroupCol.field = model;
						costGroupCol.costGroupCatId = costGroupCatFk;

						destItem[model] = value;

						asyncMarker.myPromise = $injector.get('estimateMainLineItemCostGroupService').createCostGroup2Save(destItem, costGroupCol).then(function () {
							// if combined lineitems, only create costgroup to save, no need to set quantity and uom, no need to calculate
							if (value === null || (destItem.CombinedLineItems && destItem.CombinedLineItems.length > 0)) {
								return $q.when(true);
							} else {
								return $injector.get('estimateMainConfigCostGroupLookupService').getCostGroupById(value).then(function (costGroupItem) {
									return $injector.get('estimateMainValidationService').updateByEstConfigSorting(result, costGroupPromise, destItem, value, model, costGroupItem, structureFk).then(function (response) {
										return platformDataValidationService.finishAsyncValidation(response, destItem, value, model, asyncMarker, service.costGroupService, service);
									});
								});
							}
						});

						return asyncMarker.myPromise ? asyncMarker.myPromise : $q.when(true);
					};
				});

				// Update grid layout if there are dynamic columns
				if (dynCols.length > 0) {
					// Gather all the columns
					serviceContainer.data.dynamicColumns = dynCols;

					// Set all columns to Line Items grid layout
					estMainStandardDynamicService.fireRefreshConfigLayout();
					estMainCombinedStandardDynamicService.fireRefreshConfigLayout();
				}
			}

			function extendSearchFilter(filterRequest) {
				if(selectedLineItem && selectedEstHeaderFk === -1){
					selectedEstHeaderFk = selectedLineItem.EstHeaderFk;
				}
				if(filterRequest.PinningContext ) { // && _.find(filterRequest.PinningContext, {'token': 'estimate.main'})
					filterRequest.furtherFilters = (!filterRequest.furtherFilters || !filterRequest.furtherFilters.length) && selectedEstHeaderFk !== null ? [{
						Token: 'EST_HEADER',
						Value: selectedEstHeaderFk
					}] : filterRequest.furtherFilters;
				}

				if(selectedLineItem && filterRequest.PinningContext){
					filterRequest.furtherFilters.push(
						{
							Token: 'EST_LINE_ITEM',
							Value: selectedLineItem.Id
						}
					);
				}
				if (isLoadByNavigation) {
					if (selectedConstructionSystemInstance) {
						filterRequest.furtherFilters.push({
							Token: 'COS_INSTANCE',
							Value: selectedConstructionSystemInstance.Id
						});
						filterRequest.furtherFilters.push({
							Token: 'COS_INS_HEADER',
							Value: selectedConstructionSystemInstance.InstanceHeaderFk
						});
					}

					isLoadByNavigation = false;
				}else if((filterRequest.PKeys || filterRequest.setLoadByPrjFavorites) && !filterRequest.isReadingDueToRefresh){
					let headerFilter = filterRequest.PKeys && filterRequest.PKeys[0] ? { Token: 'EST_LINE_ITEM', Value: angular.copy(filterRequest.PKeys[0]) } : {};
					filterRequest.furtherFilters = _.isArray(filterRequest.furtherFilters) && filterRequest.furtherFilters.length ? filterRequest.furtherFilters : [headerFilter];
					if(!_.some(filterRequest.furtherFilters, function(i) { return i && i.Token && i.Token === 'EST_HEADER';})){
						filterRequest.furtherFilters.push(headerFilter);
					}
					isLoadByPrjFavorites = true;
					filterRequest.PKeys = null;
				}

				let headerForNavigate = _.find(filterRequest.furtherFilters, {Token: 'EST_HEADER'});
				let pinningContext = $injector.get('cloudDesktopSidebarService').getFilterRequestParams().PinningContext;
				if(pinningContext) {
					let estimateContext = _.find(pinningContext, {'token': 'estimate.main'});
					if(headerForNavigate && headerForNavigate.Value && estimateContext && headerForNavigate.Value !== estimateContext.id){
						$injector.get('cloudDesktopPinningContextService').clearPinningItem('project.main');
						$injector.get('cloudDesktopPinningContextService').clearPinningItem('estimate.main');
					}
				}

				if(selectedLineItem && headerForNavigate && headerForNavigate.Value && headerForNavigate.Value === -1){
					headerForNavigate.Value = selectedLineItem.EstHeaderFk;
				}
				let lineItemForNavigate = _.find(filterRequest.furtherFilters, {Token: 'EST_LINE_ITEM'});
				if (lineItemForNavigate && lineItemForNavigate.Value) {
					filterRequest.PKeys = [lineItemForNavigate.Value];
				}
				if(filterRequest.PinningContext){
					let projectForNavigate = _.find(filterRequest.PinningContext,{token:'project.main'});
					if(selectedLineItem && projectForNavigate && selectedLineItem.ProjectFk && projectForNavigate.id !== selectedLineItem.ProjectFk){
						projectForNavigate.id = selectedLineItem.ProjectFk;
						projectForNavigate.info = selectedLineItem.ProjectNo + '-' +selectedLineItem.ProjectName;
					}
				}else {
					filterRequest.PinningContext = ((!filterRequest.PinningContext || !filterRequest.PinningContext.length) && selectedLineItem && selectedLineItem.ProjectFk) ? [{
						id: selectedLineItem.ProjectFk,
						token: 'project.main',
						info: selectedLineItem.ProjectNo + '-' +selectedLineItem.ProjectName
					}] : filterRequest.PinningContext;
				}
				filterRequest.orderBy = [{Field: 'Code'}];
				extendSearchFilterAssign(filterRequest);
				if(filterRequest && filterRequest.PinningContext && filterRequest.PinningContext.length > 1){
					estimateMainFilterService.setFilterRequest(filterRequest);
				}

				if (!filterRequest.IncludeReferenceLineItems) {
					const filterItem = {
						Token: 'IncludeReferenceLineItems',
						Value: filterRequest.IncludeReferenceLineItems
					};

					if (filterRequest.furtherFilters) {
						filterRequest.furtherFilters.push(filterItem);
					} else {
						filterRequest.furtherFilters = [filterItem];
					}
				}

			}

			function extendSearchFilterAssign(filterRequest){
				// init furtherFilters - add filter IDs from filter structures
				let filterType = estimateMainFilterService.getFilterFunctionType();

				// first remove all existing leading structure filters
				filterRequest.furtherFilters = _.filter(filterRequest.furtherFilters, function(i) { return i && i.Token ? i.Token.indexOf('FILTER_BY_STRUCTURE') < 0 : true; });

				let leadingStructuresFilters = _.filter(_.map(estimateMainFilterService.getAllFilterIds(), function (v, k) {
					if (_.size(v) === 0) {
						return undefined;
					}
					// type 0 - assigned;
					// -> no change needed

					if(k === 'EST_CONFIDENCE_CHECK'){
						// type 0 - assigned and not assigned
						if (filterType === 0) {
							v = v.filter( x => x !== 'null' );
						}else if (filterType === 1) {	// type 1 - assigned and not assigned
							v.push('null');
						}
						// type 2 - not assigned
						else if (filterType === 2) {
							//v = ['null'];
							v = v.filter( x => x !== 'null' );
							v.push(999999); //To identify that not assigned filter is used at server side
						}
					}else{
						// type 1 - assigned and not assigned
						if (filterType === 1) {
							v.push('null');
						}
						// type 2 - not assigned
						else if (filterType === 2) {
							v = ['null'];
						}
					}

					let value = v.join(',');
					return {Token: 'FILTER_BY_STRUCTURE:' + k, Value: value};
				}), angular.isDefined);

				filterRequest.furtherFilters = filterRequest.furtherFilters ? _.concat(filterRequest.furtherFilters, leadingStructuresFilters) : leadingStructuresFilters;
				lastFilter = filterRequest;
			}

			function parseConfiguration(propertyConfig) {
				propertyConfig = angular.isString(propertyConfig) ? JSON.parse(propertyConfig) : angular.isArray(propertyConfig) ? propertyConfig : [];

				_.each(propertyConfig, function (config) {
					if (_.has(config, 'name')) {
						_.unset(config, 'name');
						_.unset(config, 'name$tr$');
						_.unset(config, 'name$tr$param$');
					}
				});

				return propertyConfig;
			}

			function getEstTypeIsTotalWq(){
				return isCalcTotalWithWq;
			}

			function getEstTypeIsWQReadOnly(){
				return isWQReadOnly;
			}

			function getEstTypeIsTotalAQBudget(){
				return isTotalAQBudget;
			}

			function getEstTypeIsBudgetEditable() {
				return isBudgetEditable;
			}

			function getConsiderDisabledDirect(){
				return considerDisabledDirect;
			}

			function setDeleteDialogFlag(flag){
				showDeleteMessage = !flag;
			}

			function getDeleteDialogFlag(){
				return !showDeleteMessage;
			}

			function getIsFixedBudgetTotalSystemOption(){
				return isFixedBudgetTotal;
			}

			function getLazyLoadCostCodeSystemOption(){
				return lazyLoadCostCodeSystemOption;
			}

			function getIsAssemblyTemplateNavigation(){
				return isAllowAssemblyTemplateNavigate;
			}

			function getSystemOptionForPlantTypeResource(){
				return systemOptionForPlantTypeResource;
			}

			function getLineItemContextEstHeaderId(){
				return LineItemContextEstHeaderId;
			}

			function getShowPlantAsOneRecordOption(){
				return showPlantAsOneRecord;
			}

			function deleteEntities(entities) {
				// check the header status
				if(getHeaderStatus()){
					return $injector.get('platformDialogService').showDialog({iconClass: 'info', headerText$tr$: 'cloud.common.infoBoxHeader', bodyText$tr$: 'estimate.main.readOnlyHeaderDeleteText', showOkButton: true});
				}

				// check the depend on data with line items
				let showDependDataDialog =  function (entities) {
					let modalOptions = {headerTextKey: 'estimate.main.confirmDeleteLineItemTitle', bodyTextKey: 'estimate.main.confirmDeleteLineItems', iconClass: 'ico-warning', width: '800px'};
					modalOptions.Promise = $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/getdependentdata', entities);
					return $injector.get('basicsCommonDependentService').showDependentDialog(modalOptions).then(result => {
						if (result && result.yes) {
							serviceContainer.data.deleteEntities(entities, serviceContainer.data);
						}
					});
				};

				// if it has prc item assignment, ValidPackageByEstimateLineItems
				let validPackageByEstimateLineItems = function (entities){
					let paramDataList = [];
					_.forEach(entities,function (item){
						let paramData ={};
						paramData.LineItemFk = item.Id;
						paramDataList.push(paramData);
					});
					$http.post(globals.webApiBaseUrl + 'procurement/common/prcitemassignment/ValidPackageByEstimateLineItems', paramDataList).then(function (res){
						if(res && res.data){
							deleteItemsVaildPackage({dontShowAgain : false, id: service.getGridId()});
						}else {
							showDependDataDialog(entities);
						}
					});
				}

				// check the depend on data with line items
				return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/hasdependentdata', entities).then(function (response) {
					let cannotDelete = response.data > 0;
					if (cannotDelete) {
						if (response.data === 1){
							validPackageByEstimateLineItems(entities);
						} else {
							showDependDataDialog(entities);
						}
					} else {
						serviceContainer.data.deleteEntities(entities, serviceContainer.data);
					}
				});
			}

			function deleteItemsVaildPackage(customModalOptions){
				function showDialog(customModalOptions){
					let platformDialogService = $injector.get('platformDialogService');
					let finalOptions = {
						id: _.get(customModalOptions, 'id'),
						headerText$tr$: _.get(customModalOptions, 'headerText$tr$', 'platform.dialogs.deleteSelection.headerText'),
						bodyText$tr$: _.get(customModalOptions, 'bodyText$tr$', 'estimate.main.deleteResourceDialogBody'),
						iconClass: 'ico-warning',
						buttons: [{id: 'cancel'}],
						defaultButtonId: 'cancel',
						dontShowAgain: _.get(customModalOptions, 'dontShowAgain')
					};

					if (customModalOptions && Object.prototype.hasOwnProperty.call(customModalOptions, 'details')) {
						Object.assign(finalOptions, {
							details: Object.assign(_.get(customModalOptions, 'details'), {type: 'grid'})
						});
						return platformDialogService.showDetailMsgBox(finalOptions);
					}

					return platformDialogService.showDialog(finalOptions);
				}

				showDialog(customModalOptions);
			}

			function refreshStructureContainer (doRefresh){
				if(doRefresh){
					// refresh line item structure container
					let genericStructureConfigService = $injector.get('estimateMainLineitemStructureConfigService');
					genericStructureConfigService.fireRefreshConfigData();
				}
			}

			function clearAllowanceAndMarkupCostCodeContainer(item) {
				let EstHeaderFk;
				if(_.has(item, 'EstHeaderFk')){
					EstHeaderFk = item.EstHeaderFk;
				} else {
					EstHeaderFk = _.has(item, 'EstHeader') ? item.EstHeader.Id : -1;
				}
				let estimateMainStandardAllowancesDataService = $injector.get('estimateMainStandardAllowancesDataService');
				let previousEstimateHeader = estimateMainStandardAllowancesDataService.getHeader();
				let estStandardAllowancesCostCodeDetailDataService = $injector.get('estStandardAllowancesCostCodeDetailDataService');
				if(EstHeaderFk !== previousEstimateHeader){
					estStandardAllowancesCostCodeDetailDataService.clearData();
					estimateMainStandardAllowancesDataService.clearData();
				}
			}

			function lineItemStructureMarkersChanged(isActive){
				let filterKey = 'EST_GENERIC_STRUCTURE';
				let gridIdLineItemStructure = '66788defaa8f43319b5122462e09c41d';
				let mockService = {
					markersChanged: function (){},
					getList: function (){return [];},
					gridRefresh: function (){
						setTimeout(function(){
							$('.cid_'+ gridIdLineItemStructure +' .tlb-icons.ico-filter-off').trigger('click');
						});},
					setItemFilter: function(){},
					enableItemFilter: function(){}
				};

				if (isActive) {
					estimateMainFilterService.addFilter('estimateMainLineItemStructureController', mockService, function () {
						return true;
					}, {id: filterKey, iconClass: 'tlb-icons ico-filter-structure', captionId: 'filteringByLineItemStructure'}, 'Id');
				} else {
					estimateMainFilterService.setServiceToBeFiltered(mockService);
					estimateMainFilterService.setFilterIds(filterKey, []);
					estimateMainFilterService.setServiceToBeFiltered(service);

					estimateMainFilterService.removeFilter('estimateMainLineItemStructureController');
				}
			}

			function setIsUpdateDataByParameter(value) {
				isUpdateDataByParameter = value;
			}

			function getIsUpdateDataByParameter() {
				return isUpdateDataByParameter;
			}

			function setLsumUom(){
				estimateMainCommonService.setLsumUom();
			}

			function doPrepareUpdateCall(dataToUpdate){
				if (Object.hasOwnProperty.call(dataToUpdate, 'EstLineItems')){
					_.forEach(dataToUpdate.EstLineItems, function(lineItem){
						if (Object.hasOwnProperty.call(lineItem, 'EstAssemblyFkPrjProjectAssemblyFk')){
							lineItem.EstAssemblyFk = lineItem.EstAssemblyFkPrjProjectAssemblyFk;
							// Delete temp field
							delete lineItem.EstAssemblyFkPrjProjectAssemblyFk;
						}

						if(lineItem.CommentText && lineItem.originCommentText){
							let transVal = estimateMainCommonService.translateCommentColtext(lineItem.originCommentText);
							lineItem.CommentText = lineItem.CommentText.replace(transVal, lineItem.originCommentText);
						}
					});

					if(Object.hasOwnProperty.call(dataToUpdate, 'EstResourceToSave')){
						_.forEach(dataToUpdate.EstResourceToSave, function (item){
							if(item.EstResource.CommentText && item.EstResource.originCommentText){
								let transVal = estimateMainCommonService.translateCommentColtext(item.EstResource.originCommentText);
								item.EstResource.CommentText = item.EstResource.CommentText.replace(transVal, item.EstResource.originCommentText);
							}
						});
					}

					let currentLineItems = service.getList();
					let ids = [];
					_.forEach(currentLineItems, function (item){
						ids.push(item.Id);
					});
					dataToUpdate.ShowedLineItemIds = ids;
				}

				if(Object.hasOwnProperty.call(dataToUpdate, 'AllowanceAreaToSave')){
					dataToUpdate.AllowanceMarkUp2CostCodeToSave = [];
					dataToUpdate.AllowanceMarkUp2CostCodeToDelete = [];
					_.forEach(dataToUpdate.AllowanceAreaToSave,function (item) {
						_.forEach(item.AllowanceMarkUp2CostCodeToSave,function (d) {
							if(d.AllowanceMarkUp2CostCode.IsCustomProjectCostCode){
								d.AllowanceMarkUp2CostCode.MdcCostCodeFk = null;
							}
							d.AllowanceMarkUp2CostCode.CostCodes =null;
							if(d.AllowanceMarkUp2CostCode.Id !== -2){
								dataToUpdate.AllowanceMarkUp2CostCodeToSave.push(d);
							}
						});

						_.forEach(item.AllowanceMarkUp2CostCodeToDelete,function (d) {
							d.CostCodes =null;
							if(d.Id !== -2){
								dataToUpdate.AllowanceMarkUp2CostCodeToDelete.push(d);
							}
						});
					});
				}

				if(Object.hasOwnProperty.call(dataToUpdate, 'EstimatePriceAdjustmentToSave')){
					$injector.get('estimateMainPriceAdjustmentDataService').doPrepareUpdateCall(dataToUpdate);
				}

				if(Object.hasOwnProperty.call(dataToUpdate, 'EstimatePriceAdjustmentTotalToSave')){
					$injector.get('estimateMainPriceAdjustmentTotalDataService').doPrepareUpdateCall(dataToUpdate);
				}

				if(Object.hasOwnProperty.call(dataToUpdate, 'CombinedLineItems')){
					$injector.get('estimateMainCombinedLineItemClientService').doPrepareUpdateCall(dataToUpdate);
				}
			}

			function setAAReadonly(value,lineItem) {
				let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
				if(lineItem){
					platformRuntimeDataService.readonly(lineItem, [{field: 'AdvancedAllUnit', readonly: value}]);
					platformRuntimeDataService.readonly(lineItem, [{field: 'AdvancedAllUnitItem', readonly: value}]);
					platformRuntimeDataService.readonly(lineItem, [{field: 'AdvancedAll', readonly: value}]);
					return;
				}

				let estimateItems = service.getList();
				_.forEach(estimateItems, function (entity) {
					platformRuntimeDataService.readonly(entity, [{field: 'AdvancedAllUnit', readonly: value}]);
					platformRuntimeDataService.readonly(entity, [{field: 'AdvancedAllUnitItem', readonly: value}]);
					platformRuntimeDataService.readonly(entity, [{field: 'AdvancedAll', readonly: value}]);
				});
			}

			function handleOldAllowance() {
				let items = service.getList();
				_.forEach(items, function (item) {
					if(item.AdvancedAll === 0 && item.AdvancedAllowance !== 0){
						item.AdvancedAll = item.AdvancedAllowance;
						$injector.get('estimateMainStandardAllowanceCalculationService').reCalculateAdvAllowance(item,'AdvancedAll');
						item.AdvancedAllowance = 0;
						service.markItemAsModified(item);
					}

					if(item.AdvancedAll !== 0 && item.AdvancedAllowance !== 0){
						item.AdvancedAllowance = 0;
						service.markItemAsModified(item);
					}
				});
			}

			function setCacheExchangePrjId(prjId){
				cacheExchangeProjectId = prjId;
			}

			function getCacheExchangePrjId(){
				return cacheExchangeProjectId;
			}


			function setRuleToDelete(value) {
				ruleToDelete = value;
			}

			function getRuleToDelete() {
				return ruleToDelete;
			}

			function deleteParamByPrjRule(entity,prjEstRules,currentItemName) {
				let structureId =0;
				let mainServiceName = '';
				let estLeadingStructureContext ={};
				estLeadingStructureContext.EstLeadingStructureId = entity.Id;
				switch (currentItemName) {
					case 'EstBoq':
						if(entity.IsRoot){
							structureId = 1010;
							estLeadingStructureContext.EstHeaderFk = entity.Id;
						}else{
							structureId = 1;
							estLeadingStructureContext.BoqHeaderFk = entity.BoqHeaderFk;
							estLeadingStructureContext.BoqItemFk = entity.Id;
						}
						mainServiceName ='estimateMainBoqService';
						break;
					case 'EstActivity':
						if(entity.IsRoot){
							structureId = 1010;
							estLeadingStructureContext.EstHeaderFk = entity.Id;
						}else{
							structureId = 2;
							estLeadingStructureContext.PsdActivityFk = entity.Id;
						}
						mainServiceName ='estimateMainActivityService';
						break;
					case 'EstPrjLocation':
						structureId = 3;
						mainServiceName ='estimateMainLocationService';
						estLeadingStructureContext.PrjLocationFk = entity.Id;
						break;
					case 'EstCtu':
						structureId = 4;
						mainServiceName ='estimateMainControllingService';
						estLeadingStructureContext.MdcControllingUnitFk = entity.Id;
						break;
					case 'EstPrcStructure':
						structureId = 5;
						mainServiceName ='estimateMainProcurementStructureService';
						estLeadingStructureContext.PrcStructureFk = entity.Id;
						break;
					case 'EstAssemblyCat':
						structureId = 16;
						mainServiceName ='estimateMainAssembliesCategoryService';
						estLeadingStructureContext.EstAssemblyCatFk = entity.Id;
						break;
					case  'EstCostGrp':
						structureId = 17;
						mainServiceName ='costGroupStructureDataServiceFactory';
						estLeadingStructureContext.BasCostGroupFk= entity.Id;
						estLeadingStructureContext.CostGroupCatFk = entity.CostGroupCatalogFk;
						estLeadingStructureContext.CostGroupFk= entity.Id;
						estLeadingStructureContext.EstLeadingStructureId= entity.Id;
						break;
					case 'EstLineItems':
						structureId = 1001;
						mainServiceName ='estimateMainService';
						estLeadingStructureContext.EstLineItemFk = entity.Id;
						break;
					case 'EstHeader':
						structureId = 1010;
						mainServiceName ='estimateMainRootService';
						estLeadingStructureContext.EstHeaderFk = entity.Id;
						break;
				}

				let postData = {
					'ProjectId': service.getSelectedProjectId(),
					'EstHeaderFk': parseInt(service.getSelectedEstHeaderId()),
					'SelectedEstLineItemIds': [entity.Id],
					'PrjEstRuleIds':_.map(prjEstRules,'OriginaPrjEstRuleFk'),
					'PrjEstRules':[],
					'StructureId': structureId,
					'LineItemsSelectedLevel': null,
					'IsLeadingStructure': false,
					'SelectedParams':[],
					'IsRoot': false,
					'IsRemoveRuleParam':false,
					'EstLeadingStructureContext':estLeadingStructureContext
				};

				if (postData.ProjectId > 0 && postData.EstHeaderFk>0 ) {
					$http.post (globals.webApiBaseUrl + 'estimate/main/lineitem/deleteParamByPrjRule', postData)
						.then (function () {
							if((currentItemName ==='EstBoq' || currentItemName==='EstActivity') && entity.IsRoot) {
								estimateParameterFormatterService.updateCacheParam('EstHeader',_.map(prjEstRules,'OriginaPrjEstRuleFk'),entity.EstHeaderFk);
								$injector.get ('estimateMainRootService').gridRefresh();

							}else {
								estimateParameterFormatterService.updateCacheParam (currentItemName, _.map (prjEstRules, 'OriginaPrjEstRuleFk'), entity.Id);
							}
							$injector.get (mainServiceName).setRuleToDelete([]);
							$injector.get (mainServiceName).gridRefresh();
						}, function () {

						});
				}
			}

			function getPlantEstimatePriceList(lgmJobFk,projectId){
				return $http.get(globals.webApiBaseUrl + 'estimate/main/resource/getjobid', {
					params: {
						jobId: lgmJobFk || null,
						projectId: projectId
					}
				}).then(function(response) {
					let res = {};
					if (response.data) {
						let plantEstimatePrice = response.data.PlantEstimatePriceListFk;
						return  plantEstimatePrice ;
					}
					return res;
				}).catch(function(error) {
					console.error(error);
					throw error;
				});
			}

			function setCharacteristicGridReadOnly(scope, dataService) {
				_.forEach(scope.tools.items, function (btn) {
					if (btn.id === 'create' || btn.id === 'delete') {
						btn.disabled = function isDisabled() {
							var parentSelected = service.getSelected();
							if (parentSelected && Object.prototype.hasOwnProperty.call(parentSelected, 'EstRuleSourceFk')) {
								if (btn.id === 'delete') {
									var selected = dataService.getSelected();
									return !!parentSelected.EstRuleSourceFk || (!selected && !parentSelected.EstRuleSourceFk);
								} else {
									return !!parentSelected.EstRuleSourceFk;
								}
							}
							return !parentSelected;
						};
					}
				});
			}

		}]);
})();
