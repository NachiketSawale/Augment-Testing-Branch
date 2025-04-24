(function (angular) {
	'use strict';
	var moduleName = 'change.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('changeTotalsViewDetailController', ChangeTotalsViewDetailController);

	ChangeTotalsViewDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ChangeTotalsViewDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '51932a3ba48645c3a64542f5cec38893', 'changeMainTranslationService');
	}
})(angular);