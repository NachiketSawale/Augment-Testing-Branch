/**
 * Created by ltn on 5/8/2017.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module('procurement.invoice').factory('procurementInvoicePaymentReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementInvoiceHeaderDataService',
			function (commonReadOnlyProcessor, headerDataService) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'InvPaymentDto',
					moduleSubModule: 'Procurement.Invoice',
					readOnlyFields: []
				});

				var itemStatus, readOnlyStatus;

				service.handlerItemReadOnlyStatus = function (item) {
					var rightByStatus = headerDataService.haveRightByStatus('InvStatusEditRightToPayment');
					if (rightByStatus.hasDescriptor) {
						readOnlyStatus = false;
					}
					else {
						itemStatus = headerDataService.getItemStatus();
						if (itemStatus) {
							readOnlyStatus = itemStatus.IsReadOnly;
						} else {
							readOnlyStatus = false;
						}

						if (!readOnlyStatus) {
							readOnlyStatus = !rightByStatus.right;
						}
					}

					service.setRowReadOnly(item, readOnlyStatus);
					return readOnlyStatus;
				};

				return service;

			}]);
})(angular);