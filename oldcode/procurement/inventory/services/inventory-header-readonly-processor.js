/**
 * Created by pel on 7/10/2019.
 */

(function (angular) {
	'use strict';

	var moduleName='procurement.inventory';
	/* jshint -W072 */
	angular.module(moduleName).factory('inventoryHeaderReadonlyProcessor',
		['basicsCommonReadOnlyProcessor','cloudDesktopPinningContextService','platformRuntimeDataService',
			function (commonReadOnlyProcessor,cloudDesktopPinningContextService,platformRuntimeDataService) {
				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'PrcInventoryHeaderDto',
					moduleSubModule: 'Procurement.Inventory',
					readOnlyFields: ['Description','InventoryDate','TransactionDate','PrjProjectFk','PrjStockFk','UserDefined1','UserDefined2',
						'UserDefined3','UserDefined4','UserDefined5','PrcStockTransactionTypeFk','CommentText', 'PrjStockDownTimeFk']
				});

				service.handlerItemReadOnlyStatus = function (item) {
					service.setFieldsReadOnly(item);
				};

				service.updateReadOnlyFiled = function setFieldsReadOnly(item,readOnyStatus) {
					service.setRowReadOnly(item, readOnyStatus);
				};

				service.setFieldReadonlyOrNot=function(entity,propertyName,readOnlyOrNot){
					var fields = [];
					fields.push({
						field: propertyName,
						readonly: readOnlyOrNot
					});

					platformRuntimeDataService.readonly(entity, fields);
				};

				service.getCellEditable = function getCellEditable(item, model) {
					if(item.IsPosted){
						return false;
					}
					switch (model) {
						case 'PrjProjectFk':
							return !item.HasInventory;
						default:
							return true;
					}

				};

				return service;
			}]);
})(angular);
