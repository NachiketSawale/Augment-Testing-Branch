/**
 * Created by zwz on 2024/5/22.
 */
(function () {

	/*global angular*/
	'use strict';
	const moduleName = 'productionplanning.ppsmaterial';
	let angModule = angular.module(moduleName);


	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('ppsMaterialToMdlProductTypeListController', ListController);

	ListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformTranslateService', 'ppsMaterialToMdlProductTypeUIStandardService'];
	function ListController($scope, platformContainerControllerService,
																  platformTranslateService, uiStandardService) {
		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		platformContainerControllerService.initController($scope, moduleName, 'dc136f0fea314fcda4517b27edbe0dee');
	}
})();