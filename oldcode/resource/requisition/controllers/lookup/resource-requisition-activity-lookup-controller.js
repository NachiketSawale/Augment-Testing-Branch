/**
 * Created by leo on 13.04.2015.
 */
(function () {

	'use strict';

	var moduleName = 'resource.requisition';

	angular.module(moduleName).value('resourceRequisitionActivityLookupListColumns', {

		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true
					},
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						readonly: true,
						width: 270
					}
				]
			};
		}
	});

	/**
	 * @ngdoc controller
	 * @name schedulingMainTemplateGroupController
	 * @function
	 *
	 * @description
	 * controller for the group selection tree
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('resourceRequisitionActivityLookupController', ['$scope', 'resourceRequisitionActivityLookupDataService', 'resourceRequisitionActivityLookupListColumns', 'platformGridAPI', 'platformTranslateService',
		function ($scope, resourceActivityLookupDataService, resourceActivityLookupListColumns, platformGridAPI, platformTranslateService) {

			$scope.gridTriggersSelectionChange = false;

			// grid's id === container's uuid
			$scope.gridId = 'd47a0fa28e9048869856cdb2123c9928';

			$scope.gridData = {
				state: $scope.gridId
			};

			var settings = resourceActivityLookupListColumns.getStandardConfigForListView();
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
						tree: true,
						indicator: true,
						idProperty: 'Id',
						iconClass: '',
						editorLock: new Slick.EditorLock(),
						parentProp: 'ActivityFk',
						childProp: 'Activities'
					}
				};

				platformGridAPI.grids.config(grid);
			}

			function onSelectedRowsChanged() {

				var selected = platformGridAPI.rows.selection({
					gridId: $scope.gridId
				});
				
				$scope.gridTriggersSelectionChange = true;
				resourceActivityLookupDataService.setSelected(_.isArray(selected) ? selected[0] : selected);
				$scope.gridTriggersSelectionChange = false;
			}
			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			function updateItemList(list) {

				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				platformGridAPI.items.data($scope.gridId, list);

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			}
			resourceActivityLookupDataService.listLoaded.register(updateItemList);
			
			$scope.$on('$destroy', function () {
				resourceActivityLookupDataService.listLoaded.unregister(updateItemList);
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				// platformGridAPI.grids.unregister($scope.gridId);
			});

		}]);
})();