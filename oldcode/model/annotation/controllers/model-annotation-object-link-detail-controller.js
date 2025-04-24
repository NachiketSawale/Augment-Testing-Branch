/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.annotation';

	angular.module(moduleName).controller('modelAnnotationObjectLinkDetailController',
		modelAnnotationObjectLinkDetailController);

	modelAnnotationObjectLinkDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'modelAnnotationContainerInformationService', 'modelViewerStandardFilterService',
		'platformMenuListUtilitiesService', '$injector'];

	function modelAnnotationObjectLinkDetailController($scope, platformContainerControllerService,
		modelAnnotationContainerInformationService, modelViewerStandardFilterService,
		platformMenuListUtilitiesService, $injector) {

		const containerGuid = 'de29ed7ffa5d415fb38138f7eda5922e';

		const depAnnoDataServiceName = $scope.getContentValue('depAnnoDataServiceName');
		if (depAnnoDataServiceName) {
			modelAnnotationContainerInformationService.overrideOnce(containerGuid, {
				dataServiceName: depAnnoDataServiceName
			});
		}

		platformContainerControllerService.initController($scope, moduleName, containerGuid);

		modelViewerStandardFilterService.attachMainEntityFilter($scope, depAnnoDataServiceName || 'modelAnnotationObjectLinkDataService');

		const dataService = $injector.get(depAnnoDataServiceName ? depAnnoDataServiceName : 'modelAnnotationObjectLinkDataService');

		$scope.formContainerOptions.customButtons = [
			platformMenuListUtilitiesService.createToggleItemForObservable({
				value: dataService.updateModelSelection,
				toolsScope: $scope
			})
		];
	}
})(angular);
