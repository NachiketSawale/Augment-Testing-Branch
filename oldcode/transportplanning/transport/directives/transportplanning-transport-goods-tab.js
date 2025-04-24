/**
 * Created by lav on 10/24/2018.
 */

(function (angular) {
	'use strict';
	/*global angular, globals, $,  _, Slick*/
	angular.module('transportplanning.transport').directive('transportplanningTransportGoodsTab',
		['platformGridAPI',
			'$injector',
			function (platformGridAPI,
					  $injector) {
				return {
					restrict: 'A',
					scope: {
						setting: '='
					},
					templateUrl: globals.appBaseUrl + 'transportplanning.transport/partials/transportplanning-transport-goods-tab.html',
					link: linker,
					controller: ['$scope', function (scope) {
						var tab = scope.setting;
						var gridId = tab.grid.state;
						var columns = getConfigForListView(tab.uiService, angular.isDefined(tab.editColumns) ? tab.editColumns : []);
						if (tab.additionalColumns && tab.additionalColumns.length > 0) {
							columns = columns.concat(tab.additionalColumns);
						}
						var gridConfig = {
							id: gridId,
							columns: columns,
							options: {
								indicator: true,
								selectionModel: new Slick.RowSelectionModel(),
								enableConfigSave: true,
								enableModuleConfig: true,
								idProperty: tab.idProperty || 'Id',
								saveSearch: false
							}

						};
						gridConfig.columns.current = gridConfig.columns;
						platformGridAPI.grids.config(gridConfig);

						function getConfigForListView(service,editColumns) {
							service = _.isString(service) ? $injector.get(service) : service;
							var columns = _.cloneDeep(service.getStandardConfigForListView().columns);
							_.forEach(columns, function (o) {
								var found = _.find(editColumns, function(c){
									return c === o.field;
								});
								if(!found) {
									o.editor = null;
									o.navigator = null;
								}
							});
							return columns;
						}
					}]
				};

				function linker(scope) {

					function updateState() {
						// To ensure that the toolbar is updated.
						scope.$evalAsync();
					}

					platformGridAPI.events.register(scope.setting.grid.state, 'onSelectedRowsChanged', updateState);

					scope.$on('$destroy', function () {
						platformGridAPI.events.unregister(scope.setting.grid.state, 'onSelectedRowsChanged', updateState);
						platformGridAPI.grids.unregister(scope.setting.grid.state);//must unregister here, reason: framework is changed
					});
				}
			}]);

	angular.module('transportplanning.transport').directive('transportplanningTransportTriggerGridDiv', ['platformGridAPI', '$timeout',
		function (platformGridAPI, $timeout) {
			return {
				restrict: 'A',
				scope: {
					grids: '='
				},
				template: '<div></div>',
				link: linker
			};

			function linker(scope) {

				var isDestroy;

				function resizeGrid(grid, index) {
					index++;
					if (isDestroy || index > 50) {
						return;
					}
					var container = $('#' + grid)[0];
					var width = container ? parseFloat($.css(container, 'width', true)) : 0;
					var height = container ? parseFloat($.css(container, 'height', true)) : 0;
					if (width > 0 && height > 0) {
						platformGridAPI.grids.resize(grid);
					} else {
						$timeout(function () {
							resizeGrid(grid, index);
						}, 100);
					}
				}

				_.forEach(scope.grids, function (grid) {
					resizeGrid(grid, 1);
				});

				scope.$on('$destroy', function () {
					isDestroy = true;
				});
			}
		}]);
})(angular);