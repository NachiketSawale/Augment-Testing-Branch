/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global _ */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc controller
	 * @name estimateAssembliesAssembliesListControllerFactory
	 * @function
	 *
	 * @description
	 * Controller for the list view of Assembly entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateAssembliesAssembliesListControllerFactory',
		['$window', '$timeout', '$injector', '$translate', 'platformGridAPI', 'platformContainerControllerService', 'cloudCommonGridService',
			'estimateDefaultGridConfig', 'estimateMainDialogDataService',
			function ($window, $timeout, $injector, $translate, platformGridAPI, platformContainerControllerService, cloudCommonGridService,
				estimateDefaultGridConfig, estimateMainDialogDataService) {

				let factoryService = {};

				factoryService.initAssembliesListController = function ($scope, moduleName, estimateAssembliesService, estimateAssembliesValidationService, estimateAssembliesResourceService, estimateAssembliesFilterService, grid, isPrjAssembly, options) {
					let isPlantAssembly = options && options.isPlantAssembly,
						isPrjPlantAssembly = options && options.isPrjPlantAssembly,
						configurationExtendServiceName = options ? options.assembliesConfigurationExtendServiceName : null,
						costGroupServiceName = options ? options.assembliesCostGroupServiceName : null,
						assembliesDynamicUserDefinedColumnServiceName = options ? options.assembliesDynamicUserDefinedColumnServiceName : null;


					/* add costGroupService to mainService */
					if (!estimateAssembliesService.costGroupService) {
						if(isPrjAssembly){
							estimateAssembliesService.costGroupService = $injector.get('projectAssemblyCostGroupService');
						}else if(isPlantAssembly && !_.isEmpty(costGroupServiceName)){
							estimateAssembliesService.costGroupService = $injector.get(costGroupServiceName);
						}
						else {
							estimateAssembliesService.costGroupService = $injector.get('estimateAssembliesCostGroupService');
						}
					}

					let estimateAssembliesConfigurationExtendService = isPrjAssembly ? $injector.get('projectAssembliesConfigurationExtendService')
						: isPlantAssembly && !_.isEmpty(configurationExtendServiceName) ? $injector.get(configurationExtendServiceName) : $injector.get('estimateAssembliesConfigurationExtendService');

					estimateAssembliesConfigurationExtendService.attachCostGroup(estimateAssembliesService.costGroupCatalogs, estimateAssembliesService.costGroupService);

					function setDynamicColumnsLayoutToGrid(){
						estimateAssembliesConfigurationExtendService.applyToScope($scope);
					}

					estimateAssembliesConfigurationExtendService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);

					platformContainerControllerService.initController($scope, moduleName, grid);
					estimateAssembliesService.setIsAssembly(true);

					estimateAssembliesService.setIsPrjAssembly(isPrjAssembly);

					estimateAssembliesService.setIsPlantAssembly(isPlantAssembly);

					estimateAssembliesService.setIsPrjPlantAssembly(isPrjPlantAssembly);


					// connect to filter service
					if(!isPlantAssembly){
						estimateAssembliesFilterService.setServiceToBeFiltered(estimateAssembliesService);
						estimateAssembliesFilterService.setFilterFunction(estimateAssembliesFilterService.getCombinedFilterFunction); // default filter
					}

					// set assembly gridId
					estimateAssembliesService.setAssemblyGridId($scope.gridId);

					let tools = !isPlantAssembly ? estimateAssembliesFilterService.getToolbar() : [];
					$scope.setTools(tools);

					let toolAdds = [];
					if (isPrjAssembly){
						toolAdds = [
							{
								id: 'copy',
								caption: $translate.instant('estimate.assemblies.copy'),
								type: 'item',
								iconClass: 'tlb-icons ico-copy-line-item',
								fn: function () {
									estimateAssembliesService.deepCopy();
								}
							}
						];
					}else {
						toolAdds = [
							{
								id: 'modalConfig',
								caption: 'estimate.assemblies.assemblyConfigDialogTitle',
								type: 'item',
								cssClass: 'tlb-icons ico-settings-doc',
								fn: function () {
									estimateMainDialogDataService.showDialog(setDialogConfig());
								}
							},
							{
								id: 'copy',
								caption: $translate.instant('estimate.assemblies.copy'),
								type: 'item',
								iconClass: 'tlb-icons ico-copy-line-item',
								fn: function () {
									estimateAssembliesService.deepCopy();
								}
							}];
					}
					if (isPlantAssembly){
						$scope.addTools([]); // it calles updateTools() which shows other Toolbaritems properly
					}else{
						$scope.addTools(toolAdds);
					}

					// To do: set assembly configuration
					function setDialogConfig() {
						let dialogConfig = {
							editType: 'assemblies',// estimate || customizeforcolumn customizefortotals customizeforstructure customizeforupp
							columnConfigTypeId: '',
							totalsConfigTypeId: '',
							structureConfigTypeId: '',
							uppConfigTypeId: '',
							columnConfigFk: '',
							totalsConfigFk: '',
							structureConfigFk: '',
							uppConfigFk: '',
							isInUse: false
						};

						let lineItemContex = estimateAssembliesService.getContext();
						dialogConfig.headerId = lineItemContex.HeaderFk;
						return dialogConfig;
					}

					// deselect last selected item to trigger update (if selected item is not in current filtered list)
					function onFilterSet() {
						if (estimateAssembliesService.isItemFilterEnabled()) {
							let filteredList = estimateAssembliesService.getList(),
								selectedItem = estimateAssembliesService.getSelected();
							// not in list?
							if (filteredList.indexOf(selectedItem) < 0 || selectedItem.Version === 0) {
								estimateAssembliesService.deselect(); // to trigger update
							}
						}
					}

					// update toolbar
					function updateToolsWA() { // TODO: try to remove this workaround and analyse the problem...
						$timeout($scope.tools.update, 50);
					}

					if(!isPlantAssembly) {
						estimateAssembliesFilterService.onUpdated.register(onFilterSet);
						estimateAssembliesFilterService.onUpdated.register(updateToolsWA);
					}

					function toggleCreateButton(disabled) {
						if ($scope.tools) {
							let createButton = _.find($scope.tools.items, {id: 'create'});
							if (createButton) {
								createButton.disabled = disabled;
							}
						}
					}

					// TODO: remove to load assembly data, should not load at init container
					// estimateAssembliesService.clearOldRates();

					estimateAssembliesService.onToggleCreateButton.register(toggleCreateButton);
					if(!isPlantAssembly) {
						estimateAssembliesFilterService.onFilterButtonRemoved.register($scope.updateTools);
					}
					estimateAssembliesService.registerLookupFilter();

					// the characteristic service
					let characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(estimateAssembliesService, 30, null, 'EstHeaderFk');
					let CharacteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');

					// regist the event about characteristic item be changed
					characteristicDataService.registerItemValueUpdate(onItemUpdate);

					function onItemUpdate(e, item) {
						characteristicDataService.getItemByCharacteristicFk(item.CharacteristicFk).then(function (data) {
							item.CharacteristicEntity = data;
							let lineItem = estimateAssembliesService.getSelected();
							let lineItemList = estimateAssembliesService.getList();
							lineItem = lineItem.Id === item.ObjectFk ? lineItem : _.find(lineItemList, {'Id': item.ObjectFk});
							let characteristicCode = _.findLast(item.CharacteristicEntity.Code) === '.' ? _.trimEnd(item.CharacteristicEntity.Code, '.') : item.CharacteristicEntity.Code;
							let columnIdorField = _.replace(characteristicCode, ' ', '');
							let columnName = characteristicCode;
							let characteristicCol = $injector.get('estimateMainCommonService').appendCharacCol(columnIdorField, item);
							let isExist = $injector.get('estimateAssembliesDynamicColumnService').isExistColumn(characteristicCol);
							if (!item.isValueChange && item.OldCharacteristicEntity) {
								let oldCharacteristicCode = _.findLast(item.OldCharacteristicEntity.Code) === '.' ? _.trimEnd(item.OldCharacteristicEntity.Code, '.') : item.OldCharacteristicEntity.Code;
								let oldCharacteristicCol = $injector.get('estimateMainCommonService').appendCharacCol(oldCharacteristicCode, item);
								lineItem[oldCharacteristicCol] = null;
								if ($injector.get('estimateMainCommonService').isRemoveColunm(lineItem, oldCharacteristicCol, $injector.get('estimateMainService'))) {
									$injector.get('estimateAssembliesDynamicColumnService').removeColumn(oldCharacteristicCol);
								}
							}
							let type = CharacteristicTypeService.characteristicType2Domain(item.CharacteristicTypeFk);
							let value = CharacteristicTypeService.convertValue(item.ValueText, item.CharacteristicTypeFk);
							if (CharacteristicTypeService.isLookupType(item.CharacteristicTypeFk)) {
								$injector.get('estimateMainService').setCharacteristicColumn(characteristicCol);
								let characteristicListService = $injector.get('basicsCharacteristicCharacteristicValueDataService');
								characteristicListService.getList().then(function () {
									lineItem[characteristicCol] = value;
									if (!item.isValueChange && !isExist) {
										$injector.get('estimateAssembliesDynamicColumnService').addColumn(item, columnIdorField, columnName);
										$injector.get('estimateMainCommonService').syncCharacteristicCol(lineItem, characteristicCol, type, estimateAssembliesService);
									}
									$injector.get('estimateAssembliesDynamicColumnService').resizeAssemblyGrid(estimateAssembliesService);
								});
							} else {
								lineItem[characteristicCol] = value;
								if (!item.isValueChange && !isExist) {
									$injector.get('estimateAssembliesDynamicColumnService').addColumn(item, columnIdorField, columnName);
									$injector.get('estimateMainCommonService').syncCharacteristicCol(lineItem, characteristicCol, type, estimateAssembliesService);
								}
								$injector.get('estimateAssembliesDynamicColumnService').resizeAssemblyGrid(estimateAssembliesService);
							}
						});
					}

					// regist the event about characteristic item be deleted
					characteristicDataService.registerItemDelete(onItemDelete);

					function onItemDelete(e, items) {
						let lineItem = estimateAssembliesService.getSelected();
						let estimateMainCommonService = $injector.get('estimateMainCommonService');
						angular.forEach(items, function (item) {
							if (item.CharacteristicEntity !== null) {
								let characteristicCode = _.findLast(item.CharacteristicEntity.Code) === '.' ? _.trimEnd(item.CharacteristicEntity.Code, '.') : item.CharacteristicEntity.Code;
								let columnIdorField = _.replace(characteristicCode, ' ', '');
								let characteristicCol = estimateMainCommonService.appendCharacCol(columnIdorField, item);
								lineItem[characteristicCol] = null;
								if (estimateMainCommonService.isRemoveColunm(lineItem, characteristicCol, estimateAssembliesService)) {
									$injector.get('estimateAssembliesDynamicColumnService').removeColumn(characteristicCol);
								}
							}
						});
						$injector.get('estimateAssembliesDynamicColumnService').resizeAssemblyGrid(estimateAssembliesService);
					}

					// when active cell, get the column name
					platformGridAPI.events.register($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);

					function onActiveCellChanged(e, arg) {
						let column = arg.grid.getColumns()[arg.cell];
						if (column) {
							let isCharacteristic = $injector.get('estimateMainCommonService').isCharacteristicCulumn(column);
							if (isCharacteristic) {
								let lineItem = estimateAssembliesService.getSelected();
								if (lineItem !== null) {
									let col = column.field;
									let colArray = _.split(col, '_');
									if (colArray && colArray.length > 1) {
										let characteristicType = colArray[_.lastIndexOf(colArray) - 2];
										let value = parseInt(characteristicType);
										let isLookup = CharacteristicTypeService.isLookupType(value);
										let updateColumn = isLookup ? col : undefined;
										$injector.get('estimateMainService').setCharacteristicColumn(updateColumn);
									}
								}
							}
						}
					}

					let inquiryService = $injector.get('cloudDesktopSidebarInquiryService');
					inquiryService.handleInquiryToolbarButtons($scope, true/* include all button, depending on selection */);

					function onClickFuc() {
						$injector.get('estimateParamComplexLookupCommonService').setCurrentGridContent($scope.getContentValue('permission') || $scope.gridId, estimateAssembliesService);
					}

					platformGridAPI.events.register($scope.gridId, 'onClick', onClickFuc);

					/* register the cellChange event */
					estimateAssembliesService.costGroupService.registerCellChangedEvent($scope.gridId);

					function costGroupLoaded(costGroupCatalogs) {
						$injector.get('basicsCostGroupAssignmentService').addCostGroupColumns($scope.gridId, estimateAssembliesConfigurationExtendService, costGroupCatalogs, estimateAssembliesService, estimateAssembliesValidationService);
					}

					$scope.winEstAssemblyItem = null;

					/* refresh the columns configuration when we load the cost group catalogs */
					estimateAssembliesService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

					if ($window.parent !== null && $window.opener && $window.opener.selectedEntityID) {
						estimateAssembliesService.setWinEstAssemblyItem($window.opener.winEstAssemblyItem);
					}

					let assemblyDynamicUserDefinedColumnService = isPrjAssembly ? 'projectAssemblyDynamicUserDefinedColumnService'
						: isPlantAssembly && !_.isEmpty(assembliesDynamicUserDefinedColumnServiceName) ? assembliesDynamicUserDefinedColumnServiceName
							: 'estimateAssembliesDynamicUserDefinedColumnService';
					let dynamicUserDefinedColumnService = $injector.get(assemblyDynamicUserDefinedColumnService);
					dynamicUserDefinedColumnService.initReloadFn();

					function onInitialized() {
						dynamicUserDefinedColumnService.loadDynamicColumns();
					}
					platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

					$injector.get('estimateAssembliesAssemblyTypeDataService').getAssemblyTypes();

					estimateAssembliesService.registerSelectionChanged(itemSelectedChanged);
					function itemSelectedChanged(){
						estimateAssembliesService.setAssemblyCategory();
					}

					$scope.$on('$destroy', function () {
						if(!isPlantAssembly){
							estimateAssembliesFilterService.onUpdated.unregister(onFilterSet);
							estimateAssembliesFilterService.onUpdated.unregister(updateToolsWA);
							estimateAssembliesFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
						}
						estimateAssembliesService.unregisterLookupFilter();

						$injector.get('estimateMainParameterValueLookupService').clear();
						estimateAssembliesService.setIsAssembly(false);
						estimateAssembliesService.setIsPrjAssembly(false);
						estimateAssembliesService.setIsPlantAssembly(false);
						estimateAssembliesService.setIsPrjPlantAssembly(false);
						estimateAssembliesService.unregisterSelectionChanged(itemSelectedChanged);
						$injector.get('estimateAssembliesCategoryLookupDataService').clear();

						characteristicDataService.unregisterItemDelete(onItemDelete);
						characteristicDataService.unregisterItemValueUpdate(onItemUpdate);

						platformGridAPI.events.unregister($scope.gridId, 'onInitialized', onInitialized);
						platformGridAPI.events.unregister($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);
						platformGridAPI.events.unregister($scope.gridId, 'onClick', onClickFuc);

						/* unregister the onCostGroupCatalogsLoaded */
						estimateAssembliesService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);

						estimateAssembliesService.setWinEstAssemblyItem({});
						dynamicUserDefinedColumnService.onDestroy();
					});

					// definition: load all assemblies on start up
					if (!(isPrjAssembly || isPlantAssembly)) {
						estimateAssembliesService.load();
					}
				};

				return factoryService;
			}]);
})(angular);
