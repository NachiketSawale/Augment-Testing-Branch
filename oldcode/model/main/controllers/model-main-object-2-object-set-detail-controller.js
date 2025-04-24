/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.main';

	angular.module(moduleName).controller('modelMainObject2ObjectSetDetailController', ModelMainObjectSetDetailController);

	ModelMainObjectSetDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelMainObjectSetDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f300d21290d6492a963ed4ab07145ff0', 'modelMainTranslationService');
	}
})(angular);