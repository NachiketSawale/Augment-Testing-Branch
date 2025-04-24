/* global Slick */
/**
 * Created by csalopek on 11.02.2017.
 */

(function () {

	'use strict';

	var moduleName = 'scheduling.main';

	angular.module(moduleName).value('schedulingPrimaveraListColumns', {

		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'EPSProjects',
						field: 'EPSProjects',
						name: 'EPSProjects',
						name$tr$: 'cloud.common.entityDescription',
						domain: 'Description',
						readonly: true
					}
				]
			};
		}
	});

	/**
	 * @ngdoc controller
	 * @name schedulingPrimaveraListController
	 * @function
	 *
	 * @description
	 * controller for the group selection tree
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingPrimaveraListController', ['$scope', 'schedulingMainPrimaveraService', 'schedulingPrimaveraListColumns', 'platformGridAPI', 'platformTranslateService',
		function ($scope, schedulingMainPrimaveraService, schedulingPrimaveraListColumns, platformGridAPI, platformTranslateService) {

			$scope.gridTriggersSelectionChange = false;

			// grid's id === container's uuid
			$scope.gridId = '86AC7C45372B487A825C3685BA65A3DB';

			$scope.gridData = {
				state: $scope.gridId
			};

			var settings = schedulingPrimaveraListColumns.getStandardConfigForListView();
			if (!settings.isTranslated) {
				platformTranslateService.translateGridConfig(settings.columns);
				settings.isTranslated = true;
			}

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				var grid = {
					columns: angular.copy(settings.columns),
					data: [],
					id: $scope.gridId,
					lazyInit: true,
					options: {
						tree: false,
						indicator: true,
						idProperty: 'Id',
						iconClass: '',
						editorLock: new Slick.EditorLock()
					}
				};

				platformGridAPI.grids.config(grid);
			}

			function updateItemList() {

				platformGridAPI.items.data($scope.gridId, schedulingMainPrimaveraService.getList());

			}

			schedulingMainPrimaveraService.registerListLoaded(updateItemList);
			schedulingMainPrimaveraService.assertIsLoaded();

			$scope.$on('$destroy', function () {
				schedulingMainPrimaveraService.unregisterListLoaded(updateItemList);
				platformGridAPI.grids.unregister($scope.gridId);
			});

		}]);
})();
