/**
 * Created by wuj on 4/30/2015.
 */
// eslint-disable-next-line no-redeclare
/* global angular,_,$ */
(function (angular) {

	'use strict';
	var moduleName = 'procurement.stock';
	angular.module(moduleName).factory('procurementStockTransactionReadOnlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementContextService', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', 'procurementStockStockTotalDataService', 'basicCustomizeSystemoptionLookupDataService',
			function (commonReadOnlyProcessor, moduleContext, lookupDescriptorService, platformRuntimeDataService, parentService, basicCustomizeSystemoptionLookupDataService) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'StockTransactionDto',
					moduleSubModule: 'Procurement.Stock',
					readOnlyFields: ['PesItemFk', 'Inv_2Contract', 'PrjStockFk', 'MdcMaterialFk', 'PrjStocklocationFk', 'BasUomFk']
				});

				var self = this, invStatuses;

				moduleContext.init();

				service.isStockTransactionToReadOnly = function isStockTransactionToReadOnly() {
					const stockTransactionItem = _.find(basicCustomizeSystemoptionLookupDataService.getList(), {'Id': 10110});
					if (stockTransactionItem) {
						const paramValue = stockTransactionItem.ParameterValue;
						return paramValue === 1 || paramValue === '1' || paramValue === true || (paramValue && paramValue.toLowerCase() === 'true');
					}
					return false;
				};

				service.handlerItemReadOnlyStatus = function (item) {
					if (service.isStockTransactionToReadOnly()) {
						service.setRowReadOnly(item, true);
						return true;
					}
					var parentSelected = parentService.getSelected() || (parentService.getSelectedEntities() ? parentService.getSelectedEntities()[0] : {});
					if (parentSelected && !parentSelected.IsCurrentCompany) {
						service.setRowReadOnly(item, true);
						return true;
					}

					if (parentSelected && parentSelected.InDownTime) {
						service.setRowReadOnly(item, true);
						return true;
					}


					var readOnlyStatus = false;
					var transactionType = lookupDescriptorService.getData('StockTransactionType');
					var type = _.find(transactionType, {Id: item.PrcStocktransactiontypeFk});

					if (item.length > 1 || item.Version > 0) {
						readOnlyStatus = true;
					}
					if ((type !== undefined && type !== null) && type.IsAllowedManual) {
						readOnlyStatus = false;
					}
					service.setRowReadOnly(item, readOnlyStatus);
					if ((type !== undefined && type !== null) && type.IsAllowedManual) {
						service.setFieldsEnabled(type, item);
					}
					return readOnlyStatus;
				};

				self.getItemStatus = function getItemStatus(item) {
					invStatuses = lookupDescriptorService.getData('Main');
					return _.find(invStatuses, {Id: item.Id});
				};

				service.setFieldReadOnly = function (item, model, isReadOnly) {
					var properties = [];
					$.each(model, function (i) {
						properties.push({field: model[i], readonly: isReadOnly});
					});
					platformRuntimeDataService.readonly(item, properties);
				};

				service.getCellEditable = function getCellEditable(item, model) {
					switch (model) {
						case 'PesItemFk':
							return true;
						case 'Inv_2Contract':
							return true;
						case 'PrjStockFk':
							return true;
						case 'MdcMaterialFk':
							return true;
						case 'PrjStocklocationFk':
							if (item.Version > 0) {
								var transactionType = lookupDescriptorService.getData('StockTransactionType');
								var type = _.find(transactionType, {Id: item.PrcStocktransactiontypeFk});
								/** @namespace type.IsConsumed */
								return !((type !== undefined && type !== null) && type.IsConsumed);
							}
							return true;
						case 'BasUomFk':
							return !item.MdcMaterialFk;
						default :
							return true;
					}
				};

				service.setFieldsEnabled = function (item, entity) {
					if (item === null || item === undefined) {
						return;
					}

					var fields = ['Total'];
					/** @namespace item.IsReceipt *//** @namespace item.IsProvision */
					/** @namespace item.IsDelta */
					service.setFieldReadOnly(entity, fields, !(item.IsReceipt || item.IsProvision || (item.IsDelta && item.IsReceipt)));

					// noinspection JSCheckFunctionSignatures
					fields = ['ProvisionPercent', 'ProvisionTotal'];
					service.setFieldReadOnly(entity, fields, !item.IsReceipt);

					// noinspection JSCheckFunctionSignatures
					fields = ['PrcStocktransactionFk'];
					service.setFieldReadOnly(entity, fields, !(item.IsProvision || item.IsDelta));

					// noinspection JSCheckFunctionSignatures
					fields = ['Quantity'];
					service.setFieldReadOnly(entity, fields, (item.IsDelta && item.IsConsumed));

				};

				return service;

			}]);
})(angular);