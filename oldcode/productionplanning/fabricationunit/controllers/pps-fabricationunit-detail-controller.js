(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.fabricationunit';
	angular.module(moduleName).controller('ppsFabricationunitDetailController', [
		'$scope', 'platformDetailControllerService',
		'ppsFabricationunitDataService', 'ppsFabricationunitUIService',
		'ppsFabricationunitValidationService', 'ppsFabricationunitTranslationService',
		function ($scope, platformDetailControllerService,
		          dataService, uiStandardService,
		          validationService, translationService) {
			platformDetailControllerService.initDetailController($scope, dataService, validationService, uiStandardService, translationService);
		}
	]);
})();