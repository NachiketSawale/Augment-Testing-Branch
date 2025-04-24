/**
 * Created by zwz on 01/16/2025.
 * Copied from transportplanningTransportGoodsTab in Transport module
 */

(function (angular) {
	'use strict';
	/*global angular, globals, $,  _, Slick*/
	angular.module('productionplanning.item').directive('ppsBillingDataSelectionTab',
		['platformGridAPI',
			'$injector',
			function (platformGridAPI,
					  $injector) {
				return {
					restrict: 'A',
					scope: {
						setting: '='
					},
					templateUrl: globals.appBaseUrl + 'productionplanning.item/partials/pps-billing-data-selection-tab.html',
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
								enableDraggableGroupBy: true,
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

})(angular);