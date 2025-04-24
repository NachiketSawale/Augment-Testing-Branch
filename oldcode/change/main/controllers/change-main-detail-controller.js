/**
 * Created by baf on 04.09.2014.
 */
(function (angular) {
	'use strict';
	var moduleName = 'change.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('changeMainDetailController', ChangeMainDetailController);

	ChangeMainDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ChangeMainDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '02f152811dd245c5a6eb51d3eaf93515', 'changeMainTranslationService');
	}
})(angular);