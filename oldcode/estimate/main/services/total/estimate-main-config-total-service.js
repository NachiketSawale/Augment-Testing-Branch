/**
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateConfigTotalService
	 * @function
	 *
	 * @description
	 * estimateLineItemTotalService is the data service for totals of line items.
	 */
	estimateMainModule.factory('estimateConfigTotalService', [
		'platformDataServiceFactory',
		'$injector',
		'estimateMainResourceService',
		'estimateMainService',
		'$translate',
		'estimateMainFilterCommon',
		'_',
		'PlatformMessenger',
		'platformGenericStructureService',
		'cloudDesktopSidebarService',
		function (platformDataServiceFactory,
			$injector,
			estimateMainResourceService,
			estimateMainService,
			$translate,
			estimateMainFilterCommon,
			_,
			PlatformMessenger,
			platformGenericStructureService,
			cloudDesktopSidebarService
		) {

			let
				ctrlScope = {},
				isLoad = false,
				isFristLoad = false,
				lastSelectedKey = null;


			let totalTitles = {
					'configTotalGrand': 'estimate.main.grandTotalContainer',
					'configTotalLineItem': 'estimate.main.lineItemTotalContainer',
					'configTotalFilter': 'estimate.main.filteredTotalContainer'
				},

				currentActiveIcon = 'configTotalGrand',

				calculatorIcon = {
					id: 'estimate-main-config-total-recalculate',
					caption: 'estimate.main.dirtyRecalculate',
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					fn: function () {
					// only do the re-calculation once the user click on a calc-button
					// loadTotalData(currentActiveIcon);
						recalculate();
					}
				};

			// request params to server
			let requestParams = {};

			let isFilterZeroValue = false;


			function initRequestParams() {
				let initParams = {
					estHeaderFk: estimateMainService.getSelectedEstHeaderId() || -1,
					prjProjectFk: estimateMainService.getSelectedProjectId() || -1
				};
				return initParams;
			}

			let options = {
				flatNodeItem: {
					module: estimateMainModule,
					serviceName: 'estimateConfigTotalService',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/resource/',
						endRead: 'estimateconfigtotal',
						initReadData: function initReadData(readData) {
							if(currentActiveIcon){
								buildRequest(currentActiveIcon);
							}
							// get sidebar filter
							let filterRequest = _.cloneDeep(cloudDesktopSidebarService.getFilterRequestParams());
							requestParams.filterRequest = filterRequest;
							if(requestParams.prjProjectFk<=0) {
								requestParams.estHeaderFk =  estimateMainService.getSelectedEstHeaderId() || -1;
								requestParams.prjProjectFk = estimateMainService.getSelectedProjectId() || -1;
							}

							let groupingFilter = platformGenericStructureService.getGroupingFilterRequest();
							if (groupingFilter) {
								requestParams.filterRequest.groupingFilter = groupingFilter;
							}

							if(angular.isUndefined(requestParams.configTotalType) || requestParams.configTotalType === 'lineItem_total'){
								fillParamWithLineItemIds(requestParams);
							}else{
								estimateMainService.extendSearchFilter(requestParams.filterRequest);
							}

							angular.extend(readData, requestParams);
						},
						usePostForRead: true
					},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead
						}
					},
					entityRole: {
						node: {
							itemName: 'ConfigTotal',
							parentService: estimateMainService
						}
					},
					actions: {},
					modification: 'none'
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(options),
				service = serviceContainer.service;

			serviceContainer.data.doNotUnloadOwnOnSelectionChange = true;

			function generateStyle(item, configDetails, configurationColumns) {
				// the styles from total config
				let cssClass = '',
					config = _.find(configDetails, function(c){
						return c.Id === item.Id;
					}) || {};
				if (config.IsBold) {
					cssClass += ' cm-strong ';
				}
				if (config.IsUnderline) {
					cssClass += ' cm-link '; // from \cloud.style\content\css\lib\codemirror.css
				}
				if (config.IsItalic) {
					cssClass += ' cm-em ';
				}

				// item.cssClass = styleConfigs[item.Id];
				// apply the css class to cell
				// DefectId - 21310 Change Made By SSaluja 20/12/2019 Added column 'CostExchangeRate1','CostExchangeRate2'
				_.intersection(configurationColumns, _.keys(item))
					.map(function (field) {
						item.__rt$data = item.__rt$data || {};
						item.__rt$data.cellCss = item.__rt$data.cellCss || {};
						item.__rt$data.cellCss[field] = item.__rt$data.cellCss[field] || '';
						item.__rt$data.cellCss[field] += cssClass;
					});
			}



			function incorporateDataRead(readData, data) {
				/* cloudDesktopSidebarService.updateFilterResult({
					isPending: false,
					filterRequest:  readData.filterRequest,
					filterResult: readData.filterResult
				}); */

				// To get Estimate Line Item Currency
				let estLineItems = estimateMainService.getList();

				let exchRate1,
					exchRate2,
					currency1,
					currency2;

				if( estLineItems && estLineItems.length > 0 ){

					// only need first line item
					exchRate1 = estLineItems[0].ExchangeRate1;

					exchRate2 = estLineItems[0].ExchangeRate2;

					currency1 = estLineItems[0].Currency1Fk;

					currency2 = estLineItems[0].Currency2Fk;
				}else{

					exchRate1 = 0;

					exchRate2 = 0;

					currency1 = null;

					currency2 = null;
				}

				let listData = readData.ConfigTotalResult || [],
					completeConfig = readData.totalComplelteConfig || {},
					configDetails = completeConfig.EstTotalsConfigDetails || [];

				let configurationColumns = getConfigurationColumns('07b7499a1f314f16a94edddc540c55d4');

				// load user defined column value
				let estimateMainConfigTotalDynamicUserDefinedColumnService = $injector.get('estimateMainConfigTotalDynamicUserDefinedColumnService');
				estimateMainConfigTotalDynamicUserDefinedColumnService.attachDataToColumn(listData, true);

				listData.map(function(i){
					i.Total = i.CostTotal;
					i.BudgetTotal = i.WQBudget;
					i.Quantity = i.QuantityTotal || '';
					i.Description = i.DescriptionInfo.Translated || '';
					i.Currency1Fk = currency1;
					i.Currency2Fk = currency2;
					i.FromDJC = i.DirectTotalStatistics > 0 ? i.Total / i.DirectTotalStatistics * 100 : 0;
					i.FromTJC = i.GrandTotalStatistics > 0 ? i.Total / i.GrandTotalStatistics * 100 : 0;
					let costInLocalCurrency1 = i.Total * exchRate1;
					let costInLocalCurrency2 = i.Total * exchRate2;
					let budgetInLocalCurrency1 = i.Total * exchRate1;
					let budgetInLocalCurrency2 = i.Total * exchRate2;
					let budgetInForeignCurrency1 = i.BudgetTotal * exchRate1;
					let budgetInForeignCurrency2 = i.BudgetTotal * exchRate2;
					if(!isNaN(budgetInForeignCurrency1)){
						i.ForeignBudget1 = budgetInForeignCurrency1;
					}else{
						i.ForeignBudget1 = 0;
					}
					if(!isNaN(budgetInForeignCurrency2)){
						i.ForeignBudget2 = budgetInForeignCurrency2;
					}else{
						i.ForeignBudget2 = 0;
					}
					if(!isNaN(costInLocalCurrency1)){
						i.CostExchangeRate1 = costInLocalCurrency1;
					}
					if(!isNaN(costInLocalCurrency2)){
						i.CostExchangeRate2 = costInLocalCurrency2;
					}
					if(!isNaN(budgetInLocalCurrency1)){
						i.budgetInLocalCurrency1 = costInLocalCurrency1;
					}else{
						i.budgetInLocalCurrency1 = 0;
					}
					if(!isNaN(budgetInLocalCurrency2)){
						i.budgetInLocalCurrency2 = costInLocalCurrency2;
					}else{
						i.budgetInLocalCurrency2 = 0;
					}
					if (i.StructureAssigned){
						serviceContainer.data.isActiveUnitRateStrQty = true;

						i.UnitRateStrQty = i.StructureQty === 0 ? 'NaN.undefined' : i.Total/ i.StructureQty;
					}else{
						serviceContainer.data.isActiveUnitRateStrQty = false;

						i.UnitRateStrQty = $translate.instant('basics.customize.noAssignment');
						i.StructureQty = '';
						i.StructureUom = '';
					}

					generateStyle(i, configDetails, configurationColumns);
				});

				if (isLeadingStrActive() && _.includes(['configTotalFilter', 'configTotalLineItem'], getTotalKey())){
					activateStrLayout(service.scope());
				}else{
					deactivateStrLayout(service.scope());
				}

				if(isFilterZeroValue){
					let filterZoreColumn = getVisibleFilterZeroColumns('07b7499a1f314f16a94edddc540c55d4');
					listData = filterZeroData(filterZoreColumn, listData);
				}
				// resolve the data
				let result = data.handleReadSucceeded(listData, data);

				return result;

			}

			function fillParamWithLineItemIds(params){
				var currentLineItems = estimateMainService.getSelectedEntities();
				if(!currentLineItems || currentLineItems.length === 0)
				{
					currentLineItems = estimateMainService.getSelectedEntities();
				}
				params.lineItemIds = [];
				if(_.isEmpty(currentLineItems)) {
					params.readyToLoad = false;
				}else{
					angular.forEach(currentLineItems, function (item) {
						if (item){
							params.lineItemIds.push(item.Id);
						}
					});

				}
			}

			function buildRequestParams(totalKey) {
				if(!_.includes(_.keys(totalTitles), totalKey)) {
					totalKey = _.head(_.keys(totalTitles));
				}
				let params = {
					readyToLoad: true
				};

				switch (totalKey)
				{
					case 'configTotalGrand':
						params.configTotalType = 'grand_total';
						break;
					case 'configTotalLineItem':
						params.configTotalType = 'lineItem_total';
						fillParamWithLineItemIds(params);
						break;
					case 'configTotalFilter':
						params.configTotalType = 'filtered_total';
						// get all the filter conditions from leading structure
						var filterConditions = estimateMainFilterCommon.getAllFilterConditions() || {};
						params = angular.extend(params, filterConditions);
						break;
				}
				return params;
			}


			// click the calculator button
			function recalculate() {
				// first save the data and then calculate again
				estimateMainService.update().then(function () { // first save the editing into db
					updateEstimateTotals().then(function(response){ // update the totals result in db
						// handle response to avoid concurrency issue
						let lineItemsToMerge = response.data ? response.data.LineItems : [];
						estimateMainService.addList(lineItemsToMerge);

						// after update estimate, recalculate the totals
						loadTotalData(lastSelectedKey);
					});

				});
			}

			// update the totals in db first then show the summary
			function updateEstimateTotals() {
				let paras = initRequestParams();
				let currentLineItem = estimateMainService.getSelected() || {Id: 0};
				return $injector.get('$http').post(
					globals.webApiBaseUrl + 'estimate/main/lineitem/updateestimate',
					{
						EstHeaderFk: paras.estHeaderFk,
						ProjectId: paras.prjProjectFk,
						SelectedItemId: currentLineItem.Id,
						UpdateFrmPrjCostCodes: false,
						UpdateFrmPrjMaterial: false,
						CalculateRuleParam: false,
						UpdateBoq: false,
						CalculateEscalation: false
					}
				);
			}

			function setIconHighlight() {
				// let totalType;
				if(!_.isEmpty(estimateMainService.getSelected())) {
					activateIcon(scope(), 'configTotalLineItem');
				} else if(isFilterConditionSet()) {
					activateIcon(scope(), 'configTotalFilter');
				}else{
					activateIcon(scope(), 'configTotalGrand');
				}
			}

			function buildRequest(totalKey) {
				requestParams = angular.extend(
					initRequestParams(),
					buildRequestParams(totalKey)
				);
			}

			function loadTotalData(totalKey, ignoreLoad) {
				// build the request parameters
				buildRequest(totalKey);

				if(!ignoreLoad){
					if(requestParams.readyToLoad === true) {
						service.load();
					}else{
						service.setList([]);
					}
				}

			}


			function activateIcon(scope, totalKey, ignoreLoad){
				setActiveIcon(scope, totalKey);
				loadTotalData(totalKey, ignoreLoad);
				totalDataDirty(false);
			}

			function changeIcon(scope, totalKey){
				activateIcon(scope, totalKey, totalKey !== 'configTotalGrand');
			}

			function activateStrLayout(scope){
				let estimateMainConfigUiTotalService = $injector.get('estimateMainConfigUiTotalService');

				let platformGridAPI = $injector.get('platformGridAPI');
				let fields = ['UnitRateStrQty', 'StructureQty', 'StructureUom'];

				let grid = platformGridAPI.grids.element('id', scope.gridId);
				if (grid && grid.instance) {
					let uiService = $injector.get('estimateMainCommonUIService').createUiService(fields);
					estimateMainConfigUiTotalService.attachData({'estLineItemConfig': uiService.getStandardConfigForListView().columns});

					estimateMainConfigUiTotalService.fireRefreshConfigLayout();
				}
			}

			function deactivateStrLayout(/* scope */){
				let estimateMainConfigUiTotalService = $injector.get('estimateMainConfigUiTotalService');
				estimateMainConfigUiTotalService.detachData('estLineItemConfig');
				estimateMainConfigUiTotalService.fireRefreshConfigLayout();
			}

			function isLeadingStrActive(){
				return serviceContainer.data.isActiveUnitRateStrQty;
			}

			// set the active total icon
			function setActiveIcon(scope, totalKey) {
				if(!_.includes(_.keys(totalTitles), totalKey)) {
					totalKey = _.head(_.keys(totalTitles));
				}
				try {
					if(scope.tools) {
						let toolItem = _.find(scope.tools.items, function (i) {
							return i.totalIconsGroup && i.totalIconsGroup === '3typesOfTotal';
						});
						// eslint-disable-next-line no-prototype-builtins
						if (toolItem && toolItem.hasOwnProperty('list')) {
							toolItem.list.activeValue = totalKey;
						}
						setContainerTitle(scope, totalKey);
						scope.tools.update();
						currentActiveIcon = totalKey;
						lastSelectedKey = totalKey;
					}
				} catch (e) {
					// eslint-disable-next-line no-console
					console.error(e);
				}

			}

			// set the container title on run time
			function setContainerTitle(scope, totalKey) {
				let title = $translate.instant(totalTitles[totalKey]);
				if(_.isEmpty(title)) {
					return false;
				}
				try{
					// scope.subviewCtrl.content[scope.subviewCtrl.activeTab].title =title ;
					scope.title =title;
					ctrlScope.title = title;
				}catch (e){
					// eslint-disable-next-line no-console
					console.error(e);
				}

			}

			function initTotalIcons(scope) {
				let totalKey = 'configTotalGrand';
				setContainerTitle(scope, totalKey);
				let tools = [
					{
						id: 'config_total_calculatorTools',
						totalIconsGroup: '3typesOfTotal', // a flag to distinguish the icons
						type: 'sublist',
						list: {
							cssClass: 'radio-group',
							// activeValue: totalKey,
							showTitles: true,
							items: [
								calculatorIcon,
								{
									id: 'config_total_grand',
									caption: totalTitles.configTotalGrand,
									type: 'radio',
									value: 'configTotalGrand',
									iconClass: 'tlb-icons ico-total-grand',
									fn: function () {
										// setActiveIcon(scope, 'configTotalGrand');
										// loadTotalData('configTotalGrand');
										activateIcon(scope, 'configTotalGrand');
									}
								},
								{
									id: 'config_total_line_item',
									caption: totalTitles.configTotalLineItem,
									type: 'radio',
									value: 'configTotalLineItem',
									iconClass: 'tlb-icons ico-total-line-item',
									fn: function () {
										// setActiveIcon(scope, 'configTotalLineItem');
										// loadTotalData('configTotalLineItem');
										activateIcon(scope, 'configTotalLineItem');
									}
								},
								{
									id: 'config_total_filter',
									caption: totalTitles.configTotalFilter,
									type: 'radio',
									value: 'configTotalFilter',
									iconClass: 'tlb-icons ico-total-filter',
									fn: function () {
										// setActiveIcon(scope, 'configTotalFilter');
										// loadTotalData('configTotalFilter');
										activateIcon(scope, 'configTotalFilter');
									}
								}
							]
						}
					},
					{
						id: 'filterZeroValue',
						caption: 'procurement.common.total.toolbarFilter',
						type: 'check',
						value: isFilterZeroValue,
						iconClass: 'tlb-icons ico-on-off-zero',
						fn: function () {
							isFilterZeroValue = this.value;
							if(!scope.tools){
								return;
							}
							let calculatorTools = _.find(scope.tools.items,function (item) {
								return item.id === 'config_total_calculatorTools';
							});
							let activeValue = calculatorTools.list.activeValue;
							if(activeValue){
								activateIcon(scope, activeValue);
							}
						}
					},

				];
				return tools;
			}


			function isFilterConditionSet() {
				let filterConditions = estimateMainFilterCommon.getAllFilterConditions() || {},
					rs = false;
				_.values(filterConditions).map(function(ids){
					if(_.isArray(ids) && ids.length > 0){
						rs = true;
					}
				});

				if (!rs){
					let filterRequest = cloudDesktopSidebarService.getFilterRequestParams();
					if (filterRequest && ( filterRequest.Pattern || filterRequest.IsEnhancedFilter )){
						rs = true;
					}
				}
				// when lineitem structure change, set true
				if (!rs){
					let groupingFilter = platformGenericStructureService.getGroupingFilterRequest();
					if(groupingFilter)
					{
						rs = true;
					}
				}
				return rs;
			}

			function isStructureFilterSet() {
				let filterConditions = estimateMainFilterCommon.getAllFilterConditions() || {},
					rs = false;
				_.values(filterConditions).map(function(ids){
					if(_.isArray(ids) && ids.length > 0){
						rs = true;
					}
				});

				// when lineitem structure change, set true
				if (!rs){
					let groupingFilter = platformGenericStructureService.getGroupingFilterRequest();
					if(groupingFilter)
					{
						rs = true;
					}
				}
				return rs;
			}

			function isEnhancedFilterSet() {
				let rs = false;
				let filterRequest = $injector.get('estimateMainFilterService').getFilterRequest();
				if (filterRequest && ( filterRequest.Pattern || filterRequest.IsEnhancedFilter )){
					rs = true;
				}
				return rs;
			}

			function changeCalculatorIcon(isDirty) {
				try {
					if(isDirty === true || _.isNull(isDirty)) {
						calculatorIcon.iconClass = 'control-icons ico-calculate-failed';
					}else{
						calculatorIcon.iconClass = 'control-icons ico-recalculate';
					}
					scope().tools.update();
				} catch (e) {
					// eslint-disable-next-line no-console
					console.error(e);
				}
			}
			// set , get isDirty
			function totalDataDirty(isDirty) {
				if(_.isUndefined(isDirty) || _.isNull(isDirty)) {
					isDirty = true;
				}
				if(isDirty !== true) {
					isDirty = false; // bool, only true or false
				}
				changeCalculatorIcon(isDirty);
			}

			// get, set
			function scope(controllerScope) {
				if(controllerScope) {
					ctrlScope = controllerScope;
				}
				return ctrlScope;
			}

			function getTotalKey(){
				return currentActiveIcon;
			}

			function  setIsLoad(value){
				isLoad = value;
			}

			function getIsLoad(){
				return isLoad;
			}

			function setIsFristLoad(value){
				isFristLoad = value;
			}

			function getIsFristLoad(){
				return isFristLoad;
			}

			function getConfigurationColumns(gridId) {
				let columns = [];
				let platformGridAPI = $injector.get('platformGridAPI');
				let gridItem = platformGridAPI.grids.element('id', gridId);
				if(!gridItem){
					return columns;
				}

				if(!gridItem.instance){
					return columns;
				}

				let configurationColumn = platformGridAPI.columns.configuration(gridId);
				if(!configurationColumn){
					return columns;
				}

				_.forEach(configurationColumn.current, function (item) {
					if(item.id !== 'indicator'){
						columns.push(item.field);
					}
				});

				return columns;
			}

			function getLastSelectedKey(){
				return lastSelectedKey;
			}

			function setLastSelectedKey(key){
				lastSelectedKey = key;
			}

			function getVisibleFilterZeroColumns(gridId) {
				let columns = [];
				let platformGridAPI = $injector.get('platformGridAPI');
				let gridItem = platformGridAPI.grids.element('id', gridId);
				if(!gridItem){
					return columns;
				}

				if(!gridItem.instance){
					return columns;
				}

				let configurationColumn = platformGridAPI.columns.configuration(gridId);
				if(!configurationColumn){
					return columns;
				}

				let filterDomain = ['money','decimal','quantity'];
				_.forEach(configurationColumn.visible, function (item) {
					if((item.domain && _.includes(filterDomain,item.domain)) || item.id === 'fromdjc' || item.id === 'fromtjc'){
						columns.push(item.field);
					}
				});

				return columns;
			}

			function filterZeroData(filterZoreColumn,listData) {
				let notZeroData = [];
				_.forEach(listData,function (item) {
					let isZeroData = true;
					_.forEach(filterZoreColumn,function (field) {
						if(item[field] !== 0 && item[field] !== ''){
							isZeroData = false;
						}
					});
					if(!isZeroData){
						notZeroData.push(item);
					}
				});
				return notZeroData;
			}

			function getToolActiveValue(items) {
				let calculatorTools = _.find(items,function (item) {
					return item.id === 'config_total_calculatorTools';
				});
				if(!calculatorTools){
					return null;
				}
				return calculatorTools.list.activeValue;
			}

			function getConfigTotalType(){
				return requestParams.configTotalType;
			}

			/**
			 * when marker changes for boq, set the boqitem info to requestParams
			 * @param boqItemIds
			 */
			function setRequestParamsBoqItemInfo(boqItemIds){
				requestParams.BoqItemFk = boqItemIds;
			}

			return angular.extend(service, {
				toolHasAdded: false,
				loadTotalData: loadTotalData,
				isFilterConditionSet: isFilterConditionSet,
				initTotalIcons: initTotalIcons,
				activateIcon: activateIcon,
				changeIcon: changeIcon,
				setActiveIcon: setActiveIcon,
				totalDataDirty: totalDataDirty,
				setIconHighlight: setIconHighlight,
				isLeadingStrActive: isLeadingStrActive,
				scope: scope,
				multiLineItemsChanged: new PlatformMessenger(),
				setIsLoad: setIsLoad,
				getIsLoad: getIsLoad,
				setIsFristLoad: setIsFristLoad,
				getIsFristLoad: getIsFristLoad,
				getLastSelectedKey: getLastSelectedKey,
				setLastSelectedKey: setLastSelectedKey,
				isEnhancedFilterSet: isEnhancedFilterSet,
				isStructureFilterSet: isStructureFilterSet,
				getToolActiveValue : getToolActiveValue,
				getConfigTotalType : getConfigTotalType,
				setRequestParamsBoqItemInfo: setRequestParamsBoqItemInfo
			});
		}]);
})(angular);
