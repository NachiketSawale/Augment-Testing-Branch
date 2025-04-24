/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.change';

	angular.module(moduleName).controller('modelChangeDetailController', ModelChangeDetailController);

	ModelChangeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelChangeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '37b54001f96f479ab3babd481b500d2b', 'modelMainTranslationService');
	}
})(angular);
