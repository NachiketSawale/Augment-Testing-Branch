/**
 * Created by wwa on 4/11/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'procurement.invoice';
	angular.module(moduleName).factory('procurementInvoicePESDataFillFieldsProcessor', ['basicsLookupdataLookupDescriptorService',
		'procurementInvoiceHeaderDataService',
		function (lookupDescriptorService,headerDataService) {
			var service = {};
			var fields = ['PesValueOc', 'PesVatOc'];
			service.processItem = function processItem(item) {
				var header = headerDataService.getSelected();
				if(!header || !header.Id || !item.PesHeaderFk){
					return;
				}
				_.forEach(fields, function (field) {
					item[field.replace('Oc', '')] = header.ExchangeRate === 0 ? 0 : item[field] / header.ExchangeRate;
				});
			};

			return service;
		}
	]);
})(angular);
