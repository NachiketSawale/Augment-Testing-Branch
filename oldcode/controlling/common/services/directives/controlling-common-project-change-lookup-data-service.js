(function () {
	'use strict';
	/* global globals */
	let moduleName = 'controlling.common';
	
	angular.module(moduleName).factory('controllingCommonProjectChangeLookupDataService',
		['$q','$http','_','basicsLookupdataLookupDescriptorService','$injector',
			function ($q,$http,_,basicsLookupdataLookupDescriptorService,$injector) {
				
				let service = {};
				
				let prjChangePromise = {};
				
				service.getItemById = function(id){
					let item = basicsLookupdataLookupDescriptorService.getLookupItem('GccProjectChange', id);
					return item;
				};
				
				service.getItemByIdAsync = function(value,formatterOptions){
					let containerServiceName = formatterOptions.mainServiceName;
					if (!prjChangePromise[containerServiceName]) {
						prjChangePromise[containerServiceName] = getPrjChange(formatterOptions);
					}
					return prjChangePromise[containerServiceName].then(function () {
						prjChangePromise = {};
						return  service.getItemById(value);
					});
				};
				
				function getPrjChange(formatterOptions){
					let ids = [];
					if(formatterOptions.mainServiceName && $injector.get(formatterOptions.mainServiceName)){
						let dataServiceList =  $injector.get(formatterOptions.mainServiceName).getList();
						ids = _.map( _.filter(dataServiceList,function (d){
							return d.PrjChangeFk>0;
						}),'PrjChangeFk');
						ids =_.uniq(ids);
					}
					
					if(!ids.length){
						return $q.when(true);
					}
					
					let param ={
						Ids :ids
					};
					let deferred = $q.defer();
					$http.post(globals.webApiBaseUrl + 'change/main/GetProjectChangeLookUps', param).then(
						function (response ) {
							let result = response && response.data ?response.data :[];
							basicsLookupdataLookupDescriptorService.updateData('GccProjectChange', result);
							deferred.resolve(result);
						});
					return deferred.promise;
				}
				return service;
			}]);
})();
