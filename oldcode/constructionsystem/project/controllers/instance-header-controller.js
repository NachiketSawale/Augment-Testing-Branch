(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.project';

	/**
	 * @ngdoc controller
	 * @name constructionSystemProjectInstanceHeaderController
	 * @function
	 * @description
	 *
	 * controller for the grid view of the construction system instance project.
	 **/
	/* jshint -W072 */
	angular.module(moduleName).controller('constructionSystemProjectInstanceHeaderController', [
		'$scope', '$translate', 'platformGridControllerService', 'constructionSystemProjectInstanceHeaderService',
		'constructionSystemProjectInstanceHeaderUIConfigService', 'constructionSystemProjectInstanceHeaderValidationService',
		function ($scope, $translate, platformGridControllerService, dataService, uiConfigService, validateService) {

			var gridConfig = {initCalled: false, columns: []};

			platformGridControllerService.initListController($scope, uiConfigService, dataService, validateService, gridConfig);

			$scope.addTools([
				{
					id: 't1001',
					sort: 3,
					caption: $translate.instant('constructionsystem.project.deepRemoveRecord'),
					type: 'item',
					iconClass: 'tlb-icons ico-delete',
					fn: function () {
						dataService.deepDelete();
					},
					disabled: function () {
						return !dataService.hasSelection();
					}
				}
			]);
		}
	]);
})(angular);