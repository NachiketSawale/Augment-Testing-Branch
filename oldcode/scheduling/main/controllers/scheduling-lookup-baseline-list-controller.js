/* global Slick */
/**
 * Created by leo on 18.08.2015.
 */
(function () {

	'use strict';

	var moduleName = 'scheduling.main';

	angular.module(moduleName).value('schedulingLookupBaselineListColumns', {

		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						domain: 'description',
						readonly: true
					},
					{
						id: 'remark',
						field: 'Remark',
						name: 'Remark',
						name$tr$: 'cloud.common.entityRemark',
						domain: 'remark',
						readonly: true
					},
					{
						id: 'insertedat',
						field: 'InsertedAt',
						name: 'InsertedAt',
						name$tr$: 'cloud.common.entityInsertedAt',
						formatter: 'datetime',
						readonly: true
					},
					{
						id: 'insertedby',
						field: '__rt$data.history.insertedBy',
						name: 'InsertedBy',
						name$tr$: 'cloud.common.entityInsertedBy',
						formatter: 'description',
						readonly: true
					}
				]
			};
		}
	});

	/**
	 * @ngdoc controller
	 * @name schedulingLookupBaselineListController
	 * @function
	 *
	 * @description
	 * controller for the group selection tree
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingLookupBaselineListController', ['$scope', 'schedulingMainBaselineService', 'schedulingLookupBaselineListColumns', 'platformGridAPI', 'platformTranslateService',
		function ($scope, schedulingMainBaselineService, schedulingLookupBaselineListColumns, platformGridAPI, platformTranslateService) {

			$scope.gridTriggersSelectionChange = false;

			// grid's id === container's uuid
			$scope.gridId = 'EBD40E2A372A4BA08AD7B5E444E2D898';

			$scope.gridData = {
				state: $scope.gridId
			};

			var settings = schedulingLookupBaselineListColumns.getStandardConfigForListView();
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

				platformGridAPI.items.data($scope.gridId, schedulingMainBaselineService.getList());

			}

			schedulingMainBaselineService.registerListLoaded(updateItemList);
			schedulingMainBaselineService.assertIsLoaded();

			$scope.$on('$destroy', function () {
				schedulingMainBaselineService.unregisterListLoaded(updateItemList);
				platformGridAPI.grids.unregister($scope.gridId);
			});

		}]);
})();