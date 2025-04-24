(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module('procurement.invoice').factory('procurementInvoiceRejectionReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementInvoiceHeaderDataService',
			function (commonReadOnlyProcessor, headerDataService) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'InvRejectDto',
					moduleSubModule: 'Procurement.Invoice',
					readOnlyFields: []
				});

				var itemStatus, readonlyStatus;

				service.handlerItemReadOnlyStatus = function (item) {
					itemStatus = headerDataService.getItemStatus();
					if (itemStatus) {
						readonlyStatus = itemStatus.IsReadOnly;
					} else {
						readonlyStatus = false;
					}
					if(item.InvRejectFk !== null){
						readonlyStatus = true;
					}
					service.setRowReadOnly(item, readonlyStatus);
					return readonlyStatus;
				};

				return service;

			}]);
})(angular);