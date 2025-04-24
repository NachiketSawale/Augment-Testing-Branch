/**
 * Created by zwz on 2024/5/23.
 */
(function () {

	/*global angular*/
	'use strict';
	const moduleName = 'productionplanning.ppsmaterial';
	let angModule = angular.module(moduleName);
	/* jshint -W072*/ //many parameters because of dependency injection

	angModule.controller('ppsMaterialToMdlProductTypeDetailController', DetailController);

	DetailController.$inject =
		['$scope', 'platformContainerControllerService'];
	function DetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6813f89fc9974d5daa7da9f1079c5dfc', 'productionplanningPpsMaterialTranslationService');
	}
})();
