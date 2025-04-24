/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.annotation';

	angular.module(moduleName).controller('modelAnnotationObjectLinkListController',
		modelAnnotationObjectLinkListController);

	modelAnnotationObjectLinkListController.$inject = ['$scope', 'platformContainerControllerService',
		'modelAnnotationObjectLinkCreationService', 'modelAnnotationContainerInformationService',
		'$injector', 'modelViewerModelSelectionService', 'modelViewerStandardFilterService',
		'platformMenuListUtilitiesService', 'platformGridControllerService'];

	function modelAnnotationObjectLinkListController($scope, platformContainerControllerService,
		modelAnnotationObjectLinkCreationService, modelAnnotationContainerInformationService,
		$injector, modelViewerModelSelectionService, modelViewerStandardFilterService,
		platformMenuListUtilitiesService, platformGridControllerService) {

		const containerGuid = '26110cbc14374f7895d1d7934efd0a63';

		const depAnnoDataServiceName = $scope.getContentValue('depAnnoDataServiceName');
		if (depAnnoDataServiceName) {
			modelAnnotationContainerInformationService.overrideOnce(containerGuid, {
				dataServiceName: depAnnoDataServiceName
			});
		}

		platformContainerControllerService.initController($scope, moduleName, containerGuid);

		modelAnnotationObjectLinkCreationService.patchCreateButton($scope, depAnnoDataServiceName);

		modelViewerStandardFilterService.attachMainEntityFilter($scope, depAnnoDataServiceName || 'modelAnnotationObjectLinkDataService');

		const dataService = $injector.get(depAnnoDataServiceName ? depAnnoDataServiceName : 'modelAnnotationObjectLinkDataService');

		const toolbarItems = [
			platformMenuListUtilitiesService.createToggleItemForObservable({
				value: dataService.updateModelSelection,
				toolsScope: $scope
			})
		];

		platformGridControllerService.addTools(toolbarItems);

		(function initializeDropTarget() {
			$scope.ddTarget.canDrop = function (info) {
				if (info.draggedData && info.draggedData.draggingFromViewer) {
					const selParents = dataService.parentService().getSelectedEntities();
					return Array.isArray(selParents) && selParents.length === 1;
				}

				return false;
			};

			$scope.ddTarget.drop = function (info) {
				if (info.draggedData && info.draggedData.draggingFromViewer) {
					const annotations = dataService.parentService().getSelectedEntities();
					if (!Array.isArray(annotations) || annotations.length !== 1) {
						return;
					}

					dataService.createObjectLinks(modelViewerModelSelectionService.getSelectedModelId(), info.draggedData.getDraggedObjectIds().objectIds).then(function () {
						dataService.load();
					});
				}
			};
		})();
	}
})(angular);
