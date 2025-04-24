/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.project';

	angular.module(moduleName).controller('modelProjectModelPartDetailController', ModelProjectModelPartDetailController);

	ModelProjectModelPartDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelProjectModelPartDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b5faadeba52d44828e9cb453913eb8fd', 'modelProjectMainTranslationService');
	}
})(angular);