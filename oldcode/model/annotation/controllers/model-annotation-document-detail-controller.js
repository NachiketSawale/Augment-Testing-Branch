/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.annotation';

	angular.module(moduleName).controller('modelAnnotationDocumentDetailController',
		modelAnnotationDocumentDetailController);

	modelAnnotationDocumentDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function modelAnnotationDocumentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ac73e76de2924220a46956319d4d424c');
	}
})(angular);
