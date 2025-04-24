(function () {
	'use strict';
	/* global globals */
	let moduleName = 'controlling.common';
	
	angular.module(moduleName).factory('controllingCommonControllingUnitLookupDataService',
		['$q','$http','_','basicsLookupdataLookupDescriptorService','$injector',
			function ($q,$http,_,basicsLookupdataLookupDescriptorService,$injector) {
				
				let service = {};
				let controllingUnitPromise = {};
				
				service.getItemById = function(id){
					let item = basicsLookupdataLookupDescriptorService.getLookupItem('GccControllingUnit', id);
					return item;
				};
				
				service.getItemByIdAsync = function(value,formatterOptions){
					let containerServiceName = formatterOptions.mainServiceName;
					if (!controllingUnitPromise[containerServiceName]) {
						controllingUnitPromise[containerServiceName] = getControllingUni(formatterOptions);
					}
					return controllingUnitPromise[containerServiceName].then(function () {
						controllingUnitPromise = {};
						return  service.getItemById(value);
					});
				};
				
				function getControllingUni(formatterOptions){
					let ids = [];
					if(formatterOptions.mainServiceName && $injector.get(formatterOptions.mainServiceName)){
						let dataServiceList =  $injector.get(formatterOptions.mainServiceName).getList();
						_.forEach(dataServiceList,function (d){
							if(d.MdcControllingUnitFk) {
								ids.push(d.MdcControllingUnitFk);
							}
							if(d.MdcControllingunitFk) {
								ids.push(d.MdcControllingunitFk);
							}
							if(d.MdcCounitSourceFk) {
								ids.push(d.MdcCounitSourceFk);
							}
							if(d.MdcCounitTargetFk) {
								ids.push(d.MdcCounitTargetFk);
							}
						});
						ids =_.uniq(ids);
					}
					if(!ids.length){
						return $q.when(true);
					}
					
					let param ={
						CntrStructureIds :ids
					};
					let deferred = $q.defer();
					$http.post(globals.webApiBaseUrl + 'controlling/structure/GetControllingUnitLookUps', param).then(
						function (response ) {
							let result = response && response.data ?response.data :[];
							basicsLookupdataLookupDescriptorService.updateData('GccControllingUnit', result);
							deferred.resolve(result);
						});
					return deferred.promise;
				}
				return service;
			}]);
})();
