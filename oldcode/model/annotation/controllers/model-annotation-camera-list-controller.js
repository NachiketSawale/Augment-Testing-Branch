/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.annotation';

	angular.module(moduleName).controller('modelAnnotationCameraListController',
		modelAnnotationCameraListController);

	modelAnnotationCameraListController.$inject = ['$scope', 'platformContainerControllerService',
		'_', 'modelViewerViewerRegistryService', 'toolbarCommonService', '$translate',
		'modelAnnotationCameraDataService', 'modelAnnotationDataService',
		'modelAnnotationContainerInformationService', '$injector',
		'platformMenuListUtilitiesService'];

	function modelAnnotationCameraListController($scope, platformContainerControllerService,
		_, modelViewerViewerRegistryService, toolbarCommonService, $translate,
		modelAnnotationCameraDataService, modelAnnotationDataService,
		modelAnnotationContainerInformationService, $injector,
		platformMenuListUtilitiesService) {

		const containerUuid = '1278a2ca11f947bb8e02eab65e815a7d';

		const depAnnoDataServiceName = $scope.getContentValue('depAnnoDataServiceName');
		if (depAnnoDataServiceName) {
			modelAnnotationContainerInformationService.overrideOnce(containerUuid, {
				dataServiceName: depAnnoDataServiceName
			});
		}

		const dataService = _.isString(depAnnoDataServiceName) ? $injector.get(depAnnoDataServiceName) : modelAnnotationCameraDataService;

		platformContainerControllerService.initController($scope, moduleName, containerUuid);

		const addFromViewerGroup = {
			id: 'addFromViewer',
			type: 'sublist',
			list: {
				items: []
			}
		};

		const updateViewOptionsGroup = {
			id: 'updateViewOptions',
			type: 'sublist',
			list: {
				items: [
					platformMenuListUtilitiesService.createToggleItemForObservable({
						value: dataService.overwriteBlacklist,
						toolsScope: $scope
					}), platformMenuListUtilitiesService.createToggleItemForObservable({
						value: dataService.cuttingPlanes,
						toolsScope: $scope
					})]
			}
		};

		// TODO: how to retrieve toolbar ID?
		// toolbarCommonService.updateItemsById(containerUuid, addFromViewerGroup, 'create');
		$scope.tools.items.splice(0, 2, addFromViewerGroup);
		$scope.tools.items.splice(3, 1, updateViewOptionsGroup);
		$scope.tools.update();

		function updateViewers() {
			addFromViewerGroup.list.items = _.map(modelViewerViewerRegistryService.getViewers(), function (v) {
				return {
					id: 'createFromViewer' + v.name,
					type: 'item',
					iconClass: v.addIconClass,
					caption: $translate.instant('model.annotation.createCamPosFromSource', {
						source: v.getDisplayName()
					}),
					fn: () => dataService.createFromViewer(v),
					disabled: () => !dataService.canCreateFromViewer(v)
				};
			});

			$scope.tools.update();
		}

		modelViewerViewerRegistryService.onViewersChanged.register(updateViewers);
		updateViewers();

		function updateViewersState() {
			$scope.tools.update();
		}

		modelViewerViewerRegistryService.registerViewerReadinessChanged(updateViewersState);
		dataService.getParentDataService().registerSelectionChanged(updateViewersState);

		dataService.addActiveConsumerScope($scope);

		$scope.$on('$destroy', function () {
			modelViewerViewerRegistryService.unregisterViewerReadinessChanged(updateViewersState);
			dataService.getParentDataService().unregisterSelectionChanged(updateViewersState);
			modelViewerViewerRegistryService.onViewersChanged.unregister(updateViewers);
		});
	}
})(angular);
