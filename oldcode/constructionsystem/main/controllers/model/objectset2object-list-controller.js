(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainObjectSet2ObjectListController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionSystem main objectset2object grid.
	 */
	angular.module(moduleName).controller('constructionSystemMainObjectSet2ObjectListController', [
		'$scope', 'platformGridControllerService', 'constructionSystemMainObjectSet2ObjectService', 'constructionSystemMainObjectSet2ObjectUIConfigService',
		function ($scope, platformGridControllerService, dataService, uiConfigService) {

			var gridConfig = {
				columns: []
			};

			platformGridControllerService.initListController($scope, uiConfigService, dataService, null, gridConfig);
		}
	]);
})(angular);
