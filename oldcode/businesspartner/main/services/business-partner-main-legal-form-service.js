/**
 * Created by chi on 12/14/2021.
 */

(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerMainLegalFormService', businessPartnerMainLegalFormService);

	businessPartnerMainLegalFormService.$inject = ['$http', '$q', 'globals', 'basicsLookupdataSimpleLookupService', '_'];

	function businessPartnerMainLegalFormService($http, $q, globals, basicsLookupdataSimpleLookupService, _) {
		var service = {};
		service.getDefaultId = getDefaultId;
		return service;

		function getDefaultId(countryFk, legalFormFk) {
			if (!countryFk) {
				return $q.when(legalFormFk);
			}
			let needGetDefaultLegalForm = true;
			let originalLegalForm = null;
			if (legalFormFk) {
				let legalForms = basicsLookupdataSimpleLookupService.getListSync({lookupModuleQualifier: 'businesspartner.legal.form', displayMember: 'Description', valueMember: 'Id'});
				if (angular.isArray(legalForms) && legalForms.length > 0) {
					originalLegalForm = _.find(legalForms, {Id: legalFormFk});
					if (originalLegalForm && originalLegalForm.BasCountryFk === countryFk) {
						needGetDefaultLegalForm = false;
					}
				}
			}
			if (needGetDefaultLegalForm) {
				return getDefaultAsync(countryFk)
					.then(function (legalForm) {
						if (legalForm) {
							if (originalLegalForm) {
								originalLegalForm.BasCountryFk = originalLegalForm.BasCountryFk || null;
								legalForm.BasCountryFk = legalForm.BasCountryFk || null;
								if (originalLegalForm.BasCountryFk === legalForm.BasCountryFk) {
									return legalFormFk;
								}
							}
							return legalForm.Id;
						}
						return null;
					});
			}
			else {
				return $q.when(legalFormFk);
			}
		}

		function getDefaultAsync(countryFk) {
			return $http.get(globals.webApiBaseUrl + 'businesspartner/main/legalform/getdefaultbycountryfk?countryfk=' + countryFk)
				.then(function (response) {
					if (!response || !response.data) {
						return null;
					}

					return response.data;
				});
		}
	}
})(angular);