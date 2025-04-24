/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'controlling.actuals';

	/**
	 * @ngdoc controller
	 * @name controllingActualsCostDataListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of cost data information (ACTUALS).
	 **/
	angular.module(moduleName).controller('controllingActualsCostDataListController',
		['_', '$scope', '$timeout', 'platformGridControllerService', 'controllingActualsCostDataListService', 'controllingActualsCostDataConfigurationService',
			'controllingActualsCostDataValidationService', 'controllingActualsTranslationService', 'controllingActualsCommonService', 'platformGridAPI',
			function (_, $scope, $timeout, platformGridControllerService, controllingActualsCostDataListService, controllingActualsCostDataConfigurationService,
				controllingActualsCostDataValidationService, controllingActualsTranslationService,
				controllingActualsCommonService, platformGridAPI) {
				var myGridConfig = {
					initCalled: false, columns: [],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						let col = arg.grid.getColumns()[arg.cell].field;
						let item = arg.item;

						if(item.MdcControllingUnitFk && item.MdcControllingUnitFk > 0){
							if((col === 'Amount' || col === 'AmountOc')) {
								controllingActualsCostDataListService.calculateItemAmount(item, col);
							}else if(col === 'CurrencyFk' || col === 'MdcControllingUnitFk' || col === 'IsFixedAmount'){
								let calField = 'Amount';
								let calAmount = true;
								if(item.Version === 0){
									if(item.Amount === null && item.AmountOc !== null){
										calField = 'AmountOc';
									}else if(item.Amount !== null && item.AmountOc === null){
										calField = 'Amount';
									}else {
										// if user create a new item and input the Amount and AmountOc manually, it is unnecessary to calculate the currency exchanger rate;
										calAmount = false;
										let AmountOc = item.AmountOc;
										// Calculate AmountProject
										controllingActualsCostDataListService.calculateItemAmount(item, 'Amount');
										item.AmountOc = AmountOc;
									}
								}

								if(calAmount){
									controllingActualsCostDataListService.calculateItemAmount(item, calField);
								}
							}
						}

						controllingActualsCommonService.onSelectionChanged(arg);
					}
				};

				platformGridControllerService.initListController($scope, controllingActualsCostDataConfigurationService, controllingActualsCostDataListService, controllingActualsCostDataValidationService, myGridConfig);

				function addCurrencyToPriceColumns(columns, currency) {
					function setPriceLabel(column, currency) {
						column.name = _.replace(column.name, column.currency, '');

						if(currency){
							column.currency = ` (${currency})`;
							column.name += column.currency;
						}else{
							column.currency = '';
						}

						column.toolTip = column.name;
					}

					// Add company currency to column Amount;
					let amountColumn = _.find(columns, function(col){ return col.id === 'amount';});
					if(amountColumn){
						setPriceLabel(amountColumn, currency.Company);
					}

					// Add project currency to column AmountProject;
					let amountProjectColumn = _.find(columns, function(col){ return col.id === 'amountproject';});
					if(amountProjectColumn){
						setPriceLabel(amountProjectColumn, currency.Project);
					}
				}

				function adjustGridColumns() {
					if (!platformGridAPI.grids.exist($scope.gridId)) {
						return;
					}

					let columnsConfiguration = platformGridAPI.columns.configuration($scope.gridId);
					if (_.isUndefined(columnsConfiguration) || (columnsConfiguration === null)) {
						return;
					}

					let columns = columnsConfiguration.current;
					if (_.isUndefined(columns) || (columns === null)) {
						return;
					}

					controllingActualsCostDataListService.getCurrencyConfigAsync().then(function(currency){
						addCurrencyToPriceColumns(columns, currency);

						platformGridAPI.columns.configuration($scope.gridId, columns);
						platformGridAPI.grids.refresh($scope.gridId);
						platformGridAPI.grids.invalidate($scope.gridId);
					});

				}

				platformGridAPI.events.register($scope.gridId, 'onGridConfigChanged', adjustGridColumns);
				controllingActualsCostDataListService.onListReLoaded.register(adjustGridColumns);

				$scope.$on('$destroy', function () {
					controllingActualsCostDataListService.onListReLoaded.unregister(adjustGridColumns);
					platformGridAPI.events.unregister($scope.gridId, 'onGridConfigChanged', adjustGridColumns);
				});
			}
		]);
})(angular);
