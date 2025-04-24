/**
 * Created by lav on 7/24/2020.
 */
(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.cadimportconfig';
	var angModule = angular.module(moduleName);

	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('ppsEngineeringCadImportConfigDetailController', DetailController);

	DetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function DetailController($scope, platformContainerControllerService) {
		var guid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, guid, 'productionplanningEngineeringTranslationService');
	}
})();
