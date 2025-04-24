/**
 * Created by lav on 12/3/2018.
 */
/* global angular */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('transportplanningTransportReturnResourcesCommonConfigureService', ConfigureService);

	ConfigureService.$inject = ['$injector',
		'$http',
		'platformGridAPI',
		'transportplanningTransportReturnResourcesUIService',
		'platformRuntimeDataService',
		'platformDataValidationService',
		'basicsCommonToolbarExtensionService'];

	function ConfigureService($injector,
							  $http,
							  platformGridAPI,
							  UIService,
							  platformRuntimeDataService,
							  platformDataValidationService,
							  basicsCommonToolbarExtensionService) {

		function ConfigureServiceT() {
			var self = this;
			self.customerOptions = {
				forPlants: false,
				grid2Title: 'transportplanning.transport.wizard.resources'
			};

			self.initialize = function ($scope) {
				var scope = $scope;
				scope.gridOptions = UIService.getResourcesOptions(self, self.customerOptions.forPlants);
				addToolItems(scope.gridOptions.jobGrid);
				addToolItems(scope.gridOptions.resourceGrid);
				getData();
				initializeGrid();

				self.clear = function () {
					_.forEach(scope.gridOptions, function (grid) {
						platformGridAPI.items.data(grid.state, []);
					});
				};

				self.unActive = function () {
					_.forEach(scope.gridOptions, function (grid) {
						platformGridAPI.grids.commitEdit(grid.state);
					});
					raiseValidation();
				};

				self.active = function () {
					var result = getData();
					self.setList(scope.gridOptions.jobGrid.state, result.selectedSrcJobs);
					self.setList(scope.gridOptions.resourceGrid.state, result.selectedResources);
				};

				self.getResult = function () {
					return platformGridAPI.rows.getRows(scope.gridOptions.resourceGrid.state);
				};

				_.extend(scope, self.customerOptions);

				function getData() {
					var routeResult = $injector.get(scope.steps[1].service).getResult();
					var result = $injector.get(scope.steps[0].service).getResult();
					var wpService = $injector.get('transportplanningTransportReturnResourceWaypointLookupDataService');
					wpService.setFilter(routeResult.routeEntity);
					var wpList = wpService.getListSync();

					_.forEach(result.selectedSrcJobs, function (job) {
						var existingWP = _.find(wpList, function (wp) {
							return wp.LgmJobFk === job.Id;
						});
						if (existingWP) {
							job.SourceWaypoint = existingWP;
							job.PlannedTime = existingWP.PlannedTime;
						} else {
							if (!routeResult.routeEntity.PlannedPickUp && routeResult.routeEntity.PlannedDelivery) {
								job.PlannedTime = _.clone(routeResult.routeEntity.PlannedDelivery);
							} else {
								job.PlannedTime = _.clone(routeResult.routeEntity.PlannedStart);
							}
						}
						platformRuntimeDataService.readonly(job, [{
							field: 'PlannedTime',
							readonly: !!job.SourceWaypoint
						}]);
					});
					_.forEach(result.selectedResources, function (resource) {
						if (!resource.TransportQuantity) {
							resource.TransportQuantity = resource.RemainingQuantity < 0 ? 0 : resource.RemainingQuantity;
							resource.RemainingQuantity = resource.OrigRemainingQuantity - resource.TransportQuantity;
						}
					});
					scope.gridOptions.jobGrid.data = result.selectedSrcJobs;
					scope.gridOptions.resourceGrid.data = result.selectedResources;

					return result;
				}

				function initializeGrid() {
					_.forEach(scope.gridOptions, function (grid) {
						var gridConfig = {
							id: grid.state,
							data: grid.data,
							columns: grid.columns,
							options: {
								indicator: true,
								selectionModel: new Slick.RowSelectionModel(),
								enableConfigSave: true,
								enableModuleConfig: true,
								saveSearch: false
							}
						};
						gridConfig.columns.current = gridConfig.columns;
						platformGridAPI.grids.config(gridConfig);
					});
				}

				function raiseValidation() {
					_.forEach(scope.gridOptions, function (grid) {
						_.forEach(grid.columns, function (column) {
							if (column.validator) {
								_.forEach(platformGridAPI.rows.getRows(grid.state), function (row) {
									var result = column.validator(row, row[column.field], column.field);
									platformRuntimeDataService.applyValidationResult(result, row, column.field);
									platformGridAPI.rows.refreshRow({'gridId': grid.state, 'item': row});
								});
							}
						});
					});
				}
			};

			function addToolItems(context) {
				context.gridId = context.state;
				context.tools = {
					showImages: false,
					showTitles: true,
					cssClass: 'tools',
					items: []
				};
				basicsCommonToolbarExtensionService.addBtn(context, null, null, 'G');
			}

			self.getModule = function () {//for validation
				return 'transportplanningTransportReturnResourcesResourceConfigureService';
			};

			self.isValid = function () {
				return !platformDataValidationService.hasErrors(self);
			};

			self.setList = function (gridId, items) {
				var grid = platformGridAPI.grids.element('id', gridId);
				var newIds = _.map(items, 'Id');
				var oldItems = platformGridAPI.rows.getRows(gridId);
				var oldIds = _.map(oldItems, 'Id');
				var addItems = _.filter(items, function (item) {
					return !_.includes(oldIds, item.Id);
				});
				var deleteItems = _.filter(oldItems, function (item) {
					return !_.includes(newIds, item.Id);
				});
				_.forEach(addItems, function (item) {
					grid.dataView.addItem(item);
				});
				platformDataValidationService.removeDeletedEntitiesFromErrorList(deleteItems, self);
				_.forEach(deleteItems, function (item) {
					grid.dataView.deleteItem(item.Id);
				});
			};
		}

		return ConfigureServiceT;
	}

	angular.module(moduleName).factory('transportplanningTransportReturnResourcesResourceConfigureService', Service);

	Service.$inject = ['transportplanningTransportReturnResourcesCommonConfigureService'];

	function Service(transportplanningTransportReturnResourcesCommonConfigureService) {

		var BaseService = transportplanningTransportReturnResourcesCommonConfigureService;
		return new BaseService();
	}
})(angular);