/**
 * $Id:$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'project.plantassembly';
	/**
     * @ngdoc controller
     * @name projectPlantAssemblyDetailController
     * @description controller for the project plant Assembly details form view
     */

	angular.module(moduleName).controller('projectPlantAssemblyDetailController', projectPlantAssemblyDetailController);

	projectPlantAssemblyDetailController.$inject = ['$scope','platformContainerControllerService'];
	function projectPlantAssemblyDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f7b4578655914fbc85dc7f65c803cfd8','projectPlantAssemblyTranslationService');
	}
})(angular);