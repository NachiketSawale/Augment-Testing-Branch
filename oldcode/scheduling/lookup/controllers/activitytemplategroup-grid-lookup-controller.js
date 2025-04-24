/**
 * Created by leo on 13.04.2015.
 */
(function () {
	/* global globals */
	'use strict';

	var moduleName = 'scheduling.lookup';

	angular.module(moduleName).value('schedulingLookupTemplateGroupListColumns', {

		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						editor: null,
						width: 70
					},
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						// validator: 'descriptionValidator',
						// sortable: true,
						editor: null,
						readonly: true,
						width: 180
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
	angular.module(moduleName).controller('schedulingLookupTemplateGroupController', ['_', '$scope', 'schedulingLookupTemplateGroupService', 'schedulingLookupTemplateGroupListColumns', 'platformGridAPI', 'platformTranslateService',
		function (_, $scope, schedulingLookupTemplateGroupService, schedulingLookupTemplateGroupListColumns, platformGridAPI, platformTranslateService) {




			$scope.dataForTheTree = schedulingLookupTemplateGroupService.getTree();

			$scope.treeOptions = {
				nodeChildren: 'ActivityTemplateGroups',
				dirSelectable: true,
				selectedNode: {}
				// equality: defaultEquality
			};


			$scope.onSelection = function onSelection(node) {
				// console.log('onSelection called: ', node);
				schedulingLookupTemplateGroupService.setSelected(_.isArray(node) ? node[0] : node);
			};

			$scope.onNodeDblClick = function onNodeDblClick() {
				// console.log('onNodeDblClick called: ', node);
			};

			$scope.getDisplaytext = function getDisplaytext(node) {
				return node.Code + ' - ' + node.DescriptionInfo.Description;
			};

			$scope.classByType = function classByType(node) {
				var result = 'ico-folder-empty';
				if (node && node.HasChildren) {
					result = 'ico-folder-empty';
				}
				return result;
			};


			$scope.path = globals.appBaseUrl;
			$scope.error = {};
			$scope.gridId = 'A9AE9021F0374368A195D2FDF75A6A32';
			$scope.gridTriggersSelectionChange = true;

			$scope.gridGroupData = {
				state: $scope.gridId
			};

			var settings = schedulingLookupTemplateGroupListColumns.getStandardConfigForListView();
			if (!settings.isTranslated) {
				platformTranslateService.translateGridConfig(settings.columns);
				settings.isTranslated = true;
			}
			/*
			var gridConfig = {
				initCalled: false,
				columns: [],
				parentProp: 'ActivityTemplateGroupFk',
				childProp: 'ActivityTemplateGroups'
			};


			var useTree = true;

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				var grid = {
					columns: angular.copy(settings.columns),
					data: schedulingLookupTemplateGroupService.getTree(),
					lazyInit: true,
					id: $scope.gridId,
					options: {
						tree: useTree,
						indicator: true,
						idProperty: 'Id',
						iconClass: '',
						editorLock: new Slick.EditorLock()
					}
				};

				if (useTree) {
					grid.options.parentProp = gridConfig.parentProp;
					grid.options.childProp = gridConfig.childProp;
					grid.options.collapsed = true;
				}

				platformGridAPI.grids.config(grid);
			}

			function onSelectedRowsChanged() {



				var selected = platformGridAPI.rows.selection({
					gridId: $scope.gridId
				});

				$scope.gridTriggersSelectionChange = true;
				schedulingLookupTemplateGroupService.setSelected(_.isArray(selected) ? selected[0] : selected);
				$scope.gridTriggersSelectionChange = false;
			}

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);


			function updateItemList() {

				setTimeout(function(){
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

					platformGridAPI.items.data($scope.gridId, schedulingLookupTemplateGroupService.getTree());
					platformGridAPI.rows.expandAllSubNodes($scope.gridId);

					platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				},52);
				//lazy load -> 50 sec. Little bit more then lazy timeout
			}

			schedulingLookupTemplateGroupService.registerListLoaded(updateItemList);
*/
			schedulingLookupTemplateGroupService.load();

			$scope.$on('$destroy', function () {
				/*
				schedulingLookupTemplateGroupService.unregisterListLoaded(updateItemList);
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				platformGridAPI.grids.unregister($scope.gridId);
				*/
			});

		}]);
})();