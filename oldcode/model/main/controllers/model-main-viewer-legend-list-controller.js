/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name model.viewer.controller:modelMainViewerLegendListController
	 * @description The controller for the model viewer legend container.
	 */
	angular.module('model.main').controller('modelMainViewerLegendListController',
		ModelMainViewerLegendListController);

	ModelMainViewerLegendListController.$inject = ['_', '$scope', '$translate',
		'platformContainerControllerService', 'modelMainViewerLegendDataService',
		'modelViewerViewerRegistryService', 'platformGridAPI', '$timeout',
		'platformMenuListUtilitiesService'];

	function ModelMainViewerLegendListController(_, $scope, $translate,
		platformContainerControllerService, modelMainViewerLegendDataService,
		modelViewerViewerRegistryService, platformGridAPI, $timeout,
		platformMenuListUtilitiesService) {

		const gridId = '3b5c28631ef44bb293ee05475a9a9513';

		platformContainerControllerService.initController($scope, 'model.main', gridId);

		const viewerMenu = modelMainViewerLegendDataService.createViewerMenu({
			updateTools: function () {
				$scope.tools.update();
			}
		});
		$scope.tools.items.unshift(viewerMenu.menuItem);
		$scope.tools.items.unshift(platformMenuListUtilitiesService.createToggleItemForObservable({
			value: modelMainViewerLegendDataService.updateModelSelection,
			toolsScope: $scope
		}));

		$scope.overlayInfo = $translate.instant('model.main.viewerLegend.noViewers');

		function updateActiveViewers() {
			$scope.$evalAsync(function () {
				$scope.showInfoOverlay = !modelViewerViewerRegistryService.isViewerActive();
			});
		}

		modelViewerViewerRegistryService.onViewersChanged.register(updateActiveViewers);
		updateActiveViewers();

		function listLoaded() {
			platformGridAPI.rows.expandAllNodes(gridId);
		}

		modelMainViewerLegendDataService.registerListLoaded(listLoaded);

		$timeout(function patchStructureColumn() {
			const cols = platformGridAPI.columns.configuration(gridId);
			const structureCol = _.find(cols.current, {
				id: 'tree'
			});
			structureCol.name = '';
			structureCol.name$tr$ = '';
			structureCol.width = structureCol.minWidth;
			platformGridAPI.columns.configuration(gridId, cols.current);
		});

		$scope.$on('$destroy', function () {
			modelMainViewerLegendDataService.unregisterListLoaded(listLoaded);
			modelViewerViewerRegistryService.onViewersChanged.unregister(updateActiveViewers);
			viewerMenu.destroy();
		});
	}
})(angular);
