/**
 * Created by leo on 13.04.2015.
 */
(function () {
	/* global Slick */
	'use strict';

	var moduleName = 'scheduling.lookup';

	angular.module(moduleName).value('schedulingLookupActivityTemplateListColumns', {

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
						// validator: 'descriptionValidator',
						// sortable: true,
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
	angular.module(moduleName).controller('schedulingLookupActivityTemplateController', ['_', '$scope', 'schedulingLookupActivityTemplateService', 'schedulingLookupActivityTemplateListColumns', 'platformGridAPI', 'platformTranslateService', 'schedulingLookupTemplateGroupService',
		function (_, $scope, schedulingLookupActivityTemplateService, schedulingLookupActivityTemplateListColumns, platformGridAPI, platformTranslateService, schedulingLookupTemplateGroupService) {

			$scope.gridTriggersSelectionChange = false;

			// grid's id === container's uuid
			$scope.gridId = 'F9A656D0E0F14DE0A2B72B69AECCC9F2';

			$scope.gridData = {
				state: $scope.gridId
			};

			var settings = schedulingLookupActivityTemplateListColumns.getStandardConfigForListView();
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



			function onSelectedRowsChanged() {

				var selected = platformGridAPI.rows.selection({
					gridId: $scope.gridId
				});




				$scope.gridTriggersSelectionChange = true;
				schedulingLookupActivityTemplateService.setSelected(_.isArray(selected) ? selected[0] : selected);
				$scope.gridTriggersSelectionChange = false;
			}
			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			function updateItemList() {

				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				platformGridAPI.items.data($scope.gridId, schedulingLookupActivityTemplateService.getList());

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			}
			schedulingLookupActivityTemplateService.registerListLoaded(updateItemList);

			function groupSelectionChanged() {
				var item = schedulingLookupTemplateGroupService.getSelected();
				if(item && item.Id) {
					schedulingLookupActivityTemplateService.setFilter('mainItemId=' + item.Id);
					schedulingLookupActivityTemplateService.load();
				}
			}

			schedulingLookupTemplateGroupService.registerSelectionChanged(groupSelectionChanged);

			$scope.$on('$destroy', function () {
				schedulingLookupActivityTemplateService.unregisterListLoaded(updateItemList);
				schedulingLookupTemplateGroupService.unregisterSelectionChanged(groupSelectionChanged);
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				platformGridAPI.grids.unregister($scope.gridId);
			});

		}]);
})();