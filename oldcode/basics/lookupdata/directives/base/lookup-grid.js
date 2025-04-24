/**
 * Created by jes on 2/10/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataLookupGrid', basicsLookupDataGridDirective);

	basicsLookupDataGridDirective.$inject = [
		'_',
		'platformGridAPI',
		'platformTranslateService'
	];

	function basicsLookupDataGridDirective(
		_,
		platformGridAPI,
		platformTranslateService
	) {
		return {
			restrict: 'A',
			scope: {},
			controller: ['$scope', '$attrs', controller],
			template:   '<div class="filler flex-box">' +
							'<platform-Grid data-data="gridData"></platform-Grid>' +
							'<div data-cloud-common-overlay data-loading="isLoading"></div>' +
						'</div>'
		};

		function controller(scope, attrs) {
			var options = scope.$parent.$eval(attrs.options);
			var dataService = options.dataService;

			_.extend(scope, {
				gridId: options.uuid,
				gridData: {
					state: options.uuid
				},
				isLoading: false
			});

			if(!options.isTranslated) {
				platformTranslateService.translateGridConfig(options.columns);
				options.isTranslated = true;
			}

			if (!platformGridAPI.grids.exist(scope.gridId)) {
				var grid = {
					columns: angular.copy(options.columns),
					data: [],
					id: options.uuid,
					lazyInit: options.lazyInit === false ? false : true,
					options: {
						tree: false,
						indicator: true,
						idProperty: dataService.options.key,
						iconClass: '',
						editorLock: new Slick.EditorLock(),
						multiSelect: false
					}
				};
				if (dataService.presenter.tree) {
					grid.options.tree = true;
					grid.options.collapsed = true;
					angular.extend(grid.options, dataService.presenter.tree);
				}
				if (options.columns.length <= 2) {
					grid.options.forceFitColumns = true;
				}
				platformGridAPI.grids.config(grid);
			}

			dataService.registerListLoaded(updateItemList);
			dataService.registerListLoaded(onListLoaded);
			dataService.registerLoadListStart(onLoadListStart);
			dataService.registerSelectionChanged(onSelectionChanged);
			platformGridAPI.events.register(scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.register(scope.gridId, 'onDblClick', onGridDblClick);

			scope.$on('$destroy', function () {
				dataService.unregisterListLoaded(updateItemList);
				dataService.unregisterListLoaded(onListLoaded);
				dataService.unregisterLoadListStart(onLoadListStart);
				dataService.unregisterSelectionChanged(onSelectionChanged);
				platformGridAPI.events.unregister(scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				platformGridAPI.events.unregister(scope.gridId, 'onDblClick', onGridDblClick);
				platformGridAPI.grids.unregister(scope.gridId);
				dataService.clear();
			});

			function updateItemList() {
				platformGridAPI.events.unregister(scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				if (dataService.presenter.tree) {
					if (dataService.enableFilter) {
						platformGridAPI.items.data(scope.gridId, dataService.getFilteredTree());
						platformGridAPI.rows.expandAllNodes(scope.gridId);
					} else {
						platformGridAPI.items.data(scope.gridId, dataService.getTree());
					}
				} else {
					if (dataService.enableFilter) {
						platformGridAPI.items.data(scope.gridId, dataService.getFilteredList());
					} else {
						platformGridAPI.items.data(scope.gridId, dataService.getList());
					}
				}
				platformGridAPI.events.register(scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			}

			function onSelectedRowsChanged() {
				var selected = platformGridAPI.rows.selection({
					gridId: scope.gridId
				});
				var newSelected = _.isArray(selected) ? selected[0] : selected;
				if (newSelected) {
					var oldSelected = dataService.getSelected();
					if (!oldSelected || oldSelected[dataService.options.key] !== newSelected[dataService.options.key]) {
						dataService.setSelected(newSelected);
					}
				}
			}

			function onSelectionChanged() {
				var selected = dataService.getSelected();
				platformGridAPI.rows.selection({
					gridId: scope.gridId,
					rows: selected ? [selected] : []
				});
			}

			function onGridDblClick() {
				if (dataService.role === 'child') {
					onSelectedRowsChanged();
				}
			}

			function onListLoaded() {
				scope.isLoading = false;
			}

			function onLoadListStart() {
				scope.isLoading = true;
			}
		}
	}

})(angular);