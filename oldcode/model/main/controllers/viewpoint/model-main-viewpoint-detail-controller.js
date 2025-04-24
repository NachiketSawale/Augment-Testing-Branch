/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {

	'use strict';
	const moduleName = 'model.main';

	/**
	 * @ngdoc controller
	 * @name modelMainViewpointDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details container of model viewpoints.
	 **/

	angular.module(moduleName).controller('modelMainViewpointDetailController', ['$scope',
		'platformContainerControllerService', 'modelMainContainerInformationService',
		function ($scope, platformContainerControllerService, modelMainContainerInformationService) {
			const containerUuid = '10b630738b584731a275fa5dbdf225a3';

			const depAnnoDataServiceName = $scope.getContentValue('depAnnoDataServiceName');
			if (depAnnoDataServiceName) {
				modelMainContainerInformationService.overrideOnce(containerUuid, {
					dataServiceName: depAnnoDataServiceName
				});
			}
			platformContainerControllerService.initController($scope, moduleName, containerUuid);
		}]);
})(angular);

