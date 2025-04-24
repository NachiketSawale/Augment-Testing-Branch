/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name model.viewer.controller:modelMainObjectInfoListController
	 * @description The controller for the model object info container.
	 */
	angular.module('model.main').controller('modelMainObjectInfoListController',
		ModelMainObjectInfoListController);

	ModelMainObjectInfoListController.$inject = ['$scope', '$translate',
		'platformGridControllerService', 'modelMainObjectInfoConfigurationService',
		'modelMainObjectInfoDataService'];

	function ModelMainObjectInfoListController($scope, $translate,
		platformGridControllerService, modelMainObjectInfoConfigurationService,
		modelMainObjectInfoDataService) {

		const myGridConfig = {
			initCalled: false,
			// grouping:  true,
			tree: true,
			parentProp: 'parentId',
			childProp: 'children',
			hierarchyEnabled: true,
			childSort: false,
			isInitialSorted: true
			/*
			options: {
				tree: true,
				parentProp: 'parentName',
				childProp: 'groupName',
				hierarchyEnabled: true,
				childSort:false,
				isInitialSorted: true
			}
			 */
		};

		platformGridControllerService.initListController($scope, modelMainObjectInfoConfigurationService, modelMainObjectInfoDataService, null, myGridConfig);

		$scope.overlayInfo = $translate.instant('model.main.objectInfo.noData');
		$scope.showInfoOverlay = true;
		$scope.treeOptions = {
			tree: true,
			parentProp: 'parentId',
			childProp: 'children',
			hierarchyEnabled: true,
			childSort: false,
			isInitialSorted: true
		};

		function updateOverlayVisibility() {
			$scope.$evalAsync(function () {
				$scope.showInfoOverlay = modelMainObjectInfoDataService.getList().length === 0;
			});
		}

		modelMainObjectInfoDataService.registerListLoaded(updateOverlayVisibility);

		updateOverlayVisibility();

		$scope.$on('$destroy', function () {
			modelMainObjectInfoDataService.unregisterListLoaded(updateOverlayVisibility);
		});
	}
})(angular);
