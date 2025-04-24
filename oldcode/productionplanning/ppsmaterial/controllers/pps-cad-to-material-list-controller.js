/**
 * Created by lav on 8/9/2019.
 */
(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.ppsmaterial';
	var angModule = angular.module(moduleName);


	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('ppsCadToMaterialListController', ppsCadToMaterialListController);

	ppsCadToMaterialListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformTranslateService', 'ppsCadToMaterialUIStandardService'];
	function ppsCadToMaterialListController($scope, platformContainerControllerService,
																  platformTranslateService, uiStandardService) {
		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		platformContainerControllerService.initController($scope, moduleName, '6727ab5728gb492d8612gv47e73dgh90');
	}
})();