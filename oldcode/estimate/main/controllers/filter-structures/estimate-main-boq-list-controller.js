/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainBoqListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of boq entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainBoqListController',
		['$scope','$injector', 'platformGridAPI', 'platformControllerExtendService', 'platformGridControllerService', 'estimateMainCommonUIService', 'estimateMainService',
			'estimateMainValidationService', 'loadingIndicatorExtendServiceFactory', 'estimateDefaultGridConfig', 'estimateMainClipboardService', 'estimateMainFilterService','estimateMainBoqService',
			'estimateCommonControllerFeaturesServiceProvider', 'boqMainClipboardService', 'cloudCommonGridService', 'estimateMainLeadQuantityAggregatorConfigService', 'estimateMainLeadQuantityAggregatorDataService','estimateMainBoqProcessService',
			function ($scope, $injector, platformGridAPI, platformControllerExtendService, platformGridControllerService, estimateMainCommonUIService, estimateMainService,
				estimateMainValidationService, loadingIndicatorExtendServiceFactory, estimateDefaultGridConfig, estimateMainClipboardService, estimateMainFilterService, estimateMainBoqService,
				estimateCommonControllerFeaturesServiceProvider, boqMainClipboardService, cloudCommonGridService, leadQuantityAggrConfigService, leadQuantityAggregatorDataService,estimateMainBoqProcessService) {

				$scope.editModes = [];
				let toolsToAdd = [];

				loadingIndicatorExtendServiceFactory.createServiceForDataServiceFactory($scope, 500, estimateMainBoqService);

				let customOptions = {
					container:'boq-driven-estimate'
				};
				let gridConfig = angular.extend({
					marker: {
						filterService: estimateMainFilterService,
						filterId: 'estimateMainBoqListController',
						dataService: estimateMainBoqService,
						serviceName: 'estimateMainBoqService'
					},
					isRoot: false,
					parentProp: 'BoqItemFk',
					childProp: 'BoqItems',
					propagateCheckboxSelection: true,
					skipPermissionCheck:true,
					type: 'estBoqItems',
					dragDropService: estimateMainClipboardService,
					costGroupService: 'estimateMainBoqCostGroupService',
					cellChangeCallBack: function (arg) {
						let field = arg.grid.getColumns ()[arg.cell].field;
						if (field === 'Rule') {
							let ruleToDelete = [];
							if (arg.item.IsRoot) {
								ruleToDelete = $injector.get ('estimateMainRootService').getRuleToDelete ();
							} else {
								ruleToDelete = estimateMainBoqService.getRuleToDelete ();
							}
							if (!arg.item.Rule.length && ruleToDelete && ruleToDelete.length) {

								let platformDeleteSelectionDialogService = $injector.get ('platformDeleteSelectionDialogService');
								platformDeleteSelectionDialogService.showDialog ({
									dontShowAgain: true,
									id: '7a9f7da5c9b44e339d49ba149a905987'
								}).then (result => {
									if (result.ok || result.delete) {
										estimateMainService.deleteParamByPrjRule (arg.item, ruleToDelete, 'EstBoq');
									}
								});
							}
						}

						if (field === 'Quantity') {
							arg.item.QuantityAdj = arg.item.Quantity;
							estimateMainBoqService.markItemAsModified(arg.item);
						}

					}
				}, estimateDefaultGridConfig);
				let uiService = estimateMainCommonUIService.createUiService(
					['Reference', 'Reference2', 'ItemInfo','BriefInfo', 'BoqDivisionTypeFk', 'Quantity', 'BasUomFk', 'Rule', 'Param', 'PrjCharacter', 'WorkContent','BoqItemFlagFk',
					'BoqLineTypeFk', 'DesignDescriptionNo', 'WicNumber', 'FactorDetail', 'DiscountText', 'BoqItemReferenceFk', 'CommentContractor', 'CommentClient',
					'Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5', 'ExternalCode', 'ExternalUom', 'AAN', 'AGN', 'Factor', 'Cost',
					'Correction', 'Price', 'DiscountedUnitprice', 'DiscountedPrice', 'Finalprice', 'Finaldiscount', 'Urb1', 'Urb2', 'Urb3', 'Urb4', 'Urb5', 'Urb6',
					'UnitRateFrom', 'UnitRateTo', 'LumpsumPrice', 'Discount', 'QuantityAdj', 'HoursUnit', 'Hours',
					'DiscountPercent', 'DiscountPercentIt', 'IsUrb', 'IsLumpsum', 'IsDisabled', 'IsNotApplicable', 'IsLeadDescription',
					'IsKeyitem', 'IsSurcharged', 'IsFreeQuantity', 'IsUrFromSd', 'IsFixedPrice', 'IsNoMarkup', 'IsCostItem', 'Included', 'IsDaywork', 'PrcStructureFk', 'PrcStructureDescription',
					'MdcTaxCodeFk', 'TaxCodeDescription', 'BpdAgreementFk', 'BasItemTypeFk', 'BasItemType2Fk', 'MdcMaterialFk', 'MdcCostCodeFk', 'MdcControllingUnitFk',
					'ControllingUnitDescription', 'PrcItemEvaluationFk', 'BoqItemReferenceDescription', 'BoqItemReferenceDesignDescription',
					'PrjLocationFk', 'PrjLocationDescription', 'CalculateQuantitySplitting', 'InsertedAt', 'InsertedBy', 'UpdatedAt', 'UpdatedBy', 'Delta','DeltaUnit', 'BudgetFixedUnit', 'BudgetFixedTotal',
					'BudgetPerUnit', 'BudgetTotal', 'BudgetDifference'],
					{serviceName: 'estimateMainBoqService', itemName :'EstBoq',  RootServices : ['estimateMainActivityService', 'estimateMainRootService','estimateMainBoqService']},
					['BriefInfo','Quantity','QuantityAdj','BasUomFk'],
					false,
					customOptions);

				$injector.get('cloudDesktopHotKeyService').registerHotkeyjson('estimate.main/content/json/hotkey.json', moduleName);

				let boqMainExtendConfigurationService = estimateMainBoqService.getCommonDynamicConfigurationService();

				boqMainExtendConfigurationService.setConfigurationServiceAndValidationService(uiService, estimateMainValidationService);

				platformControllerExtendService.initListController($scope, boqMainExtendConfigurationService, estimateMainBoqService, estimateMainValidationService, gridConfig);

				$injector.get('platformToolbarService').removeTools($scope.gridId);

				boqMainExtendConfigurationService.applyToScope($scope);

				estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

				estimateMainBoqService.registerSelectionChanged(estimateMainBoqService.creatorItemChanged);

				leadQuantityAggrConfigService.addAggrLeadQuantityTool($scope, 'estimateMainBoqService');

				let selectedRow = estimateMainBoqService.getSelected();
				if(selectedRow){
					estimateMainBoqService.creatorItemChanged(null,selectedRow);
				}

				function updatePrjBoq(){
					let estimateMainBoqUnitRateGenerateService = $injector.get('estimateMainBoqUnitRateGenerateService');
					let param ={};
					param.CopyLineItemRete = true;
					estimateMainBoqUnitRateGenerateService.generateBoqUnitRate(param);
				}

				function boqUnitRateGenerate() {
					let estimateMainBoqUnitRateGenerateService = $injector.get('estimateMainBoqUnitRateGenerateService');
					estimateMainBoqUnitRateGenerateService.showDialog();
				}

				function addEditButtonIcon() {
					const editButton = {
						id: 'editBoq',
						sort:104,
						caption: 'estimate.main.editBoq',
						type: 'check',
						value: false,
						iconClass: 'tlb-icons ico-boq-edit',
						cssClass: 'tlb-icons ico-boq-edit',
						disabled: function () {
							let selectedItem = estimateMainBoqService.getSelected();
							return selectedItem && selectedItem.Id === -1;
						},
						fn: function () {
							let selectedItem = estimateMainBoqService.getSelected();
							let rootItem = estimateMainBoqService.getCurrentRootItem(selectedItem);
							let isEditable = false;
							let editableBoqItemFields = {};
							let rootId = rootItem ? rootItem.Id : -1;
							const mode = $scope.editModes && $scope.editModes.length > 0 && rootId > 0 ? $scope.editModes.find(item => item.id === rootId) : null;
							if (mode) {
								editableBoqItemFields = $injector.get('boqMainBoqDrivenEstimateService').getEditableBoqItemFieldsAsync(rootItem);
								mode.value = !mode.value;
					 			isEditable = mode.value;
							} else {
								editableBoqItemFields = $injector.get('boqMainBoqDrivenEstimateService').getEditableBoqItemFieldsAsync(rootItem);
								isEditable = true;
								$scope.editModes.push({ id: rootId, value: isEditable, editableBoqItemFields: editableBoqItemFields });
							}
							 estimateMainBoqService.setButtonEditValue(isEditable);
							editableBoqItemFields.then(function (resultList) {
								const boqListMap = _.keyBy(getBoqList(), 'Id');
								_.forEach(resultList, function (resultItem) {
									const matchedItem = boqListMap[resultItem.Id];
									if (matchedItem) {
										estimateMainBoqProcessService.setFields(matchedItem, resultItem, !isEditable);
									}
								});
							});
						}
					};
					toolsToAdd.push(editButton);
				}

				addEditButtonIcon();

				function addUpdateToProjectBoQTools(){
					let calculatorTool = [{
						id: 'updatePrjBoq',
						caption: 'estimate.main.updatePrjBoq',
						type: 'item',
						iconClass: 'tlb-icons ico-update-boq-from-estimate',
						fn:updatePrjBoq
					},{
						id: 'BoqUnitRateGenerate',
						caption: 'estimate.main.boqUnitRateGenerate',
						type: 'item',
						iconClass: 'tlb-icons ico-copy-settings',
						fn:boqUnitRateGenerate
					}];

					toolsToAdd.push(calculatorTool);
				}

				addUpdateToProjectBoQTools();
				estimateMainService.setIsEstimate(true);

				let filterTitles = {
					'allBoqs': 'estimate.main.boqFilterIcon.showAllBoqs',
					'boqWithLinkedLI': 'estimate.main.boqFilterIcon.showBoqWithLinkedLI',
					'boqWithoutLinkedLI': 'estimate.main.boqFilterIcon.showBoqWithoutLinkedLI'
				};

				// set the default or last selected active filter icon
				function activateBoqFilterIcon() {
					let lastSelectedKey = estimateMainBoqService.lastSelectedFilterKey();
					let filterKey = _.isString(lastSelectedKey) ? lastSelectedKey : 'allBoqs';

					if(!_.includes(_.keys(filterTitles), filterKey)) {
						lastSelectedKey = _.head(_.keys(filterTitles));
					}
					try {
						_.find($scope.tools.items, function (i) {
							return i.filterIconsGroup === 'boqFilterTypes';
						}).list.activeValue = filterKey;
						lastSelectedKey = filterKey;
						$scope.tools.update();

						estimateMainBoqService.lastSelectedFilterKey(lastSelectedKey);
					} catch (e) {
						return;
					}
				}

				// init filters
				function initFilterTools() {
					let filterToolGroup = {
						id: 'boqFilterTypes',
						filterIconsGroup: 'boqFilterTypes',
						type: 'sublist',
						list: {
							cssClass: 'radio-group',
							showTitles: true,
							items: [
								{
									id: 'all_boqs',
									caption: filterTitles.allBoqs,
									type: 'radio',
									value: 'allBoqs',
									iconClass: 'tlb-icons ico-line-item-filter-off',
									fn: function () {
										estimateMainBoqService.ExecuteFilter('allBoqs');
									},
									disabled: function () {
										return false;
									}
								},
								{
									id: 'with_lineitem',
									caption: filterTitles.boqWithLinkedLI,
									type: 'radio',
									value: 'boqWithLinkedLI',
									iconClass: 'tlb-icons ico-line-item-filter',
									fn: function () {
										estimateMainBoqService.ExecuteFilter('boqWithLinkedLI');
									},
									disabled: function () {
										return false;
									}
								},
								{
									id: 'without_lineitem',
									caption: filterTitles.boqWithoutLinkedLI,
									type: 'radio',
									value: 'boqWithoutLinkedLI',
									iconClass: 'tlb-icons ico-line-item-not-linked',
									fn: function () {
										estimateMainBoqService.ExecuteFilter('boqWithoutLinkedLI');
									},
									disabled: function () {
										return false;
									}
								}
							]
						}
					};
					toolsToAdd.push([filterToolGroup]);
					estimateMainBoqService.filterToolIsAdded(true);
				}

				if(!estimateMainBoqService.filterToolIsAdded()){
					initFilterTools();
				}

				activateBoqFilterIcon();

				_.remove($scope.tools.items, function(item){
					return (item.id === 't13' && item.caption === 'cloud.common.toolbarItemFilter') || (item.id === 'createChild' && item.caption === 'cloud.common.toolbarInsertSub');
				});
				$scope.tools.update();

				// refresh data when assemblies are refreshed
				function refreshBoqListService(){
					let grid = platformGridAPI.grids.element('id', $scope.gridId);
					if(grid && grid.instance){
						grid.instance.setSelectedRows([]);
						estimateMainBoqService.clearSelectedItem();
						let projectId = estimateMainService.getSelectedProjectId();
						if(projectId) {
							estimateMainBoqService.refresh();
						}
					}
				}

				function listLoaded(){
					let list = estimateMainBoqService.getList();
					_.forEach(list, function(item) {
						estimateMainBoqProcessService.setFields(item,null,true);
					});
					let editBoqTool = $scope.tools.items.find(item => item.id === 'editBoq')
					if(editBoqTool&& editBoqTool.value){
						editBoqTool.value = false;
						$scope.tools.refresh();
					}
					$scope.editModes = [];
				}

				function getBoqList(){
					let list = estimateMainBoqService.getList();
					list = list.filter(function(item) {
						return item.Id !== -1;
					});
					return list;
				}

				function onListLoaded() {
					// Refresh dynamic columns
					boqMainExtendConfigurationService.fireRefreshConfigLayout();
				}

				function updateTools(isBoqDriven) {
					// Refresh dynamic columns
					$scope.addTools(_.flatten(toolsToAdd));
					if(!isBoqDriven){
						$scope.tools.items = $scope.tools.items.filter(item => (item.id !== 'editBoq' && item.id !== 'create' && item.id !== 'delete'));
					}
					_.remove($scope.tools.items, function(item){
						return (item.id === 't13' && item.caption === 'cloud.common.toolbarItemFilter') || (item.id === 'createChild' && item.caption === 'cloud.common.toolbarInsertSub');
					});
					$scope.tools.update();
				}

				estimateMainBoqService.onBoqDynamicColumnsLoaded.register(onListLoaded);

				estimateMainBoqService.onBoqItemsLoaded.register(updateTools);

				estimateMainService.registerRefreshRequested(refreshBoqListService);

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				function onSelectedRowsChanged(){
					let selectedItem = platformGridAPI.rows.selection({gridId: $scope.gridId});
					let rootItem = estimateMainBoqService.getCurrentRootItem(selectedItem);
					let rootId = rootItem ? rootItem.Id : -1;
					const mode = $scope.editModes && $scope.editModes.length > 0 && rootId > 0 ? $scope.editModes.find(item => item.id === rootId) : null;

					let editBoqTool = $scope.tools.items.find(item => item.id === 'editBoq')
					if(editBoqTool&& editBoqTool.value){
						editBoqTool.value = mode ? mode.value : false;
						$scope.tools.refresh();
					}

					$injector.get('estimateMainWicBoqService').onBarToolHighlightStatusChanged.fire();
				}

				function estimateBoQFilterOff(){
					estimateMainBoqService.markersChanged(null);
					$scope.tools.update();
				}

				estimateMainService.registerBoqFilterOffEvent(estimateBoQFilterOff);

				let addInList = [];
				let convertToNewList = function convertToNewList(data) {
					data.HasChildren = data && data.BoQItems ? true : false;
					addInList.push(data);

					if (data && data.BoQItems) {
						data.BoqItems = angular.copy(data.BoQItems);
						delete data.BoQItems;
						_.each(data.BoqItems, function (item) {
							if (item && item.BoQItems) {
								convertToNewList(item);
							}
						});
					}
					return data;
				};

				let reactOnLinkBoqItemSucceeded = function reactOnLinkBoqItemSucceeded(data) {
					if(data) {
						let newDataList = convertToNewList(data);
						estimateMainBoqService.addList(addInList);
						let datalist = estimateMainBoqService.getUnfilteredList();
						let flatdatalist = cloudCommonGridService.flatten(datalist, [], 'BoqItems');
						let parentItem = _.find(flatdatalist, {Id: newDataList.BoqItemFk});
						let isExist = false;
						if(parentItem && _.isArray(parentItem.BoqItems)){
							isExist = _.find(parentItem.BoqItems, {Id: newDataList.Id});
						}
						if(parentItem && !isExist) {
							boqMainClipboardService.spliceBoqItemTree([{BoqItem: newDataList}], parentItem, estimateMainBoqService, function () {
							});
						}
					}
				};
				let estimateMainCommonService = $injector.get('estimateMainCommonService');
				estimateMainCommonService.onLinkBoqItemSucceeded.register(reactOnLinkBoqItemSucceeded);

				function reloadBoqItems() {
					let selectedRow = estimateMainBoqService.getSelected();

					estimateMainBoqService.load().then(function () {

						let newItems = platformGridAPI.items.data($scope.gridId);
						let output = [];
						cloudCommonGridService.flatten(newItems, output, 'BoqItems');

						if(selectedRow) {
							let newItem = _.find (output, {Id: selectedRow.Id});
							if (newItem) {
								newItem.IsMarked = true;
							}

							estimateMainBoqService.setSelected ({}).then (function () {
								estimateMainBoqService.setSelected (newItem);
							});
						}
					});
				}

				estimateMainService.onBoqItesmUpdated.register(reloadBoqItems);

				function onClickFuc() {
					$injector.get('estimateParamComplexLookupCommonService').setCurrentGridContent($scope.getContentValue('permission') || $scope.gridId, estimateMainBoqService);
				}

				function updateAggregator(items){
					estimateMainBoqService.addList(items);
					estimateMainBoqService.gridRefresh();
				}

				platformGridAPI.events.register($scope.gridId, 'onClick',onClickFuc);

				let project = $injector.get('projectMainService').getSelected();
				if (project){
					project.PrjProjectFk = project.Id;
					estimateMainService.setSelectedProjectId(project);
				}
				estimateMainService.onContextUpdated.register(estimateMainBoqService.loadBoq);
				estimateMainBoqService.loadBoq(); // load data when open the container
				leadQuantityAggregatorDataService.onBoQLeadQtyAggregatorUpdated.register(updateAggregator);


				function initDynamicUserDefinedColumns() {
					let esttimateBoqMainDynamicUserDefinedColumnService = $injector.get('estimateBoqMainDynamicUserDefinedColumnService');

					let commonDynamicConfigurationService = estimateMainBoqService.getCommonDynamicConfigurationService();

					if(!estimateMainBoqService.getDynamicUserDefinedColumnsService()) {
						let userDefinedColumnService = esttimateBoqMainDynamicUserDefinedColumnService.getService(estimateMainValidationService, estimateMainBoqService, commonDynamicConfigurationService);
						estimateMainBoqService.setDynamicUserDefinedColumnsService(userDefinedColumnService);
					}
				}

				initDynamicUserDefinedColumns();

				function clearBoq (){
					refreshBoqListService();
				}

				$scope.toBoq = function(){
					if($scope && $scope.$parent && $scope.$parent.hasFocus) {
						$injector.get('estimateCommonNavigationService').navigateToBoq(estimateMainBoqService.getSelected(), {moduleName: 'boq.main', NavigatorFrom : 'BoqItemNavigator'});
					}

				};

				$injector.get('cloudDesktopHotKeyService').register('toBoq', $scope.toBoq);

				estimateMainService.registerClearBoqEvent(clearBoq);
				estimateMainBoqService.registerListLoaded(listLoaded);

				if(estimateMainBoqService.isTabChanged()){
					updateTools(estimateMainBoqService.getIsBoqDrivenFlag());
				}

				$scope.$on('$destroy', function () {
					$scope.editModes = [];
					toolsToAdd = [];
					//remove edit button everytime
					$injector.get('platformToolbarService').removeTools($scope.gridId);
					estimateMainBoqService.filterToolIsAdded(false);
					estimateMainService.unregisterRefreshRequested(refreshBoqListService);
					estimateMainBoqService.unregisterSelectionChanged(estimateMainBoqService.creatorItemChanged);
					estimateMainBoqService.onBoqDynamicColumnsLoaded.unregister(onListLoaded);
					estimateMainBoqService.onBoqItemsLoaded.unregister(updateTools);
					estimateMainCommonService.onLinkBoqItemSucceeded.unregister(reactOnLinkBoqItemSucceeded);
					estimateMainService.unregisterBoqFilterOffEvent(estimateBoQFilterOff);
					estimateMainService.onBoqItesmUpdated.unregister(reloadBoqItems);
					platformGridAPI.events.unregister($scope.gridId, 'onClick',onClickFuc);
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					estimateMainService.onContextUpdated.unregister(estimateMainBoqService.loadBoq);
					leadQuantityAggregatorDataService.onBoQLeadQtyAggregatorUpdated.unregister(updateAggregator);
					estimateMainService.unregisterClearBoqEvent(clearBoq);
					estimateMainBoqService.unregisterListLoaded(listLoaded);
					$injector.get('cloudDesktopHotKeyService').unregister('toBoq', $scope.toBoq);
				});
			}]);
})();
