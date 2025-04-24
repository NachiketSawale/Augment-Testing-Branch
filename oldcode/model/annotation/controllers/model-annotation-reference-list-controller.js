/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.annotation';

	angular.module(moduleName).controller('modelAnnotationReferenceListController',
		modelAnnotationReferenceListController);

	modelAnnotationReferenceListController.$inject = ['$scope', 'platformContainerControllerService'];

	function modelAnnotationReferenceListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '86d0e1fe63d24c1eb25c05a7ad470844');
	}
})(angular);
