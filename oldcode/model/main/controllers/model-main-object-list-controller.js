/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.main';

	/**
	 * @ngdoc controller
	 * @name modelMainObjectListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of business representations of geometry model objects
	 **/
	angular.module(moduleName).controller('modelMainObjectListController', ModelMainObjectListController);

	ModelMainObjectListController.$inject = ['_', '$scope', 'platformContainerControllerService',
		'platformGridAPI', 'modelMainObjectDataService', 'modelMainFilterService',
		'modelViewerHoopsSlaveService', 'modelViewerModelSelectionService',
		'modelViewerCompositeModelObjectSelectionService', 'platformGridControllerService',
		'modelMainObjectConfigurationService', '$injector',
		'modelMainObjectValidationService'];

	function ModelMainObjectListController(_, $scope, platformContainerControllerService,
		platformGridAPI, modelMainObjectDataService, modelMainFilterService,
		modelViewerHoopsSlaveService, modelViewerModelSelectionService,
		modelViewerCompositeModelObjectSelectionService, platformGridControllerService,
		modelMainObjectConfigurationService, $injector,
		modelMainObjectValidationService) {

		platformContainerControllerService.initController($scope, moduleName, '765FE63C3E3446C8945AEA76AB584249');
		modelMainFilterService.setServiceToBeFiltered(modelMainObjectDataService);
		modelMainFilterService.setFilterFunction(modelMainFilterService.getCombinedFilterFunction); // default filter

		(function () {
			const tools = modelMainFilterService.getToolbar();
			modelViewerHoopsSlaveService.addMainEntityWindowToolbarButton(tools);
			$scope.setTools(tools);
		})();

		// modelMainObjectDataService.setGridId($scope.gridId);
		modelViewerModelSelectionService.setItemSource('pinnedModel');

		function syncViewer() {
			const data = platformGridAPI.grids.getGridState($scope.gridId, false);
			modelMainObjectDataService.setFilteredList(data);
			modelMainObjectDataService.syncViewer(data);
		}

		function setSelectionOnViewer(e, arg) {
			if (arg) {
				const selection = platformGridAPI.rows.selection({
					gridId: $scope.gridId,
					wantsArray: true
				});

				modelMainObjectDataService.setSelectionOnViewer(angular.isArray(selection) ? selection : [selection]);
				setSelectedInstances(e, arg);
			}
		}

		function setSelectedInstances(e, arg) {
			const gridItems = platformGridAPI.rows.getRows($scope.gridId);
			const arr = [];
			if (arg) {
				angular.forEach(arg.rows, function (item) {
					const elem = gridItems[item];
					if (elem) {
						arr.push(elem);
					}
				});
			}
			modelMainObjectDataService.multipleSelectedItems = arr;
		}

		platformGridAPI.events.register($scope.gridId, 'onRowsChanged', syncViewer);
		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', setSelectionOnViewer);

		// update toolbar
		function updateToolsWA() {
			$scope.tools.update();
		}

		modelMainFilterService.onUpdated.register(updateToolsWA);

		const toolItems = $scope.tools.items;
		const addIdx = _.findIndex(toolItems, function (item) {
			return item.id === 'create';
		});

		if (addIdx < 0) {
			throw new Error('Failed to find toolbar button for creating new models.');
		}

		toolItems[addIdx].fn = function () {
			platformGridAPI.grids.commitAllEdits();
			modelMainObjectDataService.createItemForSubModel();
		};
		updateToolsWA();

		/* add costGroupService to mainService */
		if (!modelMainObjectDataService.costGroupService) {
			modelMainObjectDataService.costGroupService = $injector.get('modelMainObjectCostGroupService');
		}
		modelMainObjectDataService.costGroupService.registerCellChangedEvent($scope.gridId);

		function costGroupLoaded(costGroupCatalogs) {
			$injector.get('basicsCostGroupAssignmentService').addCostGroupColumns($scope.gridId, modelMainObjectConfigurationService, costGroupCatalogs, modelMainObjectDataService, modelMainObjectValidationService);
		}

		modelMainObjectDataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onRowsChanged', syncViewer);
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', setSelectionOnViewer);
			modelMainFilterService.onUpdated.unregister(updateToolsWA);

			modelMainObjectDataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
			modelMainObjectDataService.costGroupService.unregisterCellChangedEvent($scope.gridId);
		});
	}
})(angular);
