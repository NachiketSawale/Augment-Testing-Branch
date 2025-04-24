(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.orderproposals';
	angular.module(moduleName).controller('procurementOrderproposalCreateNewController',
		['$scope', '$http', 'platformGridAPI', 'platformSchemaService', 'platformUIConfigInitService', 'procurementStockStockTotalLayout',
			'procurementStockTranslationService', 'basicsLookupdataLookupDescriptorService', 'cloudDesktopSidebarService',
			function procurementOrderproposalCreateNewController($scope, $http, platformGridAPI, platformSchemaService, platformUIConfigInitService, procurementStockStockTotalLayout,
				procurementStockTranslationService, lookupDescriptorService, cloudDesktopSidebarService) {
				$scope.gridId = '211c04b559944918880f85147f1f4631';
				$scope.gridData = {
					state: $scope.gridId
				};

				function getColumns() {
					var dtoScheme = platformSchemaService.getSchemaFromCache({
						typeName: 'StockTotalVDto',
						moduleSubModule: 'Procurement.Stock'
					}).properties;
					dtoScheme.OrderProposalStatuses = {domain: 'action'};
					return platformUIConfigInitService.provideConfigForListView(procurementStockStockTotalLayout, dtoScheme, procurementStockTranslationService);
				}

				function setupGrid() {
					if (!platformGridAPI.grids.exist($scope.gridId)) {
						var layoutUIGridColumns = getColumns().columns;
						var extraColumns = [{
							id: 'ProjectCode',
							field: 'ProjectFk',
							name: 'Project Number',
							name$tr$: 'cloud.common.entityProjectNo',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Project',
								displayMember: 'ProjectNo'
							}
						}, {
							id: 'ProjectDescription',
							field: 'ProjectFk',
							name: 'Project Name',
							name$tr$: 'cloud.common.entityProjectName',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Project',
								displayMember: 'ProjectName'
							}
						}, {
							id: 'StockCode',
							field: 'PrjStockFk',
							name: 'Stock Code',
							name$tr$: 'procurement.stock.header.stockCode',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ProjectStock',
								displayMember: 'Code'
							}
						}, {
							id: 'StockDescription',
							field: 'PrjStockFk',
							name: 'Stock Description',
							name$tr$: 'procurement.stock.header.PrjStockDescription',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ProjectStock',
								displayMember: 'Description'
							}
						}];
						_.forEach(extraColumns, function (item) {
							item.grouping = {
								title: item.name,
								getter: item.field,
								aggregators: [],
								aggregateCollapsed: true
							};
						});
						var gridColumns = _.concat(extraColumns, layoutUIGridColumns);
						_.forEach(gridColumns, function (item) {
							item.readonly = true;
							if (item.navigator) {
								item.navigator = null;
							}
						});
						var gridConfig = {
							columns: angular.copy(gridColumns),
							data: [],
							id: $scope.gridId,
							lazyInit: true,
							options: {
								tree: false,
								indicator: true,
								idProperty: 'Id',
								iconClass: '',
								enableDraggableGroupBy: true,
								enableConfigSave: false
							},
							enableConfigSave: false
						};
						platformGridAPI.grids.config(gridConfig);

					}
				}

				function setupGridData() {
					var requestParam = cloudDesktopSidebarService.getFilterRequestParams();
					var prjContextId = requestParam.ProjectContextId === null ? 0 : requestParam.ProjectContextId;
					var postData = requestParam ? {ProjectContextId: prjContextId} : {};
					var url = globals.webApiBaseUrl + 'procurement/stock/stocktotal/createList';
					$http.post(url, postData).then(function (res) {
						$scope.isLoading = false;
						var gridData = res.data;
						if (gridData) {
							var filterId = $scope.options.filterId;
							var readData = gridData;
							/* var orderProposalList = procurementOrderProposalsDataService.getList();
							var stock2matIds = _.map(orderProposalList, 'Stock2matId');
							if (readData) {
								readData = _.filter(readData, function (e) {
									return stock2matIds.indexOf(e.Stock2matId) === -1;
								});
							} */
							if (!_.isNil(filterId)) {
								readData = _.filter(gridData, function (item) {
									return item.Id !== filterId;
								});
							}
							platformGridAPI.items.data($scope.gridId, readData);
						}
						lookupDescriptorService.attachData(gridData);
					});
				}

				setupGrid();
				$scope.isLoading = true;
				setupGridData();

				function setTools(tools) {
					$scope.tools = tools || {};
					$scope.tools.update = function () {
					};
				}

				setTools(
					{
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: [
							{
								id: 't4',
								caption: 'cloud.common.toolbarSearch',
								type: 'check',
								value: platformGridAPI.filters.showSearch($scope.gridId),
								iconClass: 'tlb-icons ico-search',
								fn: function () {
									platformGridAPI.filters.showSearch($scope.gridId, this.value);
								}
							},
							{
								id: 't16',
								sort: 10,
								caption: 'cloud.common.taskBarGrouping',
								type: 'check',
								iconClass: 'tlb-icons ico-group-columns',
								fn: function () {
									platformGridAPI.grouping.toggleGroupPanel($scope.gridId, this.value);
								},
								value: platformGridAPI.grouping.toggleGroupPanel($scope.gridId),
								disabled: false
							},
							{
								id: 't111',
								sort: 111,
								caption: 'cloud.common.gridlayout',
								iconClass: 'tlb-icons ico-settings',
								type: 'item',
								fn: function () {
									platformGridAPI.configuration.openConfigDialog($scope.gridId);
								}
							}
						]
					});

				platformGridAPI.events.register($scope.gridId, 'onDblClick', function (e, args) {
					var selectedItem = args.grid.getDataItem(args.row);
					$scope.$close(selectedItem);
				});
				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
				});
				$scope.onRefresh = function onRefresh() {
					$scope.isLoading = true;
					setupGridData();
				};

				$scope.okCreate = function okCreate() {
					var data = platformGridAPI.rows.selection({gridId: $scope.gridId, wantsArray: true})[0];
					$scope.$close(data);
				};

				$scope.okBtnDisabled = function okBtnDisabled() {
					var data = platformGridAPI.rows.selection({gridId: $scope.gridId, wantsArray: true});
					return !data;

				};
			}]);

})(angular);
