/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.annotation';

	angular.module(moduleName).controller('modelAnnotationListController',
		modelAnnotationListController);

	modelAnnotationListController.$inject = ['$scope', 'platformContainerControllerService',
		'modelViewerStandardFilterService', 'modelAnnotationDataService', '$injector',
		'modelViewerModelSelectionService', 'platformGridControllerService',
		'platformMenuListUtilitiesService'];

	function modelAnnotationListController($scope, platformContainerControllerService,
		modelViewerStandardFilterService, modelAnnotationDataService, $injector,
		modelViewerModelSelectionService, platformGridControllerService,
		platformMenuListUtilitiesService) {

		platformContainerControllerService.initController($scope, moduleName, '0a5454bc99c24a539dc1264262096b8c');

		modelViewerStandardFilterService.attachMainEntityFilter($scope, modelAnnotationDataService);

		const toolbarItems = [
			platformMenuListUtilitiesService.createToggleItemForObservable({
				value: modelAnnotationDataService.updateModelSelection,
				toolsScope: $scope
			})
		];

		platformGridControllerService.addTools(toolbarItems);

		(function initializeDropTarget() {
			$scope.ddTarget.canDrop = function (info) {
				if (info.draggedData && info.draggedData.draggingFromViewer) {
					const selParents = modelAnnotationDataService.getSelectedEntities();
					return Array.isArray(selParents) && selParents.length === 1;
				}

				return false;
			};

			$scope.ddTarget.drop = function (info) {
				if (info.draggedData && info.draggedData.draggingFromViewer) {
					const annotations = modelAnnotationDataService.getSelectedEntities();
					if (!Array.isArray(annotations) || annotations.length !== 1) {
						return;
					}

					const objLinkDataService = $injector.get('modelAnnotationObjectLinkDataService');

					objLinkDataService.createObjectLinks(modelViewerModelSelectionService.getSelectedModelId(), info.draggedData.getDraggedObjectIds().objectIds).then(function () {
						objLinkDataService.load();
					});
				}
			};
		})();
	}
})(angular);
