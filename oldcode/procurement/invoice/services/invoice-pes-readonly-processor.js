(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module('procurement.invoice').factory('procurementInvoicePESReadOnlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementInvoiceHeaderDataService',
			function (commonReadOnlyProcessor, headerDataService) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'Inv2PESDto',
					moduleSubModule: 'Procurement.Invoice',
					uiStandardService: 'procurementInvoicePESUIStandardService',
					readOnlyFields: ['PesHeaderFk']
				});

				var itemStatus, readOnlyStatus;

				service.handlerItemReadOnlyStatus = function (item) {
					var rightByStatus = headerDataService.haveRightByStatus('InvStatusEditRightToPes');
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

					service.setRowReadonlyFromLayout(item, readOnlyStatus);

					return readOnlyStatus;
				};

				service.getCellEditable = function getCellEditable(item, model) {
					var editable = true;
					if (angular.isDefined(item)) {
						if (model === 'PesHeaderFk') {
							editable = item.Version === 0;
						}
					}
					return editable;
				};

				return service;

			}]);
})(angular);