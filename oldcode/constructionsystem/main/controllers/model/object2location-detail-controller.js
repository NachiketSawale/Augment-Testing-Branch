(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainObject2LocationDetailController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionSystem main object2Location detail.
	 */
	angular.module(moduleName).controller('constructionSystemMainObject2LocationDetailController', [
		'$scope', 'platformDetailControllerService', 'constructionSystemMainObject2LocationService',
		'constructionSystemMainObject2LocationConfigurationService', 'modelMainTranslationService',
		function ($scope, platformDetailControllerService, dataService, uiConfigService, modelMainTranslationService) {

			platformDetailControllerService.initDetailController($scope, dataService, {}, uiConfigService, modelMainTranslationService);
		}
	]);
})(angular);
