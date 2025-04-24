/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.main';

	angular.module(moduleName).controller('modelMainViewerLegendDetailController', ModelMainViewerLegendDetailController);

	ModelMainViewerLegendDetailController.$inject = ['$scope', 'platformContainerControllerService', '$timeout',
		'platformMenuListUtilitiesService', 'modelMainViewerLegendDataService'];

	function ModelMainViewerLegendDetailController($scope, platformContainerControllerService, $timeout,
		platformMenuListUtilitiesService, modelMainViewerLegendDataService) {

		platformContainerControllerService.initController($scope, moduleName, 'd12461a0826a45f1ab76f53203b48ec6', 'modelMainTranslationService');

		$timeout(function () {
			$scope.tools.items.unshift(platformMenuListUtilitiesService.createToggleItemForObservable({
				value: modelMainViewerLegendDataService.updateModelSelection,
				toolsScope: $scope
			}));
			$scope.tools.update();
		});
	}
})(angular);
