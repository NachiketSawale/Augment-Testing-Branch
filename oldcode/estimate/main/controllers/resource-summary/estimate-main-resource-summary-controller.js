/**
 * Created by bel on 2018/6/1.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	/* global Slick */
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc controller
	 * @name estimateMainResourceSummaryController
	 * @function
	 *
	 * @description
	 * Controller for total costs.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainResourceSummaryController',
		['$scope', '$injector', '$timeout', '$q', 'platformGridAPI', '$translate',
			'platformGridControllerService',
			'estimateMainCommonUIService',
			'estimateDefaultGridConfig',
			'estimateMainService',
			'cloudDesktopSidebarService',
			'estimateResourcesSummaryService',
			'estimateMainResourceSummaryValidateService',
			'estimateMainResourceSummaryConfigService',
			'estimateMainResourceSummaryConfigDataService',
			'projectMainUpdatePricesWizardCommonService',
			'estimateMainUpdateItemsService',
			'estimateMainSidebarWizardService',
			'cloudDesktopPinningContextService',
			'estimateCommonControllerFeaturesServiceProvider',
			'platformRuntimeDataService',
			'mainViewService',
			function ($scope, $injector, $timeout, $q, platformGridAPI, $translate,
					  platformGridControllerService,
					  estimateMainCommonUIService,
					  estimateDefaultGridConfig,
					  estimateMainService,
					  cloudDesktopSidebarService,
					  estimateResourcesSummaryService,
					  estimateMainResourceSummaryValidateService,
					  estimateMainResourceSummaryConfigService,
					  estimateMainResourceSummaryConfigDataService,
					  projectMainUpdatePricesWizardCommonService,
					  estimateMainUpdateItemsService,
					  estimateMainSidebarWizardService,
					  cloudDesktopPinningContextService,
					  estimateCommonControllerFeaturesServiceProvider,
					  platformRuntimeDataService,
					  mainViewService) {

				$scope.entity = {
					isLoading: false
				};

				function initHeaderInfoData() {
					$scope.filteredTotalCostEntity = {
						CostSummary: null,
						CostModificationPercent: null,
						OldCostModificationPercent:null,
						AdjCostSummary: null,
						OldAdjCostSummary:null
					};

					$scope.totalCostEntity ={
						CostSummary: null,
						CostModificationPercent: null,
						OldCostModificationPercent:null,
						CostModificationAbsolute: null,
						OldCostModificationAbsolute:null,
						AdjCostSummary: null,
						OldAdjCostSummary:null,
						MarginOne: null,
						MarginTwo: null,
						GrandTotal: null,
						isAdjust: false
					};
				}
				initHeaderInfoData();

				$scope.isHeaderInfoReadonly = function () {
					let configId = estimateResourcesSummaryService.getConfigId();
					let readOnly =  estimateResourcesSummaryService.isDefaultSettingsChanged() || estimateMainResourceSummaryConfigDataService.setResourceSummaryHeaderInfoReadOnly(parseInt(configId));
					$scope.showHelpInfo = readOnly;
					return readOnly;
				}

				$scope.onKeyDown = function (event, valueEntityName, columnName) {
					if(event.keyCode === 27){
						undoInputValue(event, valueEntityName ,columnName);
					}
				}

				function undoInputValue(event, undoValueEntityName, columnName) {
					if(!undoValueEntityName || !columnName){
						return;
					}

					let undoValueEntity = $scope[undoValueEntityName];
					if(_.isNull(undoValueEntity[columnName])){
						return;
					}

					event.target.value = estimateResourcesSummaryService.formatNumberToPercent(undoValueEntity[columnName]);
					estimateResourcesSummaryService.setIsUndoInputValue(undoValueEntityName, columnName, true);
					event.target.classList.remove('active');
					event.target.blur();
					if (!event.target.hasAttribute('data-focus-listener-added')) {
						event.target.addEventListener('focus', function(event) {
							let split = event.target.getAttribute('data-ng-model').split('.');
							$scope.headerInfoValueChange(split[0], split[1]);
						});
						event.target.setAttribute('data-focus-listener-added', 'true');
					}
					event.preventDefault();
					event.stopPropagation();
				}

				$scope.headerInfoValueChange = function (changeValueEntityName, changeValueEntityColumnName) {
					let changeValueEntity = $scope[changeValueEntityName];
					if(_.isNull(changeValueEntity[changeValueEntityColumnName])){
						return;
					}
					let OldChangeValueEntityColumnName = 'Old' + changeValueEntityColumnName;
					if(estimateResourcesSummaryService.getIsUndoInputValue(changeValueEntityName, changeValueEntityColumnName)){
						changeValueEntity[changeValueEntityColumnName] = changeValueEntity[OldChangeValueEntityColumnName];
						estimateResourcesSummaryService.setIsUndoInputValue(changeValueEntityName, changeValueEntityColumnName,false);
						return;
					}

					if(changeValueEntity[changeValueEntityColumnName] === ''){
						changeValueEntity[changeValueEntityColumnName] = 0;
					}

					if(changeValueEntity[changeValueEntityColumnName] === changeValueEntity[OldChangeValueEntityColumnName]){
						return;
					}
					reCalculatedResourceSummary(changeValueEntity, changeValueEntityName, changeValueEntityColumnName, OldChangeValueEntityColumnName);
				};

				function reCalculatedResourceSummary(changeValueEntity, changeValueEntityName, changeValueEntityColumnName, OldChangeValueEntityColumnName) {
					let restGrowthPercentage = 0;
					if(changeValueEntityName === 'filteredTotalCostEntity'){
						switch (changeValueEntityColumnName){
							case 'CostModificationPercent':
								if(changeValueEntity.AdjCostSummary === 0){
									restGrowthPercentage = changeValueEntity[changeValueEntityColumnName];
								} else {
									restGrowthPercentage = (changeValueEntity[changeValueEntityColumnName] - changeValueEntity[OldChangeValueEntityColumnName]) * changeValueEntity.CostSummary / changeValueEntity.AdjCostSummary;
								}
								break;
							case 'AdjCostSummary':
								if(changeValueEntity.OldAdjCostSummary === 0){
									restGrowthPercentage = (changeValueEntity[changeValueEntityColumnName] - changeValueEntity.CostSummary) / changeValueEntity.CostSummary * 100;
								} else {
									let restAdjCostSummary = changeValueEntity[changeValueEntityColumnName] - changeValueEntity[OldChangeValueEntityColumnName];
									restGrowthPercentage = restAdjCostSummary / changeValueEntity[OldChangeValueEntityColumnName] * 100;
								}
								break;
						}
					} else if(changeValueEntityName === 'totalCostEntity'){
						let totalRemainingDistribution = 0;
						switch (changeValueEntityColumnName){
							case 'CostModificationPercent':
								totalRemainingDistribution = changeValueEntity.CostSummary * (1 + changeValueEntity[changeValueEntityColumnName] / 100) - changeValueEntity.AdjCostSummary;
								if($scope.filteredTotalCostEntity.AdjCostSummary === 0){
									restGrowthPercentage = (totalRemainingDistribution - $scope.filteredTotalCostEntity.CostSummary) / $scope.filteredTotalCostEntity.CostSummary * 100;
								} else {
									restGrowthPercentage = totalRemainingDistribution / $scope.filteredTotalCostEntity.AdjCostSummary * 100;
								}
								break;
							case 'CostModificationAbsolute':
								totalRemainingDistribution = changeValueEntity[changeValueEntityColumnName] - changeValueEntity[OldChangeValueEntityColumnName];
								if($scope.filteredTotalCostEntity.AdjCostSummary === 0){
									restGrowthPercentage = (totalRemainingDistribution - $scope.filteredTotalCostEntity.CostSummary) / $scope.filteredTotalCostEntity.CostSummary * 100;
								}else {
									restGrowthPercentage = totalRemainingDistribution / $scope.filteredTotalCostEntity.AdjCostSummary * 100;
								}
								break;
							case 'AdjCostSummary':
								totalRemainingDistribution = changeValueEntity[changeValueEntityColumnName] - changeValueEntity[OldChangeValueEntityColumnName];
								if($scope.filteredTotalCostEntity.AdjCostSummary === 0){
									restGrowthPercentage = (totalRemainingDistribution - $scope.filteredTotalCostEntity.CostSummary) / $scope.filteredTotalCostEntity.CostSummary * 100;
								}else {
									restGrowthPercentage = totalRemainingDistribution / $scope.filteredTotalCostEntity.AdjCostSummary * 100;
								}
								break;
						}
					}

					let gridData = estimateResourcesSummaryService.getList();
					_.forEach(gridData, function (resourceSummary) {
						if(resourceSummary.AdjCostSummary === 0){
							resourceSummary.AdjCostSummary = resourceSummary.CostSummary;
							resourceSummary.OverrideFactor = 1;
							resourceSummary.isValid = true;
						}
						let newAdjCostSummary = resourceSummary.AdjCostSummary * (1 + restGrowthPercentage / 100);
						onAdjCostSummaryChanged(resourceSummary, newAdjCostSummary);
					});
					estimateMainResourceSummaryValidateService.setCurrentEditColumn('AdjCostSummary');
					estimateMainResourceSummaryConfigDataService.markAsModified(gridData);
					estimateResourcesSummaryService.entityModified(gridData);
				}

				estimateResourcesSummaryService.calculatedHeaderTotalInfo.register(calculatedHeaderTotalInfo);

				function calculatedHeaderTotalInfo(totalCostEntity, estResourcesSummaries) {
					if(!totalCostEntity){
						initHeaderInfoData();
						return;
					}

					if(!totalCostEntity.isAdjust){
						$scope.totalCostEntity.OldAdjCostSummary = totalCostEntity.AdjCostSummary;
					}

					$scope.totalCostEntity.CostSummary = totalCostEntity.CostSummary;
					$scope.totalCostEntity.AdjCostSummary = totalCostEntity.AdjCostSummary;
					$scope.totalCostEntity.CostModificationAbsolute = totalCostEntity.CostModificationAbsolute;
					$scope.totalCostEntity.CostModificationPercent = totalCostEntity.CostModificationPercent;

					$scope.totalCostEntity.OldAdjCostSummary = $scope.totalCostEntity.AdjCostSummary;
					$scope.totalCostEntity.OldCostModificationPercent = $scope.totalCostEntity.CostModificationPercent;
					$scope.totalCostEntity.OldCostModificationAbsolute = $scope.totalCostEntity.CostModificationAbsolute;
					$scope.totalCostEntity.MarginOne = totalCostEntity.MarginOne;
					$scope.totalCostEntity.MarginTwo = totalCostEntity.MarginTwo;
					$scope.totalCostEntity.GrandTotal = totalCostEntity.GrandTotal;

					if(estResourcesSummaries && estResourcesSummaries.length > 0){
						let filterAdjCostSummary = 0;
						let filterCostSummary = 0;
						_.forEach(estResourcesSummaries, function (resourceSummary) {
							filterAdjCostSummary += resourceSummary.AdjCostSummary;
							filterCostSummary += resourceSummary.CostSummary;
							resourceSummary.CostModificationAbsolute = resourceSummary.AdjCostSummary - resourceSummary.CostSummary;
							resourceSummary.CostModificationPercent = (resourceSummary.CostModificationAbsolute !== 0 && resourceSummary.CostSummary !== 0) ? resourceSummary.CostModificationAbsolute / resourceSummary.CostSummary * 100 : 0;
						});
						$scope.filteredTotalCostEntity.CostSummary = filterCostSummary;
						$scope.filteredTotalCostEntity.AdjCostSummary = filterAdjCostSummary;
						$scope.filteredTotalCostEntity.OldAdjCostSummary = filterAdjCostSummary;
						$scope.filteredTotalCostEntity.CostModificationPercent = ($scope.filteredTotalCostEntity.AdjCostSummary - $scope.filteredTotalCostEntity.CostSummary) / $scope.filteredTotalCostEntity.CostSummary * 100;
						$scope.filteredTotalCostEntity.OldCostModificationPercent = $scope.filteredTotalCostEntity.CostModificationPercent;
					}
				}

				let attributes = ['DetailsStack', 'Code', 'DescriptionInfo', 'EstResourceTypeFk', 'EstCostTypeFk',
					'CostCodePortionsFk','CostCodeTypeFk', 'EstResourceFlagFk', 'PrcStructureFk', 'PackageAssignments',
					'LgmJobFk', 'UomFk', 'BasCurrencyFk', 'QuantitySummary', 'AdjQuantitySummary', 'EstimateCostUnit',
					'AdjustCostUnit', 'CostUnitOriginal', 'CostUnitDifference', 'CostSummaryOriginal', 'CostSummary', 'AdjCostSummary',
					'CostSummaryDifference', 'CostSummaryOriginalDifference', 'CostFactor1', 'CostFactor2', 'CostFactorCc', 'QuantityFactor1',
					'QuantityFactor2', 'QuantityFactor3', 'QuantityFactor4', 'QuantityFactorCc', 'ProductivityFactor',
					'EfficiencyFactor1', 'EfficiencyFactor2', 'IsLumpsum', 'IsIndirectCost', 'IsGeneratedPrc', 'OverrideFactor', 'Budget',
					'CostModificationPercent','CostModificationAbsolute'];

				let notReadOnlyColumns = ['costfactor1', 'costfactor2', 'quantityfactor1', 'quantityfactor2', 'quantityfactor3', 'adjcostsummary',
					'quantityfactor4', 'productivityfactor', 'efficiencyfactor1', 'efficiencyfactor2', 'adjustcostunit', 'overridefactor','costmodificationabsolute',
					'costmodificationpercent'];


				let aggregators = [
					new Slick.Data.Aggregators.Sum('CostSummaryOriginal', 2),
					new Slick.Data.Aggregators.Sum('CostSummary', 2),
					new Slick.Data.Aggregators.Sum('Budget', 2),
					new Slick.Data.Aggregators.Sum('AdjCostSummary', 2),
					new Slick.Data.Aggregators.Sum('CostSummaryDifference', 6),
					new Slick.Data.Aggregators.Sum('CostSummaryOriginalDifference', 6)];

				let gridConfig = angular.extend({/* enter specific options here */}, estimateDefaultGridConfig),
					uiService = estimateMainCommonUIService.createUiService(
						attributes,
						null,
						notReadOnlyColumns);

				gridConfig.bulkEditorSettings = {
					serverSideBulkProcessing: false,
					skipEntitiesToProcess: false
				};

				let configForList = uiService.getStandardConfigForListView();

				if(configForList && _.isArray(configForList.columns)){
					_.forEach(configForList.columns, function(column){
						if(column.grouping){
							column.grouping.aggregators = aggregators;
							column.grouping.displayTotalsRow = false;
						}
					});
				}

				gridConfig.cellChangeCallBack = function cellChangeCallBack(arg) {
					// apply new factor result preview
					let item = arg.item,
						col = arg.grid.getColumns()[arg.cell].field;

					estimateMainResourceSummaryValidateService.setCurrentEditColumn(col);

					estimateMainResourceSummaryConfigDataService.markAsModified(item);

					// TODO: check if using client calculation
					// if(estimateMainResourceSummaryConfigDataService.isUsingClientCalculation(item)){
					// if(false){
					//     let gridData = estimateResourcesSummaryService.getList();
					//     let itemOfData = _.find(gridData, function (o) {
					//         return o.Id === item.Id;
					//     });
					//     itemOfData.AdjCostSummary = itemOfData.AdjustCostUnit * itemOfData.CostFactor1 * itemOfData.CostFactor2 * itemOfData.CostFactorCc *
					//             itemOfData.AdjQuantitySummary * itemOfData.QuantityFactor1 * itemOfData.QuantityFactor2 * itemOfData.QuantityFactor3 * itemOfData.QuantityFactor4 * itemOfData.ProductivityFactor * itemOfData.QuantityFactorCc / itemOfData.EfficiencyFactor1 / itemOfData.EfficiencyFactor2;
					//     estimateResourcesSummaryService.gridRefresh();
					//     hideLoading();
					// }
					// else {
					let modifiedIds = estimateMainResourceSummaryConfigDataService.getModifiedItems();
					let updateList = _.filter(estimateResourcesSummaryService.getList(), function (item) {
						return _.includes(modifiedIds, item.Id);
					});
					estimateResourcesSummaryService.entityModified(updateList);
				};

				// disable column sorting
				// let columns = uiService.getStandardConfigForListView().columns;
				// _.each(columns, function (col) {
				//     col.sortable = false;
				// });

				platformGridControllerService.initListController($scope, uiService, estimateResourcesSummaryService, estimateMainResourceSummaryValidateService, gridConfig);
				estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

				let config = mainViewService.getViewConfig($scope.gridId);
				if(config && config.Viewdata && config.Viewdata.GroupConfigID && estimateMainService.getSelected()){
					estimateMainResourceSummaryConfigDataService.setConfigId(config.Viewdata.GroupConfigID);
					estimateResourcesSummaryService.loadFromConfig(config.Viewdata.GroupConfigID);
				}else {
					estimateMainResourceSummaryConfigDataService.setConfigId(-1);
				}

				estimateResourcesSummaryService.showLoading = showLoading;
				estimateResourcesSummaryService.hideLoading = hideLoading;

				function recalculate(configId) {
					showLoading();
					let permission = !platformGridAPI.grids.exist('681223e37d524ce0b9bfa2294e18d650') ? $injector.get('estimateMainBoqLookupService').getListAsync() : $q.when();
					permission.then(function (){
						if (configId) {
							estimateResourcesSummaryService.loadFromConfig(configId);
						}
						else {
							estimateResourcesSummaryService.load();
						}
					});
				}

				function showLoading() {
					$scope.entity.isLoading = true;
				}

				function hideLoading() {
					$timeout(function () {
						$scope.entity.isLoading = false;
					}, 10, false);
				}

				function apply() {
					showLoading();
					estimateResourcesSummaryService.apply().then(function (response) {
						if (response && response.data && response.data.LineItems) {
							estimateMainService.clear();
							hideLoading();
							estimateMainService.load().then(function () {
								estimateMainResourceSummaryConfigDataService.resetModifiedItems();
								recalculate();
							});
						}
						else {
							hideLoading();
						}
					});
				}

				addToolsFromServer();

				function addToolsFromServer() {
					estimateMainResourceSummaryConfigDataService.loadData().then(function (data) {

						let tools = estimateMainResourceSummaryConfigDataService.getToolbar();
						let unCombined = [{
							id: 'selectionUser',
							type: 'radio',
							value: 'Combined',
							caption: 'estimate.main.summaryConfig.unCombined',
							fn: function () {
								recalculate(-1);
							}
						}];
						let userTools = [{
							id: 'selectionUser',
							type: 'item',
							disabled: true,
							cssClass: 'title',
							caption: 'estimate.main.summaryConfig.userSetting'
						}];
						let roleTools = [{
							id: 'blacklistRole',
							type: 'item',
							disabled: true,
							cssClass: 'title',
							caption: 'estimate.main.summaryConfig.roleSetting'
						}];
						let systemTools = [{
							id: 'systemSelection',
							type: 'item',
							disabled: true,
							cssClass: 'title',
							caption: 'estimate.main.summaryConfig.systemSetting'
						}];
						let setting = {
							id: 'combinedSetting',
							type: 'item',
							cssClass: 'title',
							caption: 'estimate.main.summaryConfig.dialogTitle',
							fn: function () {
								estimateMainResourceSummaryConfigService.showDialog();
							}
						};
						if (data && data.ConfigData) {
							_.each(data.ConfigData, function (_config) {
								let configTool = {
									id: _config.Id,
									type: 'radio',
									value: _config.Id,
									caption: _config.DescriptionInfo.Description,
									fn: function (item) {
										mainViewService.customData($scope.gridId, 'GroupConfigID', item);
										recalculate(item);
									}
								};

								if (_config.IsSystem) {
									systemTools.push(configTool);
								}
								else if (_config.FrmUserFk) {
									userTools.push(configTool);
								}
								else if (_config.FrmAccessRoleFk) {
									roleTools.push(configTool);
								}
							});
						}

						let commandMenu = _.find(tools.items, function (tool) {
							return tool.id === 'commandsMenu';
						});
						let configId = estimateResourcesSummaryService.getConfigId();
						if (!commandMenu) {
							let cMenu = {
								id: 'commandsMenu',
								caption: 'estimate.main.summaryConfig.commandTitle',
								type: 'dropdown-btn',
								iconClass: 'tlb-icons ico-filtering',
								list: {
									showImages: false,
									activeValue: configId ? (configId === -1 ? 'Combined' : configId) : 'Combined',
									items: []
								}
							};
							tools.items.push(cMenu);
							commandMenu = _.find(tools.items, function (tool) {
								return tool.id === 'commandsMenu';
							});
						}
						if (commandMenu) {
							commandMenu.list.items = [];
							commandMenu.list.items = commandMenu.list.items.concat(unCombined);
							if (userTools.length > 1) {
								commandMenu.list.items = commandMenu.list.items.concat(userTools);
							}
							if (roleTools.length > 1) {
								commandMenu.list.items = commandMenu.list.items.concat(roleTools);
							}
							if (systemTools.length > 1) {
								commandMenu.list.items = commandMenu.list.items.concat(systemTools);
							}
							commandMenu.list.items.push(setting);

							commandMenu.list.activeValue = configId ? (configId === -1 ? 'Combined' : configId) : 'Combined';

							estimateMainResourceSummaryConfigDataService.updateTools(tools);
							return $q.when(tools);
						}
					});
				}

				let refreshTool = [
					{
						id: 'estimate-main-resources-summary-recalculate',
						caption: $translate.instant('estimate.main.summaryConfig.refresh'),
						type: 'item',
						iconClass: ' tlb-icons ico-refresh',
						fn: function () {
							recalculate();
						}
					},
					{
						id: 'estimate-main-resources-summary-apply',
						caption: $translate.instant('estimate.main.summaryConfig.apply'),
						type: 'item',
						iconClass: ' tlb-icons ico-instance-calculate',
						fn: function () {
							apply();
						}
					}];

				function updateTools() {
					$scope.setTools(estimateMainResourceSummaryConfigDataService.getToolbar());
					if (!estimateMainResourceSummaryConfigDataService.toolsAdded) {
						$scope.addTools(refreshTool);
						estimateMainResourceSummaryConfigDataService.toolsAdded = true;
					}

					let headerStatus = estimateMainService.isReadonly();
					let pinningItems =  cloudDesktopPinningContextService.getContext();
					let hasPinned = !(pinningItems && pinningItems.length > 1);
					let project = cloudDesktopPinningContextService.getPinningItem('project.main');
					// disableTools(headerStatus || hasPinned);
					disableTools(headerStatus || hasPinned || (!project || project.id <=0) || !estimateMainService.hasCreateUpdatePermission());
				}

				function  clearPinningContext(){
					estimateResourcesSummaryService.setList([]);
					disableTools(true);
				}

				function disableTools(isDisable){
					let toolIds = ['priceUpdateMenu', 'estimate-main-resources-summary-apply'];
					_.each($scope.tools.items, function(tool){
						let indexof = _.findIndex(toolIds, function(item){
							return item === tool.id;
						});

						tool.disabled = indexof !== -1 ? isDisable : (tool.disabled || false);
					});

					// If default settings are changed, then we disabled  these toolbar buttons

					_.each($scope.tools.items, function(tool){
						let indexof2 = _.findIndex(toolIds, function(item){
							return item === tool.id;
						});

						if (tool.disabled === false && indexof2 > -1){
							tool.disabled = function(){
								return estimateResourcesSummaryService.isDefaultSettingsChanged();
							};
						}
					});

					$scope.$watch('showInfoOverlay', function () {
						if ($scope.tools) {
							$scope.tools.update();
						}
					});
				}

				function listLoadedEvent(items) {
					hideLoading();
					estimateMainResourceSummaryConfigDataService.setOriginalData(items);
					estimateMainResourceSummaryConfigDataService.resetModifiedItems();
				}

				let postData = {
					data: {
						updPrjCC: false,
						updPrjMat: false,
						calcRuleParam: false,
						updBoq: false
					}
				};

				function updateCostCodePrice() {
					// will trigger update estimate with project cost code option
					let postDataForCC = angular.copy(postData);
					postDataForCC.data.updPrjCC = true;
					estimateMainUpdateItemsService.updateEstimateFromProject(postDataForCC);
				}

				function updateMaterialPrice() {
					// will trigger update estimate with project material option
					let postDataForMa = angular.copy(postData);
					postDataForMa.data.updPrjMat = true;
					estimateMainUpdateItemsService.updateEstimateFromProject(postDataForMa);
				}

				function afterUpdateEstimate() {
					recalculate();
				}

				function onSelectedRowChanged() {
					$injector.get('estimateMainReplaceResourceUIService').setResourceDataServcie(estimateResourcesSummaryService);
				}

				function onAdjCostSummaryChanged(entity, value) {
					let validResult = true;

					if(entity.AdjCostSummary === 0 || entity.isValid === false){
						if(!entity.isValid && entity.CostSummary === 0){
							validResult = {
								apply: true, valid: false,
								error: $translate.instant('estimate.main.validateAdjCostSummaryError')
							};

							entity.isValid = false;
						}
						else if(entity.isValid && entity.CostSummary !== 0){
							entity.OverrideFactor = entity.OverrideFactor !== 0 ? entity.OverrideFactor * value / entity.CostSummary : value / entity.CostSummary;
						}
						else if(entity.isValid && entity.CostSummary === 0 && entity.reCalCostSummary !== 0){
							entity.OverrideFactor = entity.OverrideFactor !== 0 ? entity.OverrideFactor * value / entity.reCalCostSummary : value / entity.reCalCostSummary;
						}
					}
					else{
						entity.OverrideFactor *= value / entity.AdjCostSummary;
						entity.isValid = true;
					}

					return validResult;
				}

				function onOverrideFactorChanged(entity, value) {
					if(entity.OverrideFactor !== 0 ) {
						entity.AdjCostSummary *= value / entity.OverrideFactor;
					}
				}

				$scope.onAdjCostSummaryChanged = onAdjCostSummaryChanged;
				$scope.onOverrideFactorChanged = onOverrideFactorChanged;

				estimateResourcesSummaryService.registerListLoaded(listLoadedEvent);
				estimateMainResourceSummaryConfigDataService.onAfterSaved.register(addToolsFromServer);
				estimateMainResourceSummaryConfigDataService.onToolsUpdated.register(updateTools);
				projectMainUpdatePricesWizardCommonService.onResultGridDataSet.register(updateCostCodePrice);
				projectMainUpdatePricesWizardCommonService.onMaterialPriceDataSet.register(updateMaterialPrice);
				estimateMainSidebarWizardService.onCalculationDone.register(afterUpdateEstimate);
				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowChanged);
				cloudDesktopPinningContextService.onClearPinningContext.register(clearPinningContext);

				$scope.$on('$destroy', function () {
					estimateResourcesSummaryService.unregisterListLoaded(listLoadedEvent);
					estimateMainResourceSummaryConfigDataService.onAfterSaved.unregister(addToolsFromServer);
					estimateMainResourceSummaryConfigDataService.onToolsUpdated.unregister(updateTools);
					projectMainUpdatePricesWizardCommonService.onResultGridDataSet.unregister(updateCostCodePrice);
					projectMainUpdatePricesWizardCommonService.onMaterialPriceDataSet.unregister(updateMaterialPrice);
					estimateMainSidebarWizardService.onCalculationDone.unregister(afterUpdateEstimate);
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowChanged);
					$scope.entity.isLoading = false;
					cloudDesktopPinningContextService.onClearPinningContext.unregister(clearPinningContext);
					estimateResourcesSummaryService.calculatedHeaderTotalInfo.unregister(calculatedHeaderTotalInfo);
					estimateResourcesSummaryService.resetUndoInputValueFlag();
				});
			}]);
})();
