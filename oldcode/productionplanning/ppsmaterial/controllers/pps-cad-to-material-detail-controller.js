/**
 * Created by lav on 8/12/2019.
 */
(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.ppsmaterial';
	var angModule = angular.module(moduleName);
	/* jshint -W072*/ //many parameters because of dependency injection

	angModule.controller('ppsCadToMaterialDetailController', ppsCadToMaterialDetailController);

	ppsCadToMaterialDetailController.$inject =
		['$scope', 'platformContainerControllerService'];
	function ppsCadToMaterialDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '7727ab5728gb492d8612gv47e73dgh97', 'productionplanningPpsMaterialTranslationService');
	}
})();
