(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module('procurement.invoice').factory('procurementInvoiceGeneralReadOnlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementInvoiceHeaderDataService',
			function (commonReadOnlyProcessor, headerDataService) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'InvGeneralsDto',
					moduleSubModule: 'Procurement.Invoice',
					readOnlyFields: ['ControllingUnitFk', 'TaxCodeFk']
				});

				var itemStatus, readOnyStatus;

				service.handlerItemReadOnlyStatus = function (item) {
					itemStatus = headerDataService.getItemStatus();
					if (itemStatus) {
						readOnyStatus = itemStatus.IsReadOnly;
					} else {
						readOnyStatus = false;
					}
					service.setRowReadOnly(item, readOnyStatus);
					return readOnyStatus;
				};

				service.getCellEditable = function getCellEditable(item, model) {
					switch (model) {
						case 'ControllingUnitFk':
						case 'TaxCodeFk':
							return item.IsCost;
						default :
							return true;
					}
				};

				return service;

			}]);
})(angular);