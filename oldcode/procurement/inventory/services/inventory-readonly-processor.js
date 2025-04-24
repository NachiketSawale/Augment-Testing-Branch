/**
 * Created by pel on 26/11/2020
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.inventory';
	/* jshint -W072 */
	angular.module(moduleName).factory('inventoryReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'cloudDesktopPinningContextService', 'platformRuntimeDataService', 'procurementInventoryHeaderDataService',
			function (commonReadOnlyProcessor, cloudDesktopPinningContextService, platformRuntimeDataService, parentService) {
				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'PrcInventoryDto',
					moduleSubModule: 'Procurement.Inventory',
					readOnlyFields: ['MdcMaterialFk', 'BasUomFk', 'PrjStockLocationFk', 'LotNo', 'ExpirationDate', 'StockQuantity', 'StockProvisionTotal', 'ActualQuantity', 'ActualTotal', 'ActualProvisionTotal', 'UserDefined1', 'UserDefined2',
						'UserDefined3', 'UserDefined4', 'UserDefined5', 'Price', 'PrcStocktransactiontypeFk', 'ActualProvisionTotal', 'RecordedUomFk','RecordedQuantity', 'IsCounted', 'ClerkFk1','ClerkFk2',
						'Quantity1', 'Quantity2']
				});

				service.handlerItemReadOnlyStatus = function (item) {
					service.setFieldsReadOnly(item);
				};

				service.updateReadOnlyFiled = function setFieldsReadOnly(item, readOnyStatus) {
					service.setRowReadOnly(item, readOnyStatus);
				};

				service.setFieldReadonlyOrNot = function (entity, propertyName, readOnlyOrNot) {
					var fields = [];
					fields.push({
						field: propertyName,
						readonly: readOnlyOrNot
					});

					platformRuntimeDataService.readonly(entity, fields);
				};

				service.getCellEditable = function getCellEditable(item, model) {
					var conditionFields = ['MdcMaterialFk', 'BasUomFk', 'PrjStockLocationFk', 'LotNo', 'ExpirationDate', 'Price', 'ActualProvisionTotal'];
					var editFields = ['ActualQuantity', 'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5', 'PrcStocktransactiontypeFk', 'IsCounted','ClerkFk1','ClerkFk2'];
					var mainItem = parentService.getSelected();
					if (mainItem && mainItem.IsPosted) {
						return false;
					} else {
						if ((item.Version === 0 || !item.IsFromExistStock) && (conditionFields.indexOf(model) > -1)) {
							return true;
						}
						if (editFields.indexOf(model) > -1) {
							return true;
						}
						if ((model === 'RecordedUomFk'||model === 'RecordedQuantity') && item.Material2Uoms) {
							return true;
						}
						if (model === 'Quantity1') {
						  if(item.ClerkFk1 === null){
							  return false;
						  }else{
						  	  return true;
						  }
						}
						if (model === 'Quantity2') {
							if(item.ClerkFk2 === null){
								return false;
							}else{
								return true;
							}
						}

						return false;
					}
				};

				return service;
			}]);
})(angular);
