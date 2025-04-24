(function () {
	'use strict';
	/*global Slick*/

	var moduleName = 'productionplanning.mounting';
	angular.module(moduleName).controller('ppsMntModelSimulationEventSourceSelectorController', [
		'_', '$scope', '$timeout', 'platformGridAPI',
		'platformGridControllerService', 'platformCollectionUtilitiesService',
		'$injector', 'basicsCommonToolbarExtensionService',
		function (_, $scope, $timeout, platformGridAPI,
					 platformGridControllerService, platformCollectionUtilitiesService,
					 $injector, basicsCommonToolbarExtensionService) { // jshint ignore:line
			var options = $scope.options();
			if (!options.gridId) {
				throw new Error('Please set a gridId via the options for the directive.');
			}

			var allItems = $scope.entity[options.dataProp];
			var selItems = $scope.entity[options.selectedItemsProp];

			$scope.gridId = options.gridId;
			$scope.gridOptions = {
				gridId: options.gridId,
				tools: {
					showImages: false,
					showTitles: true,
					cssClass: 'tools',
					items: []
				},
				gridData: {
					state: $scope.gridId
				}
			};
			basicsCommonToolbarExtensionService.addBtn($scope.gridOptions, null, null, 'G');

			$scope.onContentResized = function () {
			};

			//TODO: grid only show the first time (this feature should be fixed in platformgrid.directive.js)
			// clean the grid first due to the directive only save the grid onStateChange
			// but in the popup modal, no state change.
			if (platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.unregister($scope.gridId);
			}

			var columns = _.concat([{
				id: 'marker',
				formatter: 'boolean',
				field: 'IsMarked',
				name$tr$: 'model.simulation.isIncluded',
				editor: 'boolean',
				readonly: false,
				pinned: true,
				headerChkbox: true,
				width: 60
			}], (function () {
				var gridColumns = _.cloneDeep($injector.get(options.uiSrv).getStandardConfigForListView().columns);
				_.find(gridColumns, {field: 'StartDate'}).formatter = 'datetimeutc';
				_.find(gridColumns, {field: 'EndDate'}).formatter = 'datetimeutc';
				_.forEach(gridColumns, function (o) {
					o.editor = null;
					o.navigator = null;
				});
				return gridColumns;
			})());

			var markerHeaderChecked = function (e) {
				var isMarked = e.target.checked === true;
				selItems.length = 0;
				if (isMarked) {
					allItems.forEach(function (item) {
						selItems[selItems.length] = item;
					});
				}
				$scope.$root.safeApply(); //
			};

			var grid = {
				data: [],
				columns: columns,
				id: $scope.gridId,
				options: {
					// tree: options.entity === 'Schedule',
					// childProp: 'children',
					// parentProp: 'parent',
					indicator: true,
					selectionModel: new Slick.RowSelectionModel(),
					enableConfigSave: true,
					enableModuleConfig: true,
					saveSearch: false
					// idProperty: 'Id',
					// skipPermissionCheck: true
				},
				enableConfigSave: $scope.gridOptions.tools
			};

			platformGridAPI.grids.config(grid);

			function onCellChanged(e, args) {
				if (args.item.IsMarked) {
					selItems[selItems.length] = args.item;
				} else {
					_.remove(selItems, {Id: args.item.Id});
				}
			}

			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChanged);
			platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', markerHeaderChecked);

			function updateGridData() {
				platformGridAPI.items.data($scope.gridId, allItems);
			}

			//when controller initialized, refresh to show grid (height) correctly, then load data.
			$timeout(function () {
				platformGridAPI.grids.resize($scope.gridId);
				updateGridData();
			});

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChanged);
				platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', markerHeaderChecked);
			});

		}]);
})();
