/**
 * Created by baf on 30.05.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'cloud.translation';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('cloudTranslationLanguageDetailController', CloudTranslationLanguageDetailController);

	CloudTranslationLanguageDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function CloudTranslationLanguageDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6b045c1965cb43beab6f0efff980ca3c', 'cloudTranslationTranslationService');
	}
})(angular);