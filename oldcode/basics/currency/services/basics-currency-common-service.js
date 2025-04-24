/**
 * Created by joshi on 21.11.2014.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCurrencyCommonService
	 * @function
	 *
	 * @description
	 * basicsCurrencyCommonService is the data service for currency related common functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('basics.currency').factory('basicsCurrencyCommonService', ['basicsCurrencyLookupService', 'basicsCurrencyMainService',
		function (basicsCurrencyLookupService, basicsCurrencyMainService) {
			var service = {};
			var CurrencyForeignFk = 0;

			service.onSelectionChanged = function (arg) {

				var col = arg.grid.getColumns()[arg.cell].field;
				var selectedItem = arg.item;
				var mainList = arg.grid.getData().getItems();
				if (col === 'Currency') {
					basicsCurrencyLookupService.getCurrencyConversionByKey(selectedItem.Id);
				}
				service.setDefault(selectedItem, col, mainList);
			};

			service.setDefault = function(selectedItem, col, mainList){
				var count = 0;
				if (col === 'IsDefault') {
					if (selectedItem.IsDefault === true) {
						angular.forEach(mainList, function(item){
							if(item.Id !== selectedItem.Id){
								if(item.IsDefault){
									item.IsDefault = false;
									basicsCurrencyMainService.markItemAsModified(item);
								}
							}
						});
					}
					else{
						angular.forEach(mainList, function(item){
							if(item.IsDefault === true){
								count++;
							}
						});
						if(count === 0){
							selectedItem.IsDefault = true;
						}
					}
				}

			};

			service.getCurrencyRateListByKey = function getCurrencyRateListByKey(value){
				var rateItemList = [];
				var currencyConversionItems = basicsCurrencyLookupService.getCurrencyConversionByKey(value);
				var currencyRateItems = basicsCurrencyLookupService.getCurrencyRate();
				if(currencyConversionItems){
					angular.forEach(currencyConversionItems, function(item){
						if(currencyRateItems){
							angular.forEach(currencyRateItems, function(rateItem){
								if(rateItem.CurrencyConversionFk === item.Id){
									rateItemList.push(rateItem);
								}
							});
						}
					});
				}
				return rateItemList;
			};

			service.setCurrencyForeignFk = function setCurrencyForeignFk(item){
				CurrencyForeignFk = item.Id;
			};

			service.getCurrencyForeignFk = function getCurrencyForeignFk(/* item */){
				return CurrencyForeignFk;
			};

			service.setCurrencyFkOnCreate = function setCurrencyFkOnCreate(list){
				var mainItemId = basicsCurrencyMainService.getSelected().Id;
				angular.forEach(list, function(item){
					if(item.CurrencyHomeFk === null){
						item.CurrencyHomeFk = mainItemId;
					}
				});
				return list;
			};
			service.setReadOnlyRow = function setReadOnlyRow(list, grid){
				var itemList = [];
				var index = [];
				var rateItemList = [];
				angular.forEach(list, function(rw){
					rateItemList = basicsCurrencyLookupService.getCurrencyRateListByKey(rw.Id);
					if(rateItemList.length > 0){
						rateItemList = [];
						itemList.push(rw);
						index.push(list.indexOf(rw));
					}
				});
				if(index.length > 0){
					angular.forEach(index, function(idx){
						grid.setRowReadOnly(idx);
					});
				}

				return list;
			};
			return service;
		}]);
})(angular);
