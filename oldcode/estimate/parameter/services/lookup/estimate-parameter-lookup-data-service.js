/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.parameter';
	/**
	 * @ngdoc service
	 * @name estimateParamLookupDataService
	 * @function
	 * @description
	 * This is the data service for estimate parameter item related functionality.
	 */
	angular.module(moduleName).factory('estimateParamLookupDataService',
		['platformLookupDataServiceFactory','$http','$q','basicsLookupdataLookupDescriptorService',
			function (platformLookupDataServiceFactory, $http,$q,basicsLookupdataLookupDescriptorService) {
				let service = {};
				let lookupData = {};

				service.getList = function(){
					let cacheData = basicsLookupdataLookupDescriptorService.getData('EstMainParameters');
					if(!lookupData.paramValueAsyncPromise || lookupData.paramValueAsyncPromise === null) {
						if(cacheData && _.size(cacheData)>0){
							let cacheObject={};
							cacheObject.data =cacheData;
							lookupData.paramValueAsyncPromise = $q.when(cacheObject);
						}else{
							lookupData.paramValueAsyncPromise = service.getEstMainParameters();
						}
					}
					return lookupData.paramValueAsyncPromise.then(function (response) {
						lookupData.paramValueAsyncPromise = null;
						basicsLookupdataLookupDescriptorService.updateData('EstMainParameters',response.data);
						return response;
					});
				};

				service.getEstMainParameters = function getEstMainParameters(){
					return $http.post(globals.webApiBaseUrl + 'basics/customize/estparameter/list');
				};


				return service;


			}]);
})(angular);
