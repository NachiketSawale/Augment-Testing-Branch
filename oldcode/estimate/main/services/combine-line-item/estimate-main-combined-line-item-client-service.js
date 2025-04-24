/*
Created by Waldrop on 05/22/20
 */

/* globals,_ */
(function () {
	'use strict';
	var moduleName = 'estimate.main';
	var combineModule = angular.module(moduleName);
	/* *
	 * @ngdoc service
	 * @name estimateMainCombinedLineItemClientService
	 * @function
	 *
	 * @description
	 * estimateMainCombinedLineItemClientService is the data service for all estimate combine line item related functionality.
	 */
	angular.module(moduleName).factory('estimateMainCombinedLineItemClientService', [
		'$rootScope', 'estimateMainService', 'PlatformMessenger', 'platformDataServiceFactory',
		'estimateMainFilterService', 'estimateMainCombineLineItemProcessor', 'cloudDesktopPinningContextService',
		'$injector','estimateMainCommonService','platformGridAPI',
		'estimateMainRuleUpdateService','estimateParamUpdateService','estimateParameterFormatterService',
		'estimateRuleFormatterService','estimateMainLookupService','estimateMainJobCostcodesLookupService',
		'estimateMainPrjMaterialLookupService','cloudDesktopInfoService',
		'estimateMainCostCodeChartDataService','estimateMainExchangeRateService','basicsLookupdataLookupFilterService',
		'estimateMainCreationService','$http','$q',
		'platformPermissionService','permissions',
		'estimateMainCombineColumnService','_','globals', 'estimateMainCombinedLineItemDynamicConfigurationService',
		function ($rootScope, estimateMainService, PlatformMessenger, platformDataServiceFactory,
			estimateMainFilterService, estimateMainCombineLineItemProcessor, cloudDesktopPinningContextService,
			$injector,estimateMainCommonService,platformGridAPI,
			estimateMainRuleUpdateService,estimateParamUpdateService,estimateParameterFormatterService,
			estimateRuleFormatterService,estimateMainLookupService,estimateMainJobCostcodesLookupService,
			estimateMainPrjMaterialLookupService,cloudDesktopInfoService,
			estimateMainCostCodeChartDataService,estimateMainExchangeRateService,basicsLookupdataLookupFilterService,
			estimateMainCreationService,$http,$q,
			platformPermissionService,permissions,
			estimateMainCombineColumnService,_,globals, estCombinedLineItemDynamicConfigurationService
		) {

			let selectedEstHeaderFk = null,
				selectedEstHeaderColumnConfigTypeFk = null,
				isColumnConfig = null,
				selectedEstHeaderItem = null,
				selectedEstProject = null,
				selectedProjectInfo = null,
				ruleParamSaveToLevel = '',
				detailsParamAlwaysSave = '',
				characteristicColumn = '',
				isEstimate = false,
				isHeaderStatusReadOnly = false,
				isReadOnlyService = false,
				estiamteReadData = null,
				filteredCustomColumn = null,
				isWQReadOnly = false;

			let gridId = null;

			let sidebarInquiryOptions = {
				active: true,
				moduleName: moduleName,
				getSelectedItemsFn: getSelectedItems,
				getResultsSetFn: getResultsSet
			};

			let columnsRemoved = [];

			let estimateMainServiceOptions = {
				hierarchicalRootItem: {
					module: combineModule,
					serviceName: 'estimateMainCombinedLineItemClientService',
					actions: {delete: false, create: false},
					entityNameTranslationID: 'estimate.main.lineItemContainer',
					httpUpdate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endUpdate: 'update'},
					httpRead: {

						extendSearchFilter: extendSearchFilter,
						initReadData: function initReadData(readData) {
							// isReadData = true;
							return new ReplacementData(readData);

						},
						route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endRead: 'listcombined_new',
						usePostForRead: true
					},
					entityRole: {
						root: {
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							itemName: 'CombinedLineItems',
							handleUpdateDone: function (updateData, response, data)  {
								if(response.IsReload) {
									service.load();
									estimateMainService.load();
									return;
								}

								estimateMainService.updateList(updateData, response);
								data.handleOnUpdateSucceeded(updateData, response, data, true);
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
								let header = estimateMainService.getSelectedEstHeaderItem();
								if (header) {
									angular.forEach(readData.dtos, function (dto) {
										dto.Currency1Fk = header.Currency1Fk;
										dto.Currency2Fk = header.Currency2Fk;
									});
								}

								estimateMainCommonService.setDynamicColumnsData(readData, serviceContainer.data.dynamicColumns, true);

								if (Object.hasOwnProperty.call(readData, 'IsWQReadOnly')){
									isWQReadOnly = _.get(readData, 'IsWQReadOnly');
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
								}]);

								return serviceContainer.data.handleReadSucceeded(readData, data);

							}
						}
					},
					useItemFilter: true,
					dataProcessor: [estimateMainCombineLineItemProcessor],
					sidebarSearch: {
						options: {
							moduleName: combineModule,
							enhancedSearchEnabled: true,
							pattern: '',
							pageSize: 100,
							useCurrentClient: true,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							pinningOptions: {
								isActive: true,
								showPinningContext: [{token: 'project.main', show: true}, {
									token: 'estimate.main',
									show: true
								}]
							},
							withExecutionHints: false
						}
					},
					sidebarInquiry: {
						options: sidebarInquiryOptions
					},
					filterByViewer: true
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(estimateMainServiceOptions);

			let data = serviceContainer.data;

			let service = serviceContainer.service;

			data.doUpdate = function (){
				return estimateMainService.update();
			};

			service.Rates = null;

			let estConfigData = [];

			let lookupFilter = [
				{
					key: 'costgroupfk-for-line-item',
					serverSide: true,
					fn: function () {
						var currentItem = service.getSelectedEstHeaderItem();
						return 'LineItemContextFk=' + (currentItem ? currentItem.MdcLineItemContextFk : '-1');
					}
				},
				{
					key: 'projectfk',
					serverSide: true,
					fn: function () {
						var id = service.getSelectedProjectId();
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
					key: 'est-model-object-filter',
					serverSide: false,
					fn: function (item) {
						return item.MdlModelFk || item.ModelFk;
					}
				}
			];

			let sortCodeInfoToSave = [];

			//  make the rule controller
			let oldClear = service.clear;

			let boqFilterOffEvent = new PlatformMessenger();

			let wicBoqFilterOffEvent = new PlatformMessenger();

			let lastFilter = null;

			let lineItemsPromise;

			let filterView = {
				currentViewType: 0,
				currentViewColumns: [],
				currentCustomView: null,
				currentServerSideViewFields: []
			};


			/* Data */
			angular.extend(serviceContainer.data, {
				clearContent: clearContent,
				setGridIdForRest:setGridIdForRest,
				setScope:setScope
			});

			/* Service */
			angular.extend(serviceContainer.service, {
				/* Events */
				onUpdated: new PlatformMessenger(),
				onClearItems: new PlatformMessenger(),
				onRefreshLookup: new PlatformMessenger(),
				onEstHeaderChanged: new PlatformMessenger(),
				onProjectChanged: new PlatformMessenger(),
				onSortCodeReset: new PlatformMessenger(),
				onRequestLineItemsListed: new PlatformMessenger(),
				onQuantityChanged: new PlatformMessenger(),
				onBoqItesmUpdated: new PlatformMessenger(),
				onEstHeaderSet: new PlatformMessenger(),
				getContainerData: getContainerData,
				setList: setList,
				updateList: updateList,
				addList: addList,
				fireListLoaded: fireListLoaded,
				setSelectedLineItem: setSelectedLineItem,
				setSelectedPrjEstHeader: setSelectedPrjEstHeader,
				getSelectedEstHeaderItem: getSelectedEstHeaderItem,
				setSelectedEstHeaderColumnConfigFk: setSelectedEstHeaderColumnConfigFk,
				getSelectedEstHeaderColumnConfigTypeFk: getSelectedEstHeaderColumnConfigTypeFk,
				getSelectedEstHeaderIsColumnConfig: getSelectedEstHeaderIsColumnConfig,
				getSelectedProjectInfo: getSelectedProjectInfo,
				setSelectedProjectInfo: setSelectedProjectInfo,
				updateModuleHeaderInfo: updateModuleHeaderInfo,
				setEstimateHeader: setEstimateHeader,
				navigateTo: navigateTo,

				setSidebarNFavInfo: setSidebarNFavInfo,

				updateCalculation: updateCalculation,
				setReminder: setReminder,
				getParamSaveReminder: getParamSaveReminder,

				setEstConfigData: setEstConfigData,
				clearEstConfigData: clearEstConfigData,
				registerLookupFilter: registerLookupFilter,
				unregisterLookupFilter: unregisterLookupFilter,

				addSortCodeChangeInfo: addSortCodeChangeInfo,
				setDetailsParamReminder: setDetailsParamReminder,
				getDetailsParamReminder: getDetailsParamReminder,
				getGridId: getGridId,
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
				reSetViewConfig: reSetViewConfig,
				loadItem: loadItem,
				clearLookupCache: clearLookupCache,
				registerBoqFilterOffEvent: registerBoqFilterOffEvent,
				unregisterBoqFilterOffEvent: unregisterBoqFilterOffEvent,
				registerwicBoqFilterOffEvent: registerwicBoqFilterOffEvent,
				unregisterwicBoqFilterOffEvent: unregisterwicBoqFilterOffEvent,

				extendSearchFilterAssign : extendSearchFilterAssign,

				getLastFilter: getLastFilter,
				getHeaderStatus: getHeaderStatus,
				getInquiryOptions: getInquiryOptions,
				isReadonly: isReadonly,
				assignQtyRelationOfLeadingStructures: assignQtyRelationOfLeadingStructures,
				assignDefaultLeadingStructures: assignDefaultLeadingStructures,
				isAssignAssemblyInProcess: false,
				getAssemblyLookupSelectedItems: getAssemblyLookupSelectedItems,
				AssignAssemblyToLineItem: AssignAssemblyToLineItem,
				setLineItemCurrencies: setLineItemCurrencies,

				setEstiamteReadData: setEstiamteReadData,
				getEstiamteReadData: getEstiamteReadData,
				setGridIdForRest: setGridIdForRest,
				setScope: setScope,
				setLineItemCurrenciesCreation:setLineItemCurrenciesCreation,
				calculateCurrencies:calculateCurrencies,

				setListView: setListView,
				getViewList : getViewList,
				setAvailableGridColumns: setAvailableGridColumns,
				setCombineFilters:setCombineFilters,
				changeCombinedValues:changeCombinedValues,
				handleUpdateDone:handleUpdateDone,
				doPrepareUpdateCall : doPrepareUpdateCall,

				getEstTypeIsWQReadOnly: getEstTypeIsWQReadOnly
			});

			service.registerListLoadStarted(estimateMainCommonService.resetTotal);
			service.onEstHeaderChanged.register($injector.get('estimateMainFilterService').removeAllFilters);
			service.onProjectChanged.register($injector.get('estimateMainLookupStateService').clearData);

			service.callRefresh = service.refresh || serviceContainer.data.onRefreshRequested;

			let projectId = estimateMainService.getSelectedProjectId();
			let headerId = estimateMainService.getSelectedEstHeaderId();
			service.loadCombinedLineItem = function (isFromNavigator) {
				//   if project id or estheader change, then reload leading structure
				if (projectId !== estimateMainService.getSelectedProjectId() || headerId !== estimateMainService.getSelectedEstHeaderId()) {
					projectId = estimateMainService.getSelectedProjectId();
					headerId = estimateMainService.getSelectedEstHeaderId();
					if (projectId > 0) {
						service.load();
					}

				}
				else{
					if(isFromNavigator === 'isForNagvitor'){
						service.load();
					}
				}
			};

			return service;

			function ReplacementData(readData) {
				let project = cloudDesktopPinningContextService.getPinningItem('project.main');
				if (_.isEmpty(project)) {
					project = {id: projectId, info: '', token: 'project.main'};
				}

				let estHeader = cloudDesktopPinningContextService.getPinningItem('estimate.main');
				if (_.isEmpty(estHeader)) {
					estHeader = {id: headerId, info: '', token: 'estimate.main'};
				}

				readData.ExecutionHints = false;
				readData.IncludeNonActiveItems = false;
				readData.PageNumber = 0;
				readData.PageSize = 100;
				readData.Pattern = null;
				readData.PinningContext = [project, estHeader];
				readData.ProjectContextId = project ? project.id : null;
				readData.UseCurrentClient = false;
				readData.filter = '';
				readData.furtherFilters = [];
				readData.orderBy = [{'Field': 'Code'}];
				extendSearchFilter(readData);

				return readData;
			}

			function extendSearchFilter(filterRequest) {
				let viewList = filterView.currentServerSideViewFields;

				// if viewList length = 0, will assign as standard list
				if (!viewList || viewList.length === 0){
					viewList = estimateMainCombineColumnService.getStandardColumnList();

					let dynamicViewFileds = getDynamicColumns();
					viewList = viewList.concat(dynamicViewFileds);
				}

				if(viewList){
					angular.forEach(viewList, function (name) {
						filterRequest.furtherFilters.push({
							Token: name,
							Value: null
						});
					});
				}

				let groupingFilter = $injector.get('platformGenericStructureService').getGroupingFilterRequest();
				if (groupingFilter) {
					filterRequest.groupingFilter = angular.copy(groupingFilter);
				}
				filterRequest.orderBy = [{Field: 'Code'}];

				filterRequest.PageSize = null;
				estimateMainFilterService.setFilterRequest(filterRequest);
			}

			function getViewList(){
				let viewList = filterView.currentServerSideViewFields;

				// if viewList length = 0, will assign as standard list
				if (!viewList || viewList.length === 0){
					viewList = estimateMainCombineColumnService.getStandardColumnList();
				}

				return viewList;
			}

			/* *
			 * this function will be called from Sidebar Inquiry container when user presses the "AddSelectedItems" Button
			 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
			  */
			function getSelectedItems() {
				var resultSet = service.getSelectedEntities();
				return createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
			}

			/* *
			 * this function will be called from Sidebar Inquiry container when user presses the "AddAllItems" Button
			 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
			  */
			function getResultsSet() {
				var resultSet = service.getList();
				return createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
			}

			/* *
			 * This function creates a Inquiry Resultset from input resultset (busniness partner specific)
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
				var resultArr = [];
				_.forEach(resultSet, function (item) {
					if (item && item.Id) { //   check for valid object
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

			function setDynamicColumnsLayoutToGrid(columns){
				var lineItemGridId = 'b46b9e121808466da59c0b2959f09960';
				var grid = platformGridAPI.grids.element('id', lineItemGridId);
				if (grid && grid.instance){
					platformGridAPI.columns.configuration(lineItemGridId, columns);
				}
			}

			function setDynamicColumns(cols){
				var dynamicColumns = [];
				if (_.size(cols) > 0){
					dynamicColumns = _.filter(serviceContainer.data.dynamicColumns, function(col){
						return !(col.id.indexOf('ConfDetail') > -1 || col.id.indexOf('charactercolumn_') > -1 ||  col.id.indexOf('NotAssignedCostTotal') > -1);
					});
					serviceContainer.data.dynamicColumns = dynamicColumns.concat(cols);
				}
			}

			function clearContent(){
			}

			function setGridIdForRest(gridId) {
				service.gridIdForReset = gridId;
			}

			function setScope(scope) {
				service.parentScope = scope;
			}

			function getContainerData() {
				return serviceContainer.data;
			}

			function setList(data) {
				serviceContainer.data.itemList = data;
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
				var list = serviceContainer.data.itemList;
				if (data && data.length) {
					angular.forEach(data, function (d) {
						var item = _.find(list, {Id: d.Id, EstHeaderFk: d.EstHeaderFk});
						if (item) {
							angular.extend(list[list.indexOf(item)], d);
						} else {
							serviceContainer.data.itemList.push(d);
						}
					});
					angular.forEach(list, function (li) {
						estimateMainCombineLineItemProcessor.processItem(li);
					});
				}
			}

			function fireListLoaded() {
				serviceContainer.data.listLoaded.fire();
			}

			function setSelectedLineItem(selectedLineItem) {
				if (selectedLineItem && selectedLineItem.Id) {
					serviceContainer.data.selectionAfterSort.fire(selectedLineItem);
				}
			}

			function setSelectedPrjEstHeader(estimateCompositeItem) {
				if (estimateCompositeItem) {
					selectedEstProject = estimateCompositeItem.Object.prototype.hasOwnProperty.call('PrjEstimate') ? estimateCompositeItem.PrjEstimate : null;
					selectedEstHeaderItem = estimateCompositeItem.EstHeader;
					estimateMainLookupService.setSelectedProjectId(selectedEstProject.PrjProjectFk);
					estimateMainJobCostcodesLookupService.setSelectedProjectId(selectedEstProject.PrjProjectFk, selectedEstHeaderItem.LgmJobFk);
					estimateMainPrjMaterialLookupService.setProjectId(selectedEstProject.PrjProjectFk);
					estimateRuleFormatterService.setSelectedProject(selectedEstProject.PrjProjectFk);

					if (selectedEstHeaderItem) {
						if(selectedEstHeaderFk !== selectedEstHeaderItem.Id) {
							//  when header changed
							$injector.get('estimateResourcesSummaryService').clear();
						}
						selectedEstHeaderFk = selectedEstHeaderItem.Id;
						// selectedEstHeaderColumnConfigFk =  selectedEstHeaderItem.Object.prototype.hasOwnProperty.call('EstConfigFk') ? selectedEstHeaderItem.EstConfigFk : null;
						selectedEstHeaderColumnConfigTypeFk = selectedEstHeaderItem.Object.prototype.hasOwnProperty.call('EstConfigtypeFk') ? selectedEstHeaderItem.EstConfigtypeFk : null;
						isColumnConfig = selectedEstHeaderItem.IsColumnConfig;
						estimateParameterFormatterService.setSelectedEstHeaderNProject(selectedEstHeaderItem.Id, selectedEstProject.PrjProjectFk);
						estimateRuleFormatterService.setSelectedEstHeaderNProject(selectedEstHeaderItem.Id, selectedEstProject.PrjProjectFk);

					}
				} else {
					selectedEstProject = selectedEstHeaderItem = selectedEstHeaderFk = null;
					// selectedEstHeaderColumnConfigFk = selectedEstHeaderColumnConfigTypeFk = null;
				}
				//  enable / disable add button in line item container
				service.onEstHeaderSet.fire();
			}

			function getSelectedEstHeaderItem() {
				return selectedEstHeaderItem;
			}

			function setSelectedEstHeaderColumnConfigFk(/* columnConfigFk */) {
				// selectedEstHeaderColumnConfigFk = columnConfigFk;
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

			function setSelectedProjectInfo(projectEntity) {
				selectedProjectInfo = {
					ProjectNo: projectEntity.ProjectNo,
					ProjectName: projectEntity.ProjectName,
					ProjectId: projectEntity.Id,
					ProjectCurrency: projectEntity.CurrencyFk,
					PrjCalendarId: projectEntity.CalendarFk
				};
			}

			function updateModuleHeaderInfo(lineItem) {
				var entityText = '';
				if (selectedProjectInfo) {
					entityText = selectedProjectInfo.ProjectNo + ' - ' + selectedProjectInfo.ProjectName;
					entityText += selectedEstHeaderItem ? ' / ' + selectedEstHeaderItem.Code + ' - ' + selectedEstHeaderItem.DescriptionInfo.Translated : '';
					entityText += !_.isEmpty(lineItem) ? ' / ' + lineItem.Code : '';
				}
				cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNameEstimate', entityText);
			}

			function setEstimateHeader(item) {

				let estHeader = _.get(item, 'EstHeader');

				if (service.getSelectedEstHeaderId() !== _.get(estHeader, 'Id')) {
					service.onEstHeaderChanged.fire();
				}

				service.onProjectChanged.fire();
			}

			function navigateTo(/* item, triggerField */) {

				boqFilterOffEvent.fire();
				estimateMainCostCodeChartDataService.load();
			}

			// set Sidebar search and favourites Information
			function setSidebarNFavInfo(info) {
				let prjEstComposites = info.Object.prototype.hasOwnProperty.call('prjEstComposites') ? info.prjEstComposites : null;

				if (prjEstComposites && prjEstComposites.length) {
					//  / TODO: extension for displayMember: currently no support for "displayMember: 'EstimateHeader.DescriptionInfo.Translated'"
					//  / as soon as support is available, remove this code
					_.each(prjEstComposites, function (item) {
						item.displayMember = _.get(item, 'EstHeader.DescriptionInfo.Translated', '');
					});
				}
			}

			function handleUpdateDone(updateData){

				service.mergeInUpdateData(updateData,service);
				//  clear updateData
				let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
				modTrackServ.clearModificationsInRoot(service);

				estimateMainService.onUpdated.fire();
				estimateMainCommonService.setPrjCostCodes(estimateMainService.getSelectedProjectId());

			}

			//  detail formula calculation of line item and resources @server
			function updateCalculation() {
				service.update();
			}

			//  reminder always save parameters to
			function setReminder(selected) {
				ruleParamSaveToLevel = selected;
			}

			//  reminder always save parameters to
			function getParamSaveReminder() {
				return ruleParamSaveToLevel;
			}

			//  setEstConfigData for structure assignment on line item create
			function setEstConfigData(data) {
				estConfigData = [];
				if (data && data.EstStructureDetails && data.EstStructureDetails.length) {
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


			//  add sortcode into ToSave array for update data
			function addSortCodeChangeInfo(scField, item) {
				var field = scField.slice(0, -2),
					value = item[scField],
					scItem = _.find(sortCodeInfoToSave, {Field: field}),
					isExist = _.isNumber(value);
				if (scItem) {
					scItem.Code = value;
					scItem.IsExist = isExist;
				} else {
					sortCodeInfoToSave.push({Field: field, Code: value, IsExist: isExist});
				}
			}

			//  reminder always save parameters to
			function setDetailsParamReminder(selectedLevel) {
				detailsParamAlwaysSave = selectedLevel;
			}

			//  reminder always save details formula parameters to selected level
			function getDetailsParamReminder() {
				return detailsParamAlwaysSave;
			}

			function getGridId(itemId) {
				gridId = itemId;
			}

			function setCharacteristicColumn(colName){
				characteristicColumn = colName;
			}

			function getCharacteristicColumn(){
				return characteristicColumn;
			}

			function setDynamicQuantityColumns(lineItems){
				if(lineItems && lineItems.length){
					$injector.get('estimateMainDynamicQuantityColumnService').setDynamicQuantityColumns(lineItems);
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

			function getIsEstimate(){
				return isEstimate;
			}

			function setIsEstimate(value){
				isEstimate = value;
			}

			function clear() {
				oldClear();
				var estimateRuleComboService = $injector.get('estimateRuleComboService');
				if (estimateRuleComboService) {
					estimateRuleComboService.clear();
				}
			}

			function reSetViewConfig(){
				filterView = {
					currentViewType: 0,
					currentViewColumns: [],
					currentCustomView: null,
					currentServerSideViewFields: []
				};
			}

			function loadItem(id){
				return service.getItemById(id);
			}

			function setLineItemCurrencies(readData){
				var dtos = readData.dtos ? readData.dtos : [];

				var basMultiCurrCommService =  $injector.get('basicsMultiCurrencyCommonService');

				if(dtos.length > 0 ){
					angular.forEach(dtos, function (lineitem) {

						basMultiCurrCommService.setCurrencies(lineitem);

					});

					readData.dtos = dtos;
				}


			}

			function setLineItemCurrenciesCreation(item){

				var basMultiCurrCommService =  $injector.get('basicsMultiCurrencyCommonService');

				basMultiCurrCommService.setCurrencies(item);
			}

			function calculateCurrencies(item){

				var basMultiCurrCommService =  $injector.get('basicsMultiCurrencyCommonService');

				basMultiCurrCommService.calculateMultiCurrencies(item);
			}

			/* *
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
				for(var i=1; i<=10; i++) {
					//   var costGroupService = $injector.get('estimateMainCostGroupServiceFactory').getService(i);
					//   costGroupService.clear();
					var sortCodeService = $injector.get('estimateMainSortCodesLookupDataService').getService(i);
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

			function getLastFilter() {
				return lastFilter;
			}

			function getHeaderStatus(){
				return isHeaderStatusReadOnly;
			}

			function getInquiryOptions(){
				return sidebarInquiryOptions;
			}

			function isReadonly(){
				return isReadOnlyService;
			}

			function assignQtyRelationOfLeadingStructures(entityToAssign){
				entityToAssign = entityToAssign || {};
				var availableStructures = estimateMainCreationService.getCreationProcessors();
				entityToAssign.validStructure = false;

				function takeOverStruct(structFk, qtyRelFk) {
					entityToAssign.QtyTakeOverStructFk = structFk;
					entityToAssign.validStructure = true;
					entityToAssign.QtyRelFk = qtyRelFk;
				}

				angular.forEach(estConfigData, function (d) {
					if (!d) {
						return;
					}
					//  consider the directional relation type
					if (!entityToAssign.validStructure && (d.EstQuantityRelFk===1 || d.EstQuantityRelFk===4 || d.EstQuantityRelFk===6 || d.EstQuantityRelFk===7)) {
						switch (d.EstStructureFk) {
							case 1://  boq
								if (_.has(availableStructures, 'estimateMainBoqListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 2://  schedule activity
								if (_.has(availableStructures, 'estimateMainActivityListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 3://  location
								if (_.has(availableStructures, 'estimateMainLocationListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 4://  CTU
								if (_.has(availableStructures, 'estimateMainControllingListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 5://  Procurement-Structure
								if (_.has(availableStructures, 'estimateMainProcurementStructureService')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 6://  Enterprise Cost Group 1
								if (_.has(availableStructures, 'estimateMainLicCostgroup1ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 7://  Enterprise Cost Group 2
								if (_.has(availableStructures, 'estimateMainLicCostgroup2ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 8://  Enterprise Cost Group 3
								if (_.has(availableStructures, 'estimateMainLicCostgroup3ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 9://  Enterprise Cost Group 4
								if (_.has(availableStructures, 'estimateMainLicCostgroup4ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 10://  Enterprise Cost Group 5
								if (_.has(availableStructures, 'estimateMainLicCostgroup5ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 11://  Project Cost Group 1
								if (_.has(availableStructures, 'estimateMainPrjCostgroup1ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 12://  Project Cost Group 2
								if (_.has(availableStructures, 'estimateMainPrjCostgroup2ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 13://  Project Cost Group 3
								if (_.has(availableStructures, 'estimateMainPrjCostgroup3ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 14://  Project Cost Group 4
								if (_.has(availableStructures, 'estimateMainPrjCostgroup4ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 15://  Project Cost Group 5
								if (_.has(availableStructures, 'estimateMainPrjCostgroup5ListController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
							case 16://  Assembly-Structure
								if (_.has(availableStructures, 'estimateMainAssemblyCategoryTreeController')) {
									takeOverStruct(d.EstStructureFk, d.EstQuantityRelFk);
								}
								break;
						}
					}
				});

				if (!entityToAssign.validStructure || typeof(entityToAssign.Quantity)=== 'undefined'){
					entityToAssign.Quantity = 1;
					entityToAssign.validStructure = true;
				}
			}

			function assignDefaultLeadingStructures(entityToAssign){
				entityToAssign = entityToAssign || {};

				var availableStructures = estimateMainCreationService.getCreationProcessors();

				function assignStructure(structure){
					var hasStr = _.has(availableStructures, structure);
					if (hasStr) {
						var lStructureFn = availableStructures[structure];
						if (lStructureFn){
							lStructureFn(entityToAssign);
						}
					}
				}

				//  boq
				assignStructure('estimateMainBoqListController');

				//  schedule activity
				assignStructure('estimateMainActivityListController');

				//  location
				assignStructure('estimateMainLocationListController');

				//  CTU
				assignStructure('estimateMainControllingListController');

				//  Procurement-Structure
				assignStructure('estimateMainProcurementStructureService');

				//  Enterprise Cost Group 1
				assignStructure('estimateMainLicCostgroup1ListController');

				//  Enterprise Cost Group 2
				assignStructure('estimateMainLicCostgroup2ListController');

				//  Enterprise Cost Group 3
				assignStructure('estimateMainLicCostgroup3ListController');

				//  Enterprise Cost Group 4
				assignStructure('estimateMainLicCostgroup4ListController');

				//  Enterprise Cost Group 5
				assignStructure('estimateMainLicCostgroup5ListController');

				//  Project Cost Group 1
				assignStructure('estimateMainPrjCostgroup1ListController');

				//  Project Cost Group 2
				assignStructure('estimateMainPrjCostgroup2ListController');

				//  Project Cost Group 3
				assignStructure('estimateMainPrjCostgroup3ListController');

				//  Project Cost Group 4
				assignStructure('estimateMainPrjCostgroup4ListController');

				//  Project Cost Group 5
				assignStructure('estimateMainPrjCostgroup5ListController');

				//  Assembly-Structure
				assignStructure('estimateMainAssemblyCategoryTreeController');

			}

			function getAssemblyLookupSelectedItems(entity, assemblySelectedItems, isResolvedFromValidation){
				if(!service.isAssignAssemblyInProcess) {
					service.isAssignAssemblyInProcess = true;

					if (!_.isEmpty(assemblySelectedItems) && _.size(assemblySelectedItems) >= 1) {
						var assemblyIds = _.map(assemblySelectedItems, 'Id');
						var currentSelectedLineItems = service.getSelectedEntities();

						var postData = {
							LineItemCreationData: {
								SelectedItems: currentSelectedLineItems,
								ProjectId: service.getSelectedProjectId(),
								EstHeaderFk: service.getSelectedEstHeaderId()
							},
							AssemblyIds: assemblyIds,
							DragDropAssemlySourceType : $injector.get('estimateMainDragDropAssemblyTypeConstant').AssemblyLookUp
							//  SectionId:
						};

						if (!isResolvedFromValidation){
							angular.extend(postData.LineItemCreationData, _.first(currentSelectedLineItems));
						}

						lineItemsPromise = service.AssignAssemblyToLineItem(postData, currentSelectedLineItems, isResolvedFromValidation);


					}
				}
				return lineItemsPromise.then(function(data){
					var lineitem = _.filter(data,{'Id':entity.Id});
					return (lineitem && lineitem.length>0);
				});
			}

			function AssignAssemblyToLineItem(postData, currentSelectedLineItems, isResolvedFromValidation){

				return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/resolveassembliestolineitem', postData).then(function(response){
					var platformDataServiceDataProcessorExtension = $injector.get('platformDataServiceDataProcessorExtension');
					var platformGridAPI = $injector.get('platformGridAPI');
					var resourcesTreeFromMultiAssembly = response.data.LineItemsTotal || [];

					var data = serviceContainer.data;
					var gridId = 'b46b9e121808466da59c0b2959f09960';
					var currentSelectedLineItem = null; //  It is used at the end to highlight line item

					currentSelectedLineItems = currentSelectedLineItems || [];

					if(resourcesTreeFromMultiAssembly.length>0){
						var processList = function processList(items, level, callBack){
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
								//   add item to save
								data.itemList.push(item);
								data.addEntityToCache(item, data);
								data.markItemAsModified(item, data);
							}
						});

						var estLineItems2EstRules = response.data.EstLineItems2EstRules || [];

						var estLineItemsParams = response.data.EstLineItemsParams || [];

						var estPrjRules = response.data.EstPrjRules ||[];

						estimateRuleFormatterService.setEstLineItems2EstRules('EstLineItems2EstRules',estLineItems2EstRules);

						estimateRuleFormatterService.setEstPrjRules(estPrjRules);

						estimateParameterFormatterService.setEstLineItemsParam('EstLineItemsParam',estLineItemsParams);

						if(response.data.copyBoqItem){
							var output = [];
							$injector.get('cloudCommonGridService').flatten([response.data.copyBoqItem], output, 'BoQItems');
							_.forEach(output, function (boqitem) {
								boqitem.BoqItems = boqitem.BoQItems;
							});
							$injector.get('estimateMainBoqLookupService').addLookupData(output);
						}

						var estimateMainResourceService = $injector.get('estimateMainResourceService');
						//  Clear estimate resource modifications
						estimateMainResourceService.clearModifications();

						if (isResolvedFromValidation){ //  BulkEditor
							//  Add logic after resolved from validation
							estimateMainResourceService.load();
						}else{
							//   Refresh the line item grid and load resources
							serviceContainer.data.listLoaded.fire();

							//  Highlight is gone but
							//  serviceContainer.Data.selectedItem is kept, so we just highlight it instead of deselect and select  service.deselect({}).then(function(){ service.select(resource); })
							if (currentSelectedLineItem){
								var gridLineItem = platformGridAPI.grids.element('id', gridId);
								if (gridLineItem && gridLineItem.instance){
									var rows = gridLineItem.dataView.mapIdsToRows([currentSelectedLineItem.Id]);
									gridLineItem.instance.setSelectedRows(rows);
								}
							}
						}

						var estimateMainLineItem2MdlObjectService = $injector.get('estimateMainLineItem2MdlObjectService');
						estimateMainLineItem2MdlObjectService.gridRefresh();
					}
					service.isAssignAssemblyInProcess = false;

					if(response.data.lineItemsNoNeedToUpdate &&  response.data.lineItemsNoNeedToUpdate.length>0 ) {
						if (!isResolvedFromValidation) {
							var platformModalService = $injector.get('platformModalService');
							var modalOptions = {
								headerTextKey: 'estimate.main.assignAssembly.reportTitle',
								templateUrl: globals.appBaseUrl + 'estimate.main/templates/assign-assembly/line-item-assign-assembly-result-report.html',
								iconClass: 'ico-info',
								dataItems: response.data
							};
							platformModalService.showDialog(modalOptions);
						}
					}

					return response.data.lineItemsUpdated;

				}, function(){
					service.isAssignAssemblyInProcess = false;

					return [];
				});
			}

			function setEstiamteReadData(readData){
				estiamteReadData = readData;
			}

			function getEstiamteReadData(){
				return estiamteReadData;
			}

			function extendSearchFilterAssign(filterRequest){
				//   init furtherFilters - add filter IDs from filter structures
				var filterType = estimateMainFilterService.getFilterFunctionType();

				//   first remove all existing leading structure filters
				filterRequest.furtherFilters = _.filter(filterRequest.furtherFilters, function(i) { return i.Token.indexOf('FILTER_BY_STRUCTURE') < 0; });

				var leadingStructuresFilters = _.filter(_.map(estimateMainFilterService.getAllFilterIds(), function (v, k) {
					if (_.size(v) === 0) {
						return undefined;
					}
					//   type 0 - assigned;
					//   -> no change needed

					//   type 1 - assigned and not assigned
					if (filterType === 1) {
						v.push('null');
					}
					//   type 2 - not assigned
					else if (filterType === 2) {
						v = ['null'];
					}
					var value = v.join(',');
					return {Token: 'FILTER_BY_STRUCTURE:' + k, Value: value};
				}), angular.isDefined);

				filterRequest.furtherFilters = filterRequest.furtherFilters ? _.concat(filterRequest.furtherFilters, leadingStructuresFilters) : leadingStructuresFilters;
				lastFilter = filterRequest;
			}

			function setListView(_filterView, customView) {
				filterView.currentViewType = _filterView;
				if (customView !== null)
				{
					filterView.currentCustomView = customView.ViewConfig.columns.combineColumns.map(function (col) {
						return col.field;
					}).join(',');
					filteredCustomColumn = filterView.currentCustomView;
				}
				setFilteredGridColumns();
			}

			function setAvailableGridColumns(/* cols */) {
				// availableGridColumns = cols;
			}

			function getDynamicColumns() {
				var dynamicViewFileds = [];
				var dynamicColumns = estCombinedLineItemDynamicConfigurationService.getDynamicCols();
				_.each(dynamicColumns, function (dynamicColumn) {
					var index = _.indexOf(filterView.currentServerSideViewFields, dynamicColumn.field);
					if (index === -1 && _.indexOf(dynamicViewFileds, dynamicColumn.field) === -1) {
						dynamicViewFileds.push(dynamicColumn.field);
					}
				});

				return dynamicViewFileds;
			}

			function setCombineFilters(currentViewType){

				var grid = null;

				if(gridId){
					grid = platformGridAPI.grids.element('id', gridId);
				}

				if(!grid){
					grid = platformGridAPI.grids.element('id', '681223e37d524ce0b9bfa2294e18d650'); //  Sets grid id to estimate main line item container because no Combine
					//   loaded yet
				}
				var allColumns = grid && grid.columns && grid.columns.current ? grid.columns.current : [];

				var columnsToRemove = ['Code',
					'__rt$data.history.insertedAt',
					'__rt$data.history.insertedBy',
					'__rt$data.history.updatedAt',
					'__rt$data.history.updatedBy'];

				var viewFields = [];

				//  TODO: Remove when this is supported
				angular.forEach(allColumns,function (column) {
					if(column.field.indexOf('Desc') !== -1 || column.field === 'indicator' || column.field === 'image' || column.field.indexOf('Quantity') !== -1){
						columnsToRemove.push(column.field);
					}
				});//  removes any description options as those do not exist in DB for line item entity

				//  Manually add Description Info as it is a specizl case
				viewFields.push('DescriptionInfo');

				switch(currentViewType){
					case 0:
						filterView.currentServerSideViewFields = estimateMainCombineColumnService.getStandardColumnList();

						var dynamicViewFileds = getDynamicColumns();

						filterView.currentServerSideViewFields = filterView.currentServerSideViewFields.concat(dynamicViewFileds);
						break;
					case 1:

						filterView.currentServerSideViewFields = estimateMainCombineColumnService.getItemUnitCostList();
						break;
					case 2:
						filterView.currentServerSideViewFields = estimateMainCombineColumnService.getCustomList(filteredCustomColumn);
						break;
					default:
						break;
				}

			}

			function setFilteredGridColumns() {
				var grid = platformGridAPI.grids.element('id', gridId);

				switch(filterView.currentViewType) {
					case 0:
						//   Standard View
						if (grid && grid.instance) {

							angular.forEach(columnsRemoved, function(col) {
								grid.columns.current.push(col);
							});

							platformGridAPI.columns.configuration(gridId, grid.columns.current);
							platformGridAPI.grids.resize(gridId);
						}

						break;
					case 1:
						//   Item, Unit Cost View
						columnsRemoved = {};

						if (grid && grid.instance) {

							angular.forEach(columnsRemoved, function(col) {
								grid.columns.current.push(col);
							});

							platformGridAPI.columns.configuration(gridId, grid.columns.current);
							platformGridAPI.grids.resize(gridId);
						}

						break;
					case 2:
						//   Custom View
						platformGridAPI.columns.configuration(gridId, grid.columns.current);
						platformGridAPI.grids.resize(gridId);
						break;
					default:
						//   Show All Available Columns
						platformGridAPI.columns.configuration(gridId, grid.columns.current);
						platformGridAPI.grids.resize(gridId);
				}
			}

			function changeCombinedValues(selectedLineItem, field, value) {
				if (Object.prototype.hasOwnProperty.call(selectedLineItem, 'CombinedLineItems') && selectedLineItem.CombinedLineItems !== null) {
					if (field === 'DescriptionInfo') {
						angular.forEach(selectedLineItem.CombinedLineItems, function (lineItem) {
							lineItem[field].Translated = selectedLineItem[field].Translated;
						});
					} else {
						let numLineItems = selectedLineItem.CombinedLineItems.length;

						angular.forEach(selectedLineItem.CombinedLineItems, function (lineItem) {
							if (typeof lineItem[field] === 'number') {
								lineItem[field] = value / numLineItems;
							} else {
								lineItem[field] = value;
							}
						});
					}
				}

				return selectedLineItem;
			}

			function doPrepareUpdateCall(dataToUpdate){
				if(Object.hasOwnProperty.call(dataToUpdate, 'CombinedLineItems')){
					dataToUpdate.CombinedViewList = service.getViewList();

					dataToUpdate.confDetail = estimateMainCommonService.collectConfDetailColumnsToSave(dataToUpdate.CombinedLineItems, $rootScope.dynColumns);
				}

				dataToUpdate.ProjectId = estimateMainService.getSelectedProjectId();
			}

			function getEstTypeIsWQReadOnly(){
				return isWQReadOnly;
			}

		}]);
})();
