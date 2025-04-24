/**
 * Created by baf on 2016/06/01.
 */
(function (angular) {
	'use strict';
	var moduleName = 'cloud.translation';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('cloudTranslationSourceDetailController', CloudTranslationSourceDetailController);

	CloudTranslationSourceDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function CloudTranslationSourceDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '4444643b757b4b1db98d603599E0a7a0', 'cloudTranslationTranslationService');
	}
})(angular);