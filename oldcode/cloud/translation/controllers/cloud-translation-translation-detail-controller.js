/**
 * Created by baf on 30.05.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'cloud.translation';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('cloudTranslationTranslationDetailController', CloudTranslationTranslationDetailController);

	CloudTranslationTranslationDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function CloudTranslationTranslationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '26fb24afe1d64f8aa6434b9ee43919e5', 'cloudTranslationTranslationService');
	}
})(angular);