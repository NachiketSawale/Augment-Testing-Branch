/**
 * Created by baf on 30.05.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyLoginContextService
	 * @description provides information about the login company and the login profit center
	 */
	angular.module(moduleName).service('basicsCompanyLoginContextService', BasicsCompanyLoginContextService);

	BasicsCompanyLoginContextService.$inject = ['_', '$q', '$http', 'basicsCompanyConstantValues'];

	function BasicsCompanyLoginContextService(_, $q, $http, basicsCompanyConstantValues) {
		// const self = this;

		let data = {
			isLoaded: false,
			loginCompany: null,
			loginProfitCenter: null,
			isVisibilityRestrictedToProfitCenter: false
		};

		this.load = function load() {
			if(data.isLoaded) {
				return $q.when(true);
			}

			data.loginCompany = null;
			data.loginProfitCenter = null;
			data.isVisibilityRestrictedToProfitCenter = false;

			return $http.get(globals.webApiBaseUrl + 'basics/company/context').then(function(result) {
				_.forEach(result.data, function (company) {
					if(company.CompanyTypeFk === basicsCompanyConstantValues.companyTypes.company) {
						data.loginCompany = company;
					} else if (company.CompanyTypeFk === basicsCompanyConstantValues.companyTypes.profitCenter) {
						data.loginProfitCenter = company;
					}
				});

				if(data.loginProfitCenter && data.loginProfitCenter.IsRestrictedToProfitCenter && data.loginCompany.Id !== data.loginProfitCenter.Id) {
					data.isVisibilityRestrictedToProfitCenter = true;
				}

				data.isLoaded = true;

				return true;
			});
		};

		this.getLoginCompany = function getLoginCompany() {
			return data.loginCompany;
		};

		this.getLoginProfitCenter = function getLoginProfitCenter() {
			return data.loginProfitCenter;
		};

		this.isVisibilityRestrictedToProfitCenter = function isVisibilityRestrictedToProfitCenter() {
			return data.isVisibilityRestrictedToProfitCenter;
		};
	}
})(angular);
