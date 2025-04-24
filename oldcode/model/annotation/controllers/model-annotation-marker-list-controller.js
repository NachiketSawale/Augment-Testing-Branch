/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.annotation';

	angular.module(moduleName).controller('modelAnnotationMarkerListController',
		modelAnnotationMarkerListController);

	modelAnnotationMarkerListController.$inject = ['$scope', 'platformContainerControllerService',
		'modelAnnotationContainerInformationService', 'modelAnnotationMarkerDataService',
		'_', '$injector', 'modelViewerPositioningService', 'modelViewerModelSelectionService', '$timeout'];

	function modelAnnotationMarkerListController($scope, platformContainerControllerService,
		modelAnnotationContainerInformationService, modelAnnotationMarkerDataService,
		_, $injector, modelViewerPositioningService, modelViewerModelSelectionService, $timeout) {

		const containerUuid = 'cf264c9dbb51466cb147e1a7f7f5d888';

		const depAnnoDataServiceName = $scope.getContentValue('depAnnoDataServiceName');
		if (depAnnoDataServiceName) {
			modelAnnotationContainerInformationService.overrideOnce(containerUuid, {
				dataServiceName: depAnnoDataServiceName
			});
		}

		const dataService = _.isString(depAnnoDataServiceName) ? $injector.get(depAnnoDataServiceName) : modelAnnotationMarkerDataService;

		platformContainerControllerService.initController($scope, moduleName, containerUuid);

		function applyPickedPosition(pickingResult, item) {
			item.PosX = pickingResult.pos.x;
			item.PosY = pickingResult.pos.y;
			item.PosZ = pickingResult.pos.z;
		}

		$scope.tools.items.splice(0, 2, {
			id: 'editMarkerGroup',
			type: 'sublist',
			list: {
				items: [{
					id: 'addMarker',
					type: 'item',
					caption: 'model.annotation.createMarker',
					iconClass: 'tlb-icons ico-marker-add',
					fn: function () {
						modelViewerPositioningService.setMarkerShapeId(null);
						return modelViewerPositioningService.pickPosition().then(function (result) {
							if (result) {
								return dataService.createItem().then(function (newItem) {
									$timeout(function () {
										applyPickedPosition(result, newItem);
										dataService.markItemAsModified(newItem);
									}, 200);
								});
							}
						});
					},
					disabled: () => !dataService.canCreate()
				}, {
					id: 'setMarker',
					type: 'item',
					caption: 'model.annotation.setMarker',
					iconClass: 'tlb-icons ico-marker-set',
					fn: function () {
						const selMarker = dataService.getSelected();
						modelViewerPositioningService.setMarkerShapeId(selMarker.MarkerShapeFk);
						return modelViewerPositioningService.pickPosition().then(function (result) {
							applyPickedPosition(result, selMarker);
							dataService.markItemAsModified(selMarker);
						});
					},
					disabled: function () {
						const selItem = dataService.getSelected();
						if (selItem) {
							const selModel = modelViewerModelSelectionService.getSelectedModel();
							if (selModel) {
								return !selModel.isGlobalModelIdIncluded(selItem.ContextModelId);
							}
						}
						return true;
					}
				}]
			}
		});
		$scope.tools.update();

		dataService.addActiveUser();

		function updateViewersState() {
			$scope.tools.update();
		}

		modelViewerModelSelectionService.onSelectedModelChanged.register(updateViewersState);

		$scope.$on('$destroy', function () {
			modelViewerModelSelectionService.onSelectedModelChanged.unregister(updateViewersState);
			dataService.removeActiveUser();
		});
	}
})(angular);
