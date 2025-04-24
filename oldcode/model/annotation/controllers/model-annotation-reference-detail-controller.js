/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.annotation';

	angular.module(moduleName).controller('modelAnnotationReferenceDetailController',
		modelAnnotationReferenceDetailController);

	modelAnnotationReferenceDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function modelAnnotationReferenceDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5ead9a293b23439e9a668298ed75d438');
	}
})(angular);
