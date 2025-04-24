/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.annotation';

	angular.module(moduleName).controller('modelAnnotationDetailController',
		modelAnnotationDetailController);

	modelAnnotationDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'modelViewerStandardFilterService', 'modelAnnotationDataService',
		'platformMenuListUtilitiesService'];

	function modelAnnotationDetailController($scope, platformContainerControllerService,
		modelViewerStandardFilterService, modelAnnotationDataService,
		platformMenuListUtilitiesService) {

		platformContainerControllerService.initController($scope, moduleName, '67e8894374e74eb29664b1182253323c');

		modelViewerStandardFilterService.attachMainEntityFilter($scope, modelAnnotationDataService);

		$scope.formContainerOptions.customButtons = [
			platformMenuListUtilitiesService.createToggleItemForObservable({
				value: modelAnnotationDataService.updateModelSelection,
				toolsScope: $scope
			})
		];
	}
})(angular);
