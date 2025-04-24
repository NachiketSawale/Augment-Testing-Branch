(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').factory('procurementInvoiceHeader2HeaderValidationService',
		['validationService', 'procurementInvoiceHeader2HeaderDataService', 'platformDataValidationService', '$http',
			function (validationService, dataService, platformDataValidationService, $http) {

				var service = {};

				service.validateInvHeaderChainedFk = function (entity, value, model) {
					var result = platformDataValidationService.isUniqueAndMandatory(dataService.getList(), 'InvHeaderChainedFk', value, entity.Id);

					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					if (value) {
						$http.get(globals.webApiBaseUrl + 'procurement/invoice/header/getHeaderById?id=' + value).then(function (res) {
							entity.InvHeaderChainedProgressId = res.data.ProgressId;
							if(result.valid) {
								entity.InvHeaderChainedFk = value;
								dataService.parentChange();
							}
							dataService.fireItemModified(entity);
						});
					}
					return result;
				};

				return service;
			}
		]);

})(angular);
