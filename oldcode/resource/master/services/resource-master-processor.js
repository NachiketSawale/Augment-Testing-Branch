/**
 * Created by anl on 3/30/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'resource.master';
	/**
	 * @ngdoc service
	 * @name resourceMasterProcessor
	 * @function
	 * @requires platformRuntimeDataService, platformContextService, $http
	 *
	 * @description
	 * resourceMasterProcessor is the service to process data in main entity
	 *
	 */
	angular.module(moduleName).service('resourceMasterProcessor', ResourceMasterProcessor);

	ResourceMasterProcessor.$inject = ['platformRuntimeDataService', 'platformContextService', '$http'];

	function ResourceMasterProcessor(platformRuntimeDataService, platformContextService, $http) {
		var service = this;
		var companyMap = new Map();

		/*
		 this method adds all companies to the company map
		 */
		function companiesTreeToMap(companiesList) {
			_.forEach(companiesList, function (company) {
				companyMap.set(company.id, company);

				if (company.children) {
					companiesTreeToMap(company.children);
				}
			});
		}

		service.processItem = function processItem(item) {
			var signedInClientId = platformContextService.getContext().signedInClientId;
			var flag = item.CompanyFk === signedInClientId;
			if (!flag) {
				var company = companyMap.get(item.CompanyFk);
				flag = !!company && company.companyType === 3 && company.parentId === signedInClientId;
			}
			service.setColumnReadOnly(item, 'CompanyFk', !flag);
			service.setColumnReadOnly(item, 'IsLive', true);
			service.setColumnReadOnly(item, 'Rate', item.IsRateReadOnly);
			service.setColumnReadOnly(item, 'ItemFk', item.ItemFk === null);
		};

		service.setColumnReadOnly = function setColumnReadOnly(item, column, flag) {
			var fields = [
				{field: column, readonly: flag}
			];
			platformRuntimeDataService.readonly(item, fields);
		};

		(function initCompanyMap() {
			$http.get(
				globals.webApiBaseUrl + 'basics/company/getassignedcompanieswithroles'
			).then(function (response) {
				if (response.data && response.data.companies) {
					companiesTreeToMap(response.data.companies);
				}
				return service.companies;
			});

		})();
	}
})(angular);
