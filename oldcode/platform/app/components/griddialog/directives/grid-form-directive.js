((angular => {
	'use strict';

	let modulename = 'platform';
	let directiveName = 'platformGridForm';

	/**
	 * @ngdoc directive
	 * @name platform.directive:platformGridForm
	 * @element div
	 * @restrict A
	 * @description Displays a grid in the form
	 */
	angular.module(modulename).directive(directiveName, [() => {
		let defaultGridId = 'a5fe937599fc4954bc2efec14579b4e2';

		controller.$inject = ['$scope', '_', '$timeout', 'platformGridAPI'];

		function controller(scope, _, $timeout, platformGridAPI) {
			let finalizers = [];
			let gridOptions = scope.gridOptions;
			let gridId = _.get(gridOptions, 'id', defaultGridId);

			_.set(scope, 'ngModel.items', scope.items);

			scope.gridId = gridId;
			scope.gridData = {
				state: gridId
			};

			let gridConfig = {
				columns: _.cloneDeep(_.get(scope, 'gridOptions.columns')),
				data: [],
				id: gridId,
				lazyInit: true,
				enableConfigSave: false,
				options: {
					indicator: _.get(gridOptions, 'options.indicator'),
					allowRowDrag: false,
					skipPermissionCheck: true,
					showMainTopPanel: false,
					tree: !!_.get(gridOptions, 'options.tree'),
					childProp: _.get(gridOptions, 'options.childrenProperty', 'children'),
					idProperty: _.get(gridOptions, 'options.idProperty'),
					multiSelect: _.get(gridOptions, 'options.allowMultiSelect')
				}
			};

			if (!platformGridAPI.grids.exist(gridId)) {
				platformGridAPI.grids.config(gridConfig);
				platformGridAPI.events.register(gridId, 'onSelectedRowsChanged', updateState);
			}

			function updateState() {
				let selectedItems = platformGridAPI.rows.selection({gridId: gridId, wantsArray: true});
				_.set(scope, 'ngModel.selectedIds', _.map(selectedItems, item => _.get(item, gridConfig.options.idProperty)));

				// To ensure that the toolbar is updated.
				scope.$evalAsync();
			}

			$timeout(function () {
				platformGridAPI.items.data(gridId, scope.items);
			});

			platformGridAPI.events.register(gridId, 'onInitialized', function () {
				if (_.get(gridOptions, 'options.showGridFilter')) {
					platformGridAPI.filters.showSearch(gridId, true);
				}
				if (_.get(gridOptions, 'options.showColumnFilter')) {
					platformGridAPI.filters.showColumnSearch(gridId, true);
				}
			});

			finalizers.push(function () {
				platformGridAPI.grids.unregister(gridId);
				platformGridAPI.events.unregister(gridId, 'onSelectedRowsChanged', updateState);
			});

			finalizers.push(scope.$on('$destroy', function () {
				_.over(finalizers)();
			}));
		}

		return ({
			restrict: 'A',
			scope: {
				gridOptions: '=options',
				items: '=',
				ngModel: '='
			},
			controller: controller,
			templateUrl: globals.appBaseUrl + 'app/components/griddialog/partials/grid-form-template.html'
		});
	}]);
})(angular));
