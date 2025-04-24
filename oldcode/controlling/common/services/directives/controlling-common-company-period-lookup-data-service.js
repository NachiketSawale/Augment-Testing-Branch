(function () {
	'use strict';
	/* global globals */
	let moduleName = 'controlling.common';
	
	angular.module(moduleName).factory('controllingCommonCompanyPeriodLookupDataService',
		['$q','$http','_','basicsLookupdataLookupDescriptorService','$injector',
			function ($q,$http,_,basicsLookupdataLookupDescriptorService,$injector) {
				
				let service = {};
				
				let companyPeriodPromise = {};

				service.getListAsync = function getListAsync(entity){
					return $http.get(globals.webApiBaseUrl + 'basics/company/periods/list?mainItemId='+entity.CompanyYearFk).then(
						function (response ) {
							let result = response && response.data ? response.data :[];
							basicsLookupdataLookupDescriptorService.updateData('CompanyPeriodCache', result);
							return result;
						});
				};
				
				service.getItemById = function(id){
					let item = basicsLookupdataLookupDescriptorService.getLookupItem('CompanyPeriodCache', id);
					return item;
				};
				
				service.getItemByIdAsync = function(value,formatterOptions){
					let containerServiceName = formatterOptions.mainServiceName;
					if (!companyPeriodPromise[containerServiceName]) {
						companyPeriodPromise[containerServiceName] = getCompanyPeriodByCompanyId(formatterOptions);
					}
					return companyPeriodPromise[containerServiceName].then(function () {
						companyPeriodPromise = {};
						return  service.getItemById(value);
					});
				};
				
				function getCompanyPeriodByCompanyId(formatterOptions){
					let companyYearFks =[];
					
					if (formatterOptions.mainServiceName && $injector.get(formatterOptions.mainServiceName)) {
						let dataServiceList = $injector.get(formatterOptions.mainServiceName).getList();
						_.forEach(dataServiceList, function (d) {
							if (d.CompanyYearFk) {
								companyYearFks.push(d.CompanyYearFk);
							}
						});
						companyYearFks = _.uniq(companyYearFks);
					}
					
					if (!companyYearFks.length) {
						return $q.when(true);
					}
			 
					let deferred = $q.defer();
					$http.post(globals.webApiBaseUrl + 'basics/company/periods/getcompanyperiods',companyYearFks).then(
						function (response ) {
							let result = response && response.data ?response.data :[];
							basicsLookupdataLookupDescriptorService.updateData('CompanyPeriodCache', result);
							deferred.resolve(result);
						});
					return deferred.promise;
				}
				return service;
			}]);
})();
