/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateWizardGenerateBudgetCXBMLookupService',
		['$q', '$http', '$injector', 'basicsLookupdataLookupDescriptorService', 'estimateMainGenerateBudgetCXBMDialogService',
			function ($q, $http, $injector, lookupDescriptorService, estimateMainGenerateBudgetCXBMDialogService) {

				let lookupType = 'EstimatesFromCXBM';
				let service = {
					setList: setList,
					getList: getList,
					getItemByIdAsync: getItemByIdAsync,
					getItemByKey: getItemByKey
				};

				function setList(data) {
					lookupDescriptorService.removeData(lookupType);
					lookupDescriptorService.updateData(lookupType, data);
					return data;
				}

				function getList() {
					let defer = $q.defer();
					let data = lookupDescriptorService.getData(lookupType);
					if(data) {
						defer.resolve(_.values(lookupDescriptorService.getData(lookupType)));
					}
					else {
						defer.resolve(service.refresh());
					}
					return defer.promise;
				}

				function getItemByKey(key) {
					return lookupDescriptorService.getLookupItem(lookupType, key);
				}

				function getItemByIdAsync(id) {
					let defer = $q.defer();
					defer.resolve(getItemByKey(id));
					return defer.promise;
				}

				service.refresh = function refresh(){
					let externalConfigId = estimateMainGenerateBudgetCXBMDialogService.getExternalConfigId();
					return $http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/getestimatesfromcxbm?externalConfigId='+ externalConfigId).then(function(response){
						setList(response.data);
						return response.data;
					});
				};

				return service;
			}
		]);
})(angular);
