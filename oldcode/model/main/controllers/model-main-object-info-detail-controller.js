/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelMainObjectInfoDetailController', ModelMainObjectInfoDetailController);

	ModelMainObjectInfoDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelMainObjectInfoDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '114f1a46eaee483d829648e7dd60a63c', 'modelMainTranslationService');
	}
})(angular);