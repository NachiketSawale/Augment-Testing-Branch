(function (angular) {
	'use strict';
	var moduleName = 'procurement.invoice';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	angular.module(moduleName).factory('prcInvoiceGetEtmCompanyContext', ['$q', '$http', 'platformContextService',
		function ($q, $http, platformContextService) {

			var service = {
				currentEtmContextFk: null
			};

			service.getEquipmentContextFk = function getEquipmentContextFk() {
				var defer = $q.defer();
				var companyId = platformContextService.signedInClientId;
				return $http.get(globals.webApiBaseUrl + 'basics/company/getCompanyById?companyId=' + companyId)
					.then(function (response) {
						if (response.data) {
							service.currentEtmContextFk = response.data.EquipmentContextFk;
							defer.resolve(service.currentEtmContextFk);
							return defer.promise;
						}
					});
			};

			if (!service.currentEtmContextFk) {
				service.getEquipmentContextFk();
			}
			service.getEtmContextFk = function getEtmContextFk() {
				if (!service.currentEtmContextFk) {
					service.getEquipmentContextFk();
				}
				return service.currentEtmContextFk;
			};

			return service;
		}
	]);

})(angular);