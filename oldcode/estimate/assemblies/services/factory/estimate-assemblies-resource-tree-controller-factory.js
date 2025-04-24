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
	 * @name estimateAssembliesResourcesTreeControllerFactory
	 * @function
	 *
	 * @description
	 * Controller for the list view of Assembly Resources entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateAssembliesResourcesTreeControllerFactory',
		['$timeout', '$injector', '$translate', 'platformGridAPI', 'platformContainerControllerService', 'estimateMainCommonService', 'estimateMainResourceType','estimateMainGenerateSortingService',
			function ($timeout, $injector, $translate, platformGridAPI, platformContainerControllerService, estimateMainCommonService, estimateMainResourceType,estimateMainGenerateSortingService)
			{

				let factoryService = {};

				factoryService.initAssembliesResourceController = function ($scope, moduleName, estimateAssembliesResourceService, estimateAssembliesResourceDynamicConfigurationService, grid, isPrjAssembly, options) {

					let isPlantAssembly = options && options.isPlantAssembly,
						isPrjPlantAssembly = options && options.isPrjPlantAssembly,
						resourcesDynamicUserDefinedColumnServiceName = options ? options.resourcesDynamicUserDefinedColumnServiceName : null;

					platformContainerControllerService.initController($scope, moduleName, grid);

					estimateAssembliesResourceService.setScope($scope);

					estimateAssembliesResourceService.registerFilters();

					platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellModified);

					function onCellModified(e, arg) {
						/* merge cell: type is I/T */
						let item = arg.item;
						if (item.EstResourceTypeFk === estimateMainResourceType.TextLine || item.EstResourceTypeFk === estimateMainResourceType.InternalTextLine) {
							estimateMainCommonService.setMergeCell(item, $scope.gridId);
							platformGridAPI.grids.invalidate($scope.gridId);
							platformGridAPI.grids.refresh($scope.gridId);
						}
						if (item.EstResourceTypeFk === estimateMainResourceType.ComputationalLine) {
							estimateMainCommonService.setCLMergeCell(item, $scope.gridId);
							platformGridAPI.grids.invalidate($scope.gridId);
							platformGridAPI.grids.refresh($scope.gridId);
						}
					}

					function setAssemblyResources() {
						let list = estimateAssembliesResourceService.getList();
						$injector.get('estimateAssembliesService').setAssemblyResources(list);

						/* merge cell: type is I/T */
						list.forEach(function (item) {
							if (item.EstResourceTypeFk === estimateMainResourceType.TextLine || item.EstResourceTypeFk === estimateMainResourceType.InternalTextLine) {
								estimateMainCommonService.setMergeCell(item, $scope.gridId);
							}
							if (item.EstResourceTypeFk === estimateMainResourceType.ComputationalLine) {
								estimateMainCommonService.setCLMergeCell(item, $scope.gridId);
							}
						});

						platformGridAPI.grids.invalidate($scope.gridId);
						platformGridAPI.grids.refresh($scope.gridId);
					}

					function itemModified(res) {
						estimateAssembliesResourceService.markItemAsModified(res);
					}

					// update toolbar
					function updateTools() {
						$scope.tools.update();
					}

					function onBeforeEditCell(e, args) {
						// For Resource Characteristics lookup type
						if (args.column.id.indexOf('charactercolumn_') > -1) {
							if (!estimateAssembliesResourceService.hasSelection()) { // workaround to select detect selection on estimate resource
								return $timeout(function () {
									onBeforeEditCell(e, args);
								});
							}
							let assemblyResourceCharacteristicsService = isPrjAssembly ? $injector.get('projectAssembliesResourceCharacteristicsService') : $injector.get('estimateAssembliesResourceCharacteristicsService');
							let charColumnId = parseInt(_.last(args.column.id.split('_')));
							let resCharEntity = _.find(assemblyResourceCharacteristicsService.getUnfilteredList(), {CharacteristicFk: charColumnId});
							let basicsCharacteristicTypeHelperService = $injector.get('basicsCharacteristicTypeHelperService');

							if (!_.isEmpty(resCharEntity) && resCharEntity.CharacteristicEntity && basicsCharacteristicTypeHelperService.isLookupType(resCharEntity.CharacteristicEntity.CharacteristicTypeFk)) {
								$injector.get('basicsCharacteristicCharacteristicService').setSelected(resCharEntity.CharacteristicEntity);
							}
						}
					}

					estimateAssembliesResourceService.registerSelectionChanged(updateTools);
					estimateAssembliesResourceService.registerListLoaded(setAssemblyResources);
					estimateMainGenerateSortingService.resourceItemModified.register(itemModified);

					platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);

					// Register dynamic characteristic columns
					if (!isPlantAssembly || !isPrjPlantAssembly) {
						let assemblyResourceCharacteristicsService = isPrjAssembly ? $injector.get('projectAssembliesResourceCharacteristicsService') : $injector.get('estimateAssembliesResourceCharacteristicsService');
						assemblyResourceCharacteristicsService.registerEvents();
					}

					function setDynamicColumnsLayoutToGrid() {
						estimateAssembliesResourceDynamicConfigurationService.applyToScope($scope);
					}

					estimateAssembliesResourceDynamicConfigurationService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);

					let assemblyResourceDynamicUserDefinedColumnService = isPrjAssembly ? 'projectAssemblyResourceDynamicUserDefinedColumnService' : (isPlantAssembly || isPrjPlantAssembly) && !_.isEmpty(resourcesDynamicUserDefinedColumnServiceName) ? resourcesDynamicUserDefinedColumnServiceName : 'estimateAssembliesResourceDynamicUserDefinedColumnService';
					let dynamicUserDefinedColumnService = $injector.get(assemblyResourceDynamicUserDefinedColumnService);
					dynamicUserDefinedColumnService.initReloadFn();

					function onInitialized() {
						dynamicUserDefinedColumnService.loadDynamicColumns();
					}
					platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

					estimateAssembliesResourceService.setGridId($scope.gridId);

					$scope.$on('$destroy', function () {
						estimateAssembliesResourceService.unregisterFilters();
						estimateAssembliesResourceService.unregisterListLoaded(setAssemblyResources);
						estimateMainGenerateSortingService.resourceItemModified.unregister(itemModified);
						platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellModified);

						if (!isPlantAssembly) {
							let assemblyResourceCharacteristicsService = isPrjAssembly ? $injector.get('projectAssembliesResourceCharacteristicsService') : $injector.get('estimateAssembliesResourceCharacteristicsService');
							assemblyResourceCharacteristicsService.unregisterEvents();
						}

						platformGridAPI.events.unregister($scope.gridId, 'onInitialized', onInitialized);
						estimateAssembliesResourceService.unregisterSelectionChanged(updateTools);
						platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);
						dynamicUserDefinedColumnService.onDestroy();
						estimateAssembliesResourceDynamicConfigurationService.unregisterSetConfigLayout(setDynamicColumnsLayoutToGrid);
					});
				};

				return factoryService;
			}
		]);
})(angular);
