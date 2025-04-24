/**
 * Created by chi on 7/1/2016.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonHeaderColumnCheckboxControllerService', basicsCommonHeaderColumnCheckboxControllerService);
	basicsCommonHeaderColumnCheckboxControllerService.$inject = [
		'platformGridAPI', '_'
	];

	function basicsCommonHeaderColumnCheckboxControllerService(
		platformGridAPI, _
	) {
		const service = {};
		let gridId = null;
		service.init = init;
		service.setGridId = setGridId;

		service.checkHeaderCheckBox = checkHeaderCheckBox;
		return service;

		// /////////////////////////////
		function setGridId(id) {
			gridId = id;
		}

		// /////////////////////////////////
		function checkIndeterminateness(grid, columnDef, options) {
			let skipFn = options && options.skipFn ? options.skipFn : null;
			const useFilteredData = options && options.useFilteredData !== undefined && options.useFilteredData !== null ? options.useFilteredData : false;
			const headers = grid.getColumnHeaders();
			const ele = headers.find('#chkbox_' + grid.getUID() + '_' + columnDef.id);

			if (ele.length) {
				const data = useFilteredData ? grid.getData().getFilteredItems().rows : grid.getData().getItems();
				let hasTrueValue = false;
				let hasFalseValue = false;
				const targetItems = angular.isFunction(skipFn) ? _.filter(data, function (item, i) {
					return !skipFn(item, columnDef, i);
				}) : data;

				if (targetItems.length) {
					hasTrueValue = _.findIndex(targetItems, [columnDef.field, true]) !== -1;
					hasFalseValue = _.findIndex(targetItems, [columnDef.field, false]) !== -1;
				}

				ele.prop('disabled', !targetItems.length);
				ele.prop('indeterminate', hasTrueValue && hasFalseValue);
				ele.prop('checked', hasTrueValue && !hasFalseValue);
			}
		}

		function handler(grid, fields, userOptions) {
			const columns = grid.getColumns();
			const foundCols = _.filter(columns, function (col) {
				return fields.indexOf(col.field) !== -1;
			});
			const options = angular.extend({skipFn: null}, userOptions);
			if (foundCols) {
				for (let i = 0; i < foundCols.length; i++) {
					checkIndeterminateness(grid, foundCols[i], options);
				}
			}
		}

		function init(scope, dataService, fields, events, userOptions) {

			function defaultHandler() {
				const grid = platformGridAPI.grids.element('id', scope.gridId || gridId).instance;
				setTimeout(function () {
					handler(grid, fields, userOptions);
				});
			}

			platformGridAPI.events.register(scope.gridId || gridId, 'onRowCountChanged', defaultHandler);

			if (angular.isArray(events)) {
				_.forEach(events, function (event) {
					switch (event.source) {
						case 'grid':
							platformGridAPI.events.register(scope.gridId || gridId, event.name, angular.isFunction(event.fn) ? event.fn : defaultHandler);
							break;
						case 'dataService':
							dataService[event.name].register(angular.isFunction(event.fn) ? event.fn : defaultHandler);
							break;
						default:
							break;
					}
				});
			}

			scope.updateHeaderCheckState = defaultHandler;

			scope.$on('$destroy', function () {
				platformGridAPI.events.unregister(scope.gridId || gridId, 'onRowCountChanged', defaultHandler);

				if (angular.isArray(events)) {
					_.forEach(events, function (event) {
						switch (event.source) {
							case 'grid':
								platformGridAPI.events.unregister(scope.gridId || gridId, event.name, angular.isFunction(event.fn) ? event.fn : defaultHandler);
								break;
							case 'dataService':
								dataService[event.name].unregister(angular.isFunction(event.fn) ? event.fn : defaultHandler);
								break;
							default:
								break;
						}
					});
				}
			});
		}

		function checkHeaderCheckBox(gridId, fields, options) {
			setGridId(gridId);
			const eleGrid = platformGridAPI.grids.element('id', gridId);
			if (eleGrid) {
				const grid = eleGrid.instance;
				handler(grid, fields, options);
			}
		}
	}
})(angular);