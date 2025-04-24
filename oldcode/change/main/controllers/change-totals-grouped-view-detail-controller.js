(function (angular) {
	'use strict';
	var moduleName = 'change.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('changeTotalsGroupedViewDetailController', ChangeTotalsGroupedViewDetailController);

	ChangeTotalsGroupedViewDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ChangeTotalsGroupedViewDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'af568b67503b405281d4146b1e00f1a8', 'changeMainTranslationService');
	}
})(angular);