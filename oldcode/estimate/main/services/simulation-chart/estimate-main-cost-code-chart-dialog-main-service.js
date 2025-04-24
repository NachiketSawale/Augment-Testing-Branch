/**
 * Created by Naim on 3/12/2018.
 */

(function () {

	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainCostCodeChartDialogService
	 * @function
	 *
	 * @description
	 * estimateMainCostCodeChartDialogService is the data service for cost code dialog
	 */
	angular.module(moduleName).factory('estimateMainCostCodeChartDialogMainService',
		['_', '$q', '$http', '$translate', '$injector', 'platformModalFormConfigService', 'estimateMainCostCodeResourceService',
			'platformModalService', 'platformModalGridConfigService', 'platformGridAPI',
			'platformRuntimeDataService', 'platformMasterDetailDialogService', 'platformTranslateService', 'estimateMainCostCodeDataService', 'estimateMainSimulationChartSelectionsConstant',
			function (_, $q, $http, $translate, $injector, platformModalFormConfigService, estimateMainCostCodeResourceService,
				platformModalService, platformModalGridConfigService, platformGridAPI,
				platformRuntimeDataService, platformMasterDetailDialogService, platformTranslateService, estimateMainCostCodeDataService, estimateMainSimulationChartSelectionsConstant) {

				let service = {};

				let newCurveItemId = 0;

				let ColorProcessor = $injector.get('estimateChartDialogTreeColorProcessor');
				let gridDialogConfigCache = {};
				let gridDialogConfigWorkingCopy = {};
				let defaultResourceSelection = _.find(estimateMainSimulationChartSelectionsConstant, function (calculationSelection){
					return calculationSelection.default;
				});


				let _depthSelection = function _depthSelection(hirachicalGridItem, gridFieldValue, gridFieldName, gridChildProp, manipulatedItems){
					hirachicalGridItem[gridFieldName] = gridFieldValue;
					manipulatedItems.push(hirachicalGridItem);

					_.forEach(hirachicalGridItem[gridChildProp], function (childCostCode) {
						_depthSelection(childCostCode, gridFieldValue, gridFieldName, gridChildProp, manipulatedItems); // child itself has children
					});

				};

				let depthSelection = function depthSelection (hirachicalGridItem, gridFieldValue, gridFieldName, gridChildProp) {
					let manipulatedItems = [];
					_depthSelection(hirachicalGridItem, gridFieldValue, gridFieldName, gridChildProp, manipulatedItems);
					return manipulatedItems;
				};

				let createNewCurveEntry = function createNewCurveEntry(treeData) {
					let curveItem = {
						Id : newCurveItemId,
						Name: 'Curve ' + newCurveItemId,
						Color : ColorProcessor.getUniqueColor(defaultResourceSelection.curveType, getUsedColors()),
						ShowMarker: false,
						dataSelection: treeData,
						manualNameSet : false,
						calcSettings : {
							selection : defaultResourceSelection.value
						},
						settings : {
							depthSelection : true,
							automaticName : true
						},
						getFullCurveName : function getFullCurveName (){
							return this.Name;
						}
					};
					curveItem.calcSettings.curveId = curveItem.Id;
					newCurveItemId++;
					return curveItem;
				};

				let createNewCurveEntryAndAddToArray = function createNewCurveEntryAndAddToArray(treeData, array){
					let newCurveItem = createNewCurveEntry(treeData);
					if (array !== undefined && array.push !== undefined){
						array.push(newCurveItem);
					}
					return newCurveItem;
				};

				let gridValidator = function gridValidator (curveItem, hirachicalGridItem, gridFieldValue, gridFieldName, gridChildProp) {
					let manipulatedItems = [];
					if (curveItem.settings.depthSelection){
						manipulatedItems = depthSelection(hirachicalGridItem, gridFieldValue, gridFieldName, gridChildProp);
					}

					if (curveItem.settings.automaticName){
						curveItem.Name = getCurveName(curveItem);
					}
					return manipulatedItems;
				};

				let areItemsAndAncestorSetAdd = function areItemsAndAncestorSelected(items) {
					let returnValue = true;
					_.forEach(items, function (item) {
						if (!item.Add){
							returnValue = false;
						}
						else if(item.Children.length !== 0 && returnValue){
							returnValue = areItemsAndAncestorSetAdd(item.Children);
						}
					});
					return returnValue;
				};

				let hasItemsAndAncestorAnySetToSubtract = function hasItemsAndAncestorAnySetToSubtract(items) {
					let returnValue = false;
					_.forEach(items, function (item) {
						if (item.Subtract){
							returnValue = true;
						}
						else if(item.Children.length !== 0 && !returnValue){
							returnValue = hasItemsAndAncestorAnySetToSubtract(item.Children);
						}
					});
					return returnValue;
				};

				let determinAllTopLevelFullSetAddItems = function determinAllTopLevelFullSelectedItems (items, allTopLevelFullSetAddItems){
					_.forEach(items, function (item) {
						if (areItemsAndAncestorSetAdd([item])){
							allTopLevelFullSetAddItems.push(item);
						}
						else {
							determinAllTopLevelFullSelectedItems(item.Children, allTopLevelFullSetAddItems);
						}
					});
				};

				let getAllTopLevelFullSetAddItems = function getAllTopLevelFullSetAddItems(items){
					let allTopLevelFullSetAddItems = [];
					determinAllTopLevelFullSetAddItems(items, allTopLevelFullSetAddItems);
					return allTopLevelFullSetAddItems;
				};

				function getCurveName(curveItem) {

					let allTopLevelFullSetAddItems = getAllTopLevelFullSetAddItems(curveItem.dataSelection);
					if (allTopLevelFullSetAddItems.length === 1 && !hasItemsAndAncestorAnySetToSubtract(curveItem.dataSelection)){
						if (allTopLevelFullSetAddItems[0].DescriptionInfo.Description !== ''){
							return allTopLevelFullSetAddItems[0].DescriptionInfo.Description;
						}
					}
					return 'Curve ' + curveItem.Id;
				}

				function getUsedColors(){
					if(gridDialogConfigWorkingCopy && _.isArray(gridDialogConfigWorkingCopy.items)){
						return gridDialogConfigWorkingCopy.items.map(function(item){
							return item.Color;
						});
					}
					else{
						return [];
					}

				}

				function getSettingsDialogConfig(){
					if (gridDialogConfigCache.dialogTitle === undefined){
						return estimateMainCostCodeDataService.getTreeData().then(function (treeData) {
							setSettingsDialogConfigCache({
								dialogTitle: moduleName + '.simulationChart.chartDialog.settingsTitle',
								height : '730px',
								width: '1000px',
								items: [createNewCurveEntry(treeData)],
								editing : {
									add : function (items) {
										let treeData = estimateMainCostCodeDataService.getLocalCopyOfCostCodeTree();
										let newCurveItem = createNewCurveEntryAndAddToArray(treeData, items);
										return newCurveItem;
									},
									delete: function (items, deleteItem){
										let delIdx = items.indexOf(deleteItem);
										items.splice(delIdx, 1);
										return deleteItem;
									}
								},
								defaultForm: {
									fid: 'example',
									version: '1.0.0',
									showGrouping: true,
									groups: [
										{
											gid: 'dataSelection',
											header: 'Data Selection:',
											header$tr$: 'estimate.main.simulationChart.chartDialog.dataSelection',
											isOpen : true,
											sortOrder: 2
										},{
											gid: 'curveSettings',
											header: 'Curve Settings',
											header$tr$ : 'estimate.main.simulationChart.chartDialog.curveSettings',
											isOpen : true,
											sortOrder: 1
										}
									],
									rows: [
										{
											gid: 'curveSettings',
											rid: 'curveName',
											label: 'Curve name',
											label$tr$: 'estimate.main.simulationChart.chartDialog.curveName',
											type: 'description',
											model: 'Name',
											validator : function (curveItem) {
												curveItem.manualNameSet = true;
											}
										},{
											gid: 'curveSettings',
											rid: 'favcolor',
											label: 'Curve color',
											label$tr$: 'estimate.main.simulationChart.chartDialog.curveColor',
											type: 'color',
											model: 'Color'
										},
										{
											gid: 'curveSettings',
											type: 'directive',
											directive: 'model-simulation-timeline-selector',
											label: 'Timeline',
											label$tr$: 'estimate.main.simulationChart.chartDialog.timeline',
											model: 'simTimeline',
											directiveOptions: {
												timelineRequest: 'entity.timelineRequest',
												showDefaultItem: true
											}
										},
										{
											gid: 'dataSelection',
											model: 'calcSettings',
											type: 'composite',
											composite :[
												{
													label : 'Select Column',
													label$tr$: 'estimate.main.simulationChart.chartDialog.calcSelection',
													model: 'selection',
													type: 'select',
													fill: true,
													options: {
														items: estimateMainSimulationChartSelectionsConstant,
														valueMember: 'value',
														displayMember: 'text',
														modelIsObject: false
													},
													visible: true,
													tooltip$tr$ : 'estimate.main.simulationChart.chartDialog.automaticName',
													validator: function (item, newValue) {
														let curveObj = _.find(gridDialogConfigWorkingCopy.items, function (curveItem) {
															return curveItem.Id === item.curveId;
														});
														let actualResourceSelection = _.find(estimateMainSimulationChartSelectionsConstant, function (calculationSelection){
															return calculationSelection.value === newValue;
														});
														curveObj.Color = ColorProcessor.getUniqueColor(actualResourceSelection.curveType, getUsedColors());
													}
												}
											]
										}, {
											gid: 'dataSelection',
											rid: 'scopeLevel',
											model: 'dataSelection',
											type: 'directive',
											directive: 'estimate-main-simulation-chart-settings-grid',
											readonly: false,
											visible : true
										},{
											gid: 'dataSelection',
											model: 'settings',
											type: 'composite',
											composite :[
												{
													label : 'Depth Selection',
													label$tr$: 'estimate.main.simulationChart.chartDialog.depthSelection',
													rid: '',
													model: 'depthSelection',
													type: 'boolean',
													visible : true,
													tooltip$tr$ : 'estimate.main.simulationChart.chartDialog.depthSelection'
												},{
													label : 'Automatic Naming',
													label$tr$: 'estimate.main.simulationChart.chartDialog.automaticName',
													model: 'automaticName',
													type: 'boolean',
													visible : true,
													tooltip$tr$ : 'estimate.main.simulationChart.chartDialog.automaticName'
												}
											]
										}
									]
								}
							});
							return gridDialogConfigCache;
						});
					}
					else{
						return $q(function (resolve) {
							resolve(gridDialogConfigCache);
						});
					}
				}

				function setSettingsDialogConfigCache(gridDialogConfig){
					gridDialogConfigCache = gridDialogConfig;
				}

				service.showDialog = function (callBackFn) {
					// TODO: Moved to data service
					getSettingsDialogConfig().then(function (gridDialogConfig) {
						gridDialogConfigWorkingCopy = _.cloneDeep(gridDialogConfig);
						platformMasterDetailDialogService.showDialog(gridDialogConfigWorkingCopy).then(function (result) {
							platformGridAPI.grids.commitAllEdits();
							if (result.ok) {
								setSettingsDialogConfigCache(result.value);
								callBackFn(result.value.items);
							}
						});
					});
				};

				service.gridValidator = gridValidator;
				service.deleteCostCodeCache = function deleteCostCodeCache (){
					estimateMainCostCodeDataService.deleteCostCodeCache();
				};

				return service;
			}
		]);
})();
