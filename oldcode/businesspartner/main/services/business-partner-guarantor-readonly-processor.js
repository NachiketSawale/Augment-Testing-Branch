/**
 * Created by wed on 8/25/2017.
 */

(function (angular) {

	'use strict';

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerGuarantorReadonlyProcessor', ['basicsCommonReadOnlyProcessor', 'platformContextService', 'platformRuntimeDataService', '$http', 'globals', function (basicsCommonReadOnlyProcessor, platformContextService, platformRuntimeDataService, $http, globals) {

		var service = basicsCommonReadOnlyProcessor.createReadOnlyProcessor({
			typeName: 'GuarantorDto',
			moduleSubModule: 'BusinessPartner.Main',
			readOnlyFields: []
		});

		service.handlerItemReadOnlyStatus = function (item) {
			var signedInClientId = platformContextService.getContext().signedInClientId;
			if (signedInClientId !== item.CompanyFk) {
				service.setRowReadOnly(item, true);
			}
			return signedInClientId !== item.CompanyFk;
		};

		service.processItem = function (entity) {
			if(entity.Version === 0) {
				let companyId = 0;
				if(entity.CompanyFk !== null) {
					companyId = entity.CompanyFk;
				} else {
					companyId = platformContextService.getContext().signedInClientId;
				}
				$http.get(globals.webApiBaseUrl + 'basics/company/getCompanyById?companyId=' + companyId)
					.then(function (response) {
						entity.CurrencyFk = response.data.CurrencyFk;
					});
			}
			if(entity.Version > 0) {
				platformRuntimeDataService.readonly(entity, [{field: 'CompanyFk', readonly: true},{field: 'CurrencyFk', readonly: true}]);
			}
		};

		return service;
	}]);
})(angular);
