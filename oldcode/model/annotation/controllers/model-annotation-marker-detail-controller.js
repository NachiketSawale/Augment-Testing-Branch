/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.annotation';

	angular.module(moduleName).controller('modelAnnotationMarkerDetailController',
		modelAnnotationMarkerDetailController);

	modelAnnotationMarkerDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'modelAnnotationContainerInformationService', '_', '$injector'];

	function modelAnnotationMarkerDetailController($scope, platformContainerControllerService,
		modelAnnotationContainerInformationService, _, $injector) {

		const containerUuid = 'b162c7c601ce4c6da794e49140ace8a7';

		const depAnnoDataServiceName = $scope.getContentValue('depAnnoDataServiceName');
		if (depAnnoDataServiceName) {
			modelAnnotationContainerInformationService.overrideOnce(containerUuid, {
				dataServiceName: depAnnoDataServiceName
			});
		}

		const dataService = _.isString(depAnnoDataServiceName) ? $injector.get(depAnnoDataServiceName) : $injector.get('modelAnnotationMarkerDataService');

		platformContainerControllerService.initController($scope, moduleName, containerUuid);

		dataService.addActiveUser();

		$scope.$on('$destroy', function () {
			dataService.removeActiveUser();
		});
	}
})(angular);
