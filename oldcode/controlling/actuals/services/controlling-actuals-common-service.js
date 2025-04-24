/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'controlling.actuals';

	/**
     * @ngdoc service
     * @name controllingActualsCommonService
     * @function
     *
     * @description
     * controllingActualsCommonService is the data service for actuals related common functionality.
     */

	angular.module(moduleName).factory('controllingActualsCommonService',
		['controllingActualsCostHeaderListService',  'platformRuntimeDataService',
			function (controllingActualsCostHeaderListService, platformRuntimeDataService ) {
				var service = {};


				service.onSelectionChanged = function (arg) {
					var col = arg.grid.getColumns()[arg.cell].field;
					var selectedItem = arg.item;

					if (col === 'CurrencyFk' || col === 'IsFixedAmount') {
						service.setReadOnly(selectedItem, col);
					}
					service.checkItemToggle(selectedItem, col);
				};

				service.setReadOnly = function(arg/* , col */) {
					var fields = [
						{field: 'AmountOc', readonly: !arg.IsFixedAmount && arg.CurrencyFk === arg.CompanyCurrencyFk }
					];
					platformRuntimeDataService.readonly(arg, fields);
					controllingActualsCostHeaderListService.markItemAsModified(arg);
				};

				service.processItem = function(item){
					var fields = [
						{field: 'AmountProject', readonly: true }
					];
					platformRuntimeDataService.readonly(item, fields);
				};

				service.checkItemToggle= function(selectedItem, col){
					if(col === 'HasAccount' || col === 'HasContCostCode' || col === 'HasCostCode' ) {
						switch(col) {
							case 'HasAccount':
								selectedItem.HasAccount = true;
								selectedItem.HasContCostCode = false;
								selectedItem.HasCostCode = false;
								break;

							case 'HasContCostCode':
								selectedItem.HasAccount = false;
								selectedItem.HasContCostCode = true;
								selectedItem.HasCostCode = false;
								break;

							case 'HasCostCode':
								selectedItem.HasAccount = false;
								selectedItem.HasContCostCode = false;
								selectedItem.HasCostCode = true;
								break;

							default:
								selectedItem.HasAccount = false;
								selectedItem.HasContCostCode = false;
								selectedItem.HasCostCode = false;
								break;
						}
						controllingActualsCostHeaderListService.markItemAsModified(selectedItem);
					}
				};

				return service;
			}
		]);
})(angular);

