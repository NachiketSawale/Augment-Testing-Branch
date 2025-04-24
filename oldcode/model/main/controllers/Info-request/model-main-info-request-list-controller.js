/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.main';

	angular.module(moduleName).controller('modelMainInfoRequestListController', ModelMainInfoRequestListController);

	ModelMainInfoRequestListController.$inject = ['$scope', '$rootScope', '$translate',
		'platformContainerControllerService', 'modelMainInfoRequestDataService', 'platformGridControllerService',
		'cloudDesktopPinningContextService', 'modelViewerViewerRegistryService', 'modelViewerMarkerService'];

	function ModelMainInfoRequestListController($scope, $rootScope, $translate,
		platformContainerControllerService, modelMainInfoRequestDataService, platformGridControllerService,
		cloudDesktopPinningContextService, modelViewerViewerRegistryService, modelViewerMarkerService) {

		platformContainerControllerService.initController($scope, 'Model.Main', '281de48b068c443c9b7c62a7f51ac45f');

		function setShowInfoOverlay() {
			const context = cloudDesktopPinningContextService.getPinningItem('project.main');
			$scope.showInfoOverlay = !context;
		}

		setShowInfoOverlay();
		$scope.overlayInfo = $translate.instant('model.main.noPinnedProject');

		cloudDesktopPinningContextService.onSetPinningContext.register(setShowInfoOverlay);
		cloudDesktopPinningContextService.onClearPinningContext.register(setShowInfoOverlay);

		$scope.$on('$destroy', function () {
			modelMainInfoRequestDataService.unregisterAll();
			cloudDesktopPinningContextService.onSetPinningContext.unregister(setShowInfoOverlay);
			cloudDesktopPinningContextService.onClearPinningContext.unregister(setShowInfoOverlay);
		});

		let isActionActive = false;
		const updateAction = function () {
			if (modelViewerViewerRegistryService.isViewerActive()) {
				if (!isActionActive) {
					modelMainInfoRequestDataService.setActionActive();
					isActionActive = true;
				}
			}
		};
		updateAction();

		modelViewerViewerRegistryService.onViewersChanged.register(updateAction);
		$scope.$on('$destroy', function () {
			modelViewerViewerRegistryService.onViewersChanged.unregister(updateAction);
		});

		const toolbarItems = [
			modelViewerMarkerService.createZoomToViewerButton({
				addFinalizer: function (finalizer) {
					$scope.$on('$destroy', finalizer);
				},
				buttonUpdated: function () {
					$scope.tools.update();
				}
			})
		];

		const items = modelMainInfoRequestDataService.getList();
		if (items.length <= 0) {
			modelMainInfoRequestDataService.loadAllRequests();
		}

		platformGridControllerService.addTools(toolbarItems);
	}
})(angular);
