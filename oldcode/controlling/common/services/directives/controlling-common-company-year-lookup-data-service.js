(function () {
	'use strict';
	/* global globals */
	let moduleName = 'controlling.common';
	
	angular.module(moduleName).factory('controllingCommonCompanyYearLookupDataService',
		['$q','$http','_','basicsLookupdataLookupDescriptorService','platformContextService',
			function ($q,$http,_,basicsLookupdataLookupDescriptorService,platformContextService) {
				
				let service = {};
				let companyYearPromise = null;

				service.getListAsync = function getListAsync(entity){
					return $http.get(globals.webApiBaseUrl + 'basics/company/year/listbycompanyid?companyId='+entity.CompanyFk).then(
						function (response ) {
							let result = response && response.data ?response.data :[];
							basicsLookupdataLookupDescriptorService.updateData('CompanyYearCache', result);
							return result;
						});
				};

				service.getItemById = function(id){
					let item = basicsLookupdataLookupDescriptorService.getLookupItem('CompanyYearCache', id);
					return item;
				};
				
				service.getItemByIdAsync = function(value){
					if (!companyYearPromise) {
						companyYearPromise = getCompanyYearByCompanyId();
					}
					return companyYearPromise.then(function () {
						companyYearPromise = null;
						return  service.getItemById(value);
					});
				};
				
				function getCompanyYearByCompanyId(){
					let companyId = platformContextService.getContext().clientId;
					let deferred = $q.defer();
					$http.get(globals.webApiBaseUrl + 'basics/company/year/list?mainItemId='+companyId).then(
						function (response ) {
							let result = response && response.data ?response.data :[];
							basicsLookupdataLookupDescriptorService.updateData('CompanyYearCache', result);
							deferred.resolve(result);
						});
					return deferred.promise;
				}
				return service;
			}]);
})();
