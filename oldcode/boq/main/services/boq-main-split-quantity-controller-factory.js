/**
 * Created by reimer on 20.12.2016.
 */

(function () {
	/* global _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainSplitQuantityControllerFactory
	 * @function
	 *
	 * @description
	 * The service to initialize the mentioned controller.
	 */
	angular.module(moduleName).factory('boqMainSplitQuantityControllerFactory', [

		'platformGridControllerService',
		'boqMainSplitQuantityServiceFactory',
		'boqMainSplitQuantityUIServiceFactory',
		'platformGridAPI',
		'$timeout',
		'basicsCostGroupAssignmentService',
		'$injector',
		'boqMainSplitQuantityCostGroupFactory',
		function (platformGridControllerService,
			controllerServiceFactory,
			UIServiceFactory,
			platformGridAPI,
			$timeout,
			basicsCostGroupAssignmentService,
			$injector,
			boqMainSplitQuantityCostGroupFactory) {

			var service = {};

			service.initController = function ($scope, boqService, serviceKey) {
				var controllerService = controllerServiceFactory.getService(boqService, serviceKey);
				// boqService.setSplitQuantityService(controllerService);

				var refreshBoqItems = function (selectedBoq) {

					if (_.isObject(selectedBoq) && Object.prototype.hasOwnProperty.call(selectedBoq, 'TotalQuantity')) {
						boqService.calcDependantValues(selectedBoq, 'Quantity');
					}

					boqService.calcItemsPriceHoursNew(selectedBoq, true);

					boqService.gridRefresh();
				};

				var quantityToDetailMapping = {
					Quantity: 'QuantityDetail',
					QuantityAdj: 'QuantityAdjDetail'
				};
				var myGridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						var boqEntity = boqService.getSelected();
						var boqMainChangeService = $injector.get('boqMainChangeService');
						var boqMainCommonService = $injector.get('boqMainCommonService');
						var col = arg.grid.getColumns()[arg.cell].field;
						var splitQuantity = arg.item;
						if (col === 'Quantity' || col === 'QuantityAdj') {
							if (col === 'Quantity') {
								if (splitQuantity._originQuantity===splitQuantity.QuantityAdj || splitQuantity.QuantityAdj===0) {
									splitQuantity.QuantityAdj = splitQuantity.Quantity;
								}
								delete splitQuantity._originQuantity;
							}

							boqEntity.Quantity    = _.reduce(controllerService.getList(), function (sum, item) { return sum + item.Quantity;    }, 0);
							boqEntity.QuantityAdj = _.reduce(controllerService.getList(), function (sum, item) { return sum + item.QuantityAdj; }, 0);

							boqEntity[quantityToDetailMapping[col]] = boqEntity[col];
						}

						boqService.boqItemQuantityChanged.fire(boqEntity);

						boqMainChangeService.reactOnChangeOfBoqItem(boqEntity, col, boqService, boqMainCommonService, true);

						refreshBoqItems(boqEntity);
					}
				};

				var uiService = UIServiceFactory.createUIService({currentBoqMainService: boqService});

				platformGridControllerService.initListController($scope, uiService, controllerService, $injector.get('boqMainSplitQuantityValidationService'), myGridConfig);

				if (boqService.getServiceName() !== 'estimateMainBoqService') { // TODO-ALM136956: Estimate has an special implementation of 'boqMainService'. The following call would throw exceptions.

					$injector.get('boqMainOenService').tryDisableContainer($scope, boqService, true);

					$injector.get('boqMainCrbService').tryDisableContainer($scope, boqService, true);
				}

				// remove create and delete buttons
				if (boqService.getServiceName() === 'estimateMainBoqService') {
					_.remove($scope.tools.items, function (e) {
						return  e.id === 'create' || e.id === 'delete';
					});

				}

				var setupGrid = function() {
					$timeout(function() {
						var cols = $scope.gridData.config.columns;
						var costGroupCatalogs = controllerService.getCostGroupCatalogs();
						if (costGroupCatalogs) {
							var costGroupCols = basicsCostGroupAssignmentService.createCostGroupColumns(costGroupCatalogs, false);
							cols = cols.concat(costGroupCols);
						}

						platformGridAPI.columns.configuration($scope.gridId, cols);
						adjustGridColumns();
						$timeout(function() {
							platformGridAPI.configuration.refresh($scope.gridId);
						});
					}, 0);

				};
				setupGrid();

				function adjustGridColumns() {
					var gridColumns = platformGridAPI.columns.getColumns($scope.gridId);
					var additionalColumns;
					if (!gridColumns) {
						return;
					}

					if (boqService.getCallingContextType().indexOf('Qto') !== -1) {
						var context = boqService.getCallingContext();
						if (context && context.QtoHeader && (context.QtoHeader.QtoTargetType === 1 || context.QtoHeader.QtoTargetType === 2)) {
							additionalColumns = [{
								id: 'installedquantity',
								field: 'InstalledQuantity',
								name: 'InstalledQuantity',
								width: 120,
								toolTip: 'IQ Quantity',
								name$tr$: 'qto.main.InstalledQuantity',
								formatter: 'quantity',
								type: 'quantity'
							}, {
								id: 'billedquantity',
								field: 'BilledQuantity',
								name: 'BilledQuantity',
								width: 120,
								toolTip: 'BQ Quantity',
								name$tr$: 'qto.main.BilledQuantity',
								formatter: 'quantity',
								type: 'quantity'
							}, {
								id: 'ordQuantity',
								field: 'OrdQuantity',
								name: 'Contract Quantity',
								width: 120,
								toolTip: 'Contract Quantity',
								name$tr$: 'boq.main.OrdQuantity',
								formatter: 'quantity',
								type: 'quantity'
							},{
								id: 'IQPreviousQuantity',
								field: 'IQPreviousQuantity',
								name: 'IQ Previous Quantity',
								width: 120,
								toolTip: 'IQ Previous Quantity',
								name$tr$: 'boq.main.IQPreviousQuantity',
								formatter: 'quantity',
								type: 'quantity'
							},{
								id: 'BQPreviousQuantity',
								field: 'BQPreviousQuantity',
								name: 'BQ Previous Quantity',
								width: 120,
								toolTip: 'BQ Previous Quantity',
								name$tr$: 'boq.main.BQPreviousQuantity',
								formatter: 'quantity',
								type: 'quantity'
							},{
								id: 'IQQuantityTotal',
								field: 'IQQuantityTotal',
								name: 'IQ Quantity Total',
								width: 120,
								toolTip: 'IQ Quantity Total',
								name$tr$: 'boq.main.IQQuantityTotal',
								formatter: 'quantity',
								type: 'quantity'
							},{
								id: 'BQQuantityTotal',
								field: 'BQQuantityTotal',
								name: 'BQ Quantity Total',
								width: 120,
								toolTip: 'BQ Quantity Total',
								name$tr$: 'boq.main.BQQuantityTotal',
								formatter: 'quantity',
								type: 'quantity'
							}];

							gridColumns = _.filter(gridColumns,function (d) {
								return d.field !=='Quantity' &&  d.field !=='QuantityAdj';
							});

						}
					}
					else if (['SalesWip','SalesBilling'].includes(boqService.getCallingContextType())) {
						additionalColumns = [{
							id: 'ordQuantity',
							field: 'OrdQuantity',
							name$tr$: 'boq.main.OrdQuantity',
							width: 100,
							formatter: 'quantity'
						}];
					}

					if (additionalColumns) {
						gridColumns = gridColumns.concat(additionalColumns);
						platformGridAPI.columns.configuration($scope.gridId, gridColumns);
					}
				}

				var setCellEditable = function (e, args) {
					var field = args.column.field;
					var item = args.item;

					return controllerService.getCellEditable(item, field);
				};

				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);

				boqService.registerLookupFilters();

				function refreshGrid() {
					platformGridAPI.grids.refresh($scope.gridId, true);
				}

				controllerService.onListChanged.register(refreshGrid);

				function onEntityDeleted() {

					var boqEntity = boqService.getSelected();
					var cols = ['Quantity', 'QuantityAdj'];

					var boqMainChangeService = $injector.get('boqMainChangeService');
					var boqMainCommonService = $injector.get('boqMainCommonService');
					angular.forEach(cols, function (col) {
						var summedColValue = _.reduce(controllerService.getList(), function (sum, item) {
							var value = _.isNumber(item[col]) ? item[col] : 0;
							return sum + value;
						}, 0);

						if (_.isNumber(summedColValue)) {
							boqEntity[col] = summedColValue;
						}
					});

					boqEntity.QuantityDetail = boqEntity.Quantity;
					boqEntity.QuantityAdjDetail = boqEntity.QuantityAdj;
					// Although more properties have been changed the following reactOnChangeOfBoqItem with the 'Price' property should suffice.
					boqMainChangeService.reactOnChangeOfBoqItem(boqEntity, 'Price', boqService, boqMainCommonService, true);
					refreshBoqItems(boqEntity);
				}

				controllerService.registerEntityDeleted(onEntityDeleted);

				// Add costGroupService
				if (!controllerService.costGroupService) {
					controllerService.costGroupService = boqMainSplitQuantityCostGroupFactory.createService(controllerService);
				}
				controllerService.costGroupService.registerCellChangedEvent($scope.gridId);

				if (_.startsWith(boqService.getServiceName(), 'boqMainServiceFactory')) {
					boqService.boqStructureReloaded.          register(setupGrid); // only for the switch between different UI tabs the in boq.main modules
				}
				controllerService.onCostGroupCatalogsChanged.register(setupGrid); // Then the BOQ items are reloaded too

				$timeout(function () {
					if (serviceKey === 'qto.main') {
						$injector.get('platformPermissionService').restrict('142c713d311c4220bd9f2f0bbfeb8713', $injector.get('permissions').read);
					}
					if(serviceKey === 'estimate.main'){
						$injector.get('platformPermissionService').restrict('c3455e699b6e4906acf3f8066dc695b4', $injector.get('permissions').read);
					}
				});

				$scope.$on('$destroy', function () {
					controllerService.onListChanged.unregister(refreshGrid);
					controllerService.unregisterEntityDeleted(onEntityDeleted);
					controllerService.onCostGroupCatalogsChanged.unregister(setupGrid);
					if (_.startsWith(boqService.getServiceName(), 'boqMainServiceFactory')) { // same restriction as for the registering
						boqService.boqStructureReloaded.unregister(setupGrid);
					}
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
				});
			};

			return service;
		}
	]);

	angular.module(moduleName).factory('boqMainSplitQuantityValidationService', [
		function () {
			var validationService = {};

			validationService.validateQuantity = function(boqSplitQuantity) {
				boqSplitQuantity._originQuantity = boqSplitQuantity.Quantity;  // store original value, needed for a comparision with property 'QuantityAdj'
				return true;
			};

			return validationService;
		}
	]);

})();
