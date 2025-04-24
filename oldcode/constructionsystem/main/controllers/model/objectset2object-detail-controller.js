(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainObjectSet2ObjectDetailController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionsystem main objectset2object form.
	 */
	angular.module(moduleName).controller('constructionSystemMainObjectSet2ObjectDetailController', [
		'$scope', 'platformDetailControllerService', 'constructionSystemMainObjectSetService',
		'constructionSystemMainObjectSet2ObjectUIConfigService', 'modelMainTranslationService',
		function ($scope, platformDetailControllerService, dataService, uiConfigService, modelMainTranslationService) {

			platformDetailControllerService.initDetailController($scope, dataService, {}, uiConfigService, modelMainTranslationService);
		}
	]);
})(angular);
