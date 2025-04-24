(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';
	/* global _ */

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainObject2LocationListController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionSystem main object2Location grid.
	 */
	angular.module(moduleName).controller('constructionSystemMainObject2LocationListController',
		constructionSystemMainObject2LocationListController);

	constructionSystemMainObject2LocationListController.$inject = ['$scope', '$http', 'platformContainerControllerService', 'platformModuleStateService',
		'constructionSystemMainInstance2ObjectService', 'constructionSystemMainObject2LocationService', 'constructionSystemMainInstanceService'];

	function constructionSystemMainObject2LocationListController($scope, $http, platformContainerControllerService, platformModuleStateService,
		parentService, dataService, constructionSystemMainInstanceService) {

		function onSelectionChanged(e, parentItem) {
			var modState = platformModuleStateService.state(dataService.getModule());
			if (modState && modState.modifications) {
				if (modState.modifications.Instance2ObjectToSave && modState.modifications.Instance2ObjectToSave.length > 0) {
					_.forEach(modState.modifications.Instance2ObjectToSave, function (item) {
						if (item.ModelObject2LocationsToSave && item.ModelObject2LocationsToSave.length > 0) {
							dataService.saveModelObject2Location(item.ModelObject2LocationsToSave);
							item.ModelObject2LocationsToSave = [];
						}
						if (item.ModelObject2LocationsToDelete && item.ModelObject2LocationsToDelete.length > 0) {
							dataService.deleteModelObject2Location(item.ModelObject2LocationsToDelete);
							item.ModelObject2LocationsToDelete = [];
						}
					});
				}
			}
		}

		constructionSystemMainInstanceService.provideUpdateData = function (updateData) {
			if (updateData.Instance2ObjectToSave && updateData.Instance2ObjectToSave.length > 0) {
				_.forEach(updateData.Instance2ObjectToSave, function (item) {
					if (item.ModelObject2LocationsToSave && item.ModelObject2LocationsToSave.length > 0) {
						dataService.saveModelObject2Location(item.ModelObject2LocationsToSave);
					}
					if (item.ModelObject2LocationsToDelete && item.ModelObject2LocationsToDelete.length > 0) {
						dataService.deleteModelObject2Location(item.ModelObject2LocationsToDelete);
					}
				});
			}
			return updateData;
		};
		parentService.registerSelectionChanged(onSelectionChanged);
		platformContainerControllerService.initController($scope, moduleName, 'f46d660558a7438fb2cc8014f00f00b4');

		$scope.$on('$destroy', function () {
			parentService.unregisterSelectionChanged(onSelectionChanged);
		});
	}
})(angular);
