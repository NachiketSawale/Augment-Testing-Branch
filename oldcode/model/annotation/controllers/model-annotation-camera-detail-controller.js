/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.annotation';

	angular.module(moduleName).controller('modelAnnotationCameraDetailController',
		modelAnnotationCameraDetailController);

	modelAnnotationCameraDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'modelAnnotationCameraDataService', 'modelAnnotationContainerInformationService', '$injector',
		'_'];

	function modelAnnotationCameraDetailController($scope, platformContainerControllerService,
		modelAnnotationCameraDataService, modelAnnotationContainerInformationService, $injector,
		_) {

		const containerUuid = 'dfb06f32f92744358eee5d8b88496786';

		const depAnnoDataServiceName = $scope.getContentValue('depAnnoDataServiceName');
		if (depAnnoDataServiceName) {
			modelAnnotationContainerInformationService.overrideOnce(containerUuid, {
				dataServiceName: depAnnoDataServiceName
			});
		}

		const dataService = _.isString(depAnnoDataServiceName) ? $injector.get(depAnnoDataServiceName) : modelAnnotationCameraDataService;

		platformContainerControllerService.initController($scope, moduleName, containerUuid);

		dataService.addActiveConsumerScope($scope);
	}
})(angular);
