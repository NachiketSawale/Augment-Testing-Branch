(function (angular) {

	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCompanyImageProcessor
	 * @function
	 *
	 * @description
	 * The basicsCompanyImageProcessor adds path to images for companies depending on there type.
	 */
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module('procurement.invoice').factory('procurementInvoiceCertificateReadOnlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementInvoiceHeaderDataService',
			function (commonReadOnlyProcessor, headerDataService) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'InvCertificateDto',
					moduleSubModule: 'Procurement.Invoice',
					readOnlyFields: ['Description','Code','BPName1','RequiredAmount']
				});



				service.handlerItemReadOnlyStatus = function (item) {
					var readOnyStatus,itemStatus = headerDataService.getItemStatus();

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
						case 'Description':
						case 'Code':
						case 'BPName1':
							return false;
						case 'RequiredAmount':
							return item.IsEditable;
						default :
							return true;
					}
				};

				return service;

			}]);
})(angular);