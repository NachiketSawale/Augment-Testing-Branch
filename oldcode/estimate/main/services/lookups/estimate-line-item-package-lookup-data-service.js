
(function () {
	'use strict';
	/* global globals, _ */
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estLineItemPrcPackageLookupDataService',
		['$q','$http','estimateMainPrcPackageLookupDataService','estimateMainService','estimateMainResourceService','estimateMainPrcItemAssignmentListService',
			function ($q,$http,estimateMainPrcPackageLookupDataService,estimateMainService,estimateMainResourceService,estimateMainPrcItemAssignmentListService) {

				let service = angular.extend({}, estimateMainPrcPackageLookupDataService);

				let lookupData = {};
				let lookupList = [];

				service.getItemById = function getItemById(value){
					let pId = value;
					if(_.isObject(value) && value.PrcPackageFk){
						pId = value.PrcPackageFk;
					}
					return _.find(lookupList,{'Id':pId});
				};

				service.getItemByIdAsync = function getItemByIdAsync(value) {
					let pId =0;
					if (!value || value<=0) {
						return $q.when([]);
					}
					pId = value;
					if(_.isObject(value) && value.PrcPackageFk){
						pId = value.PrcPackageFk;
					}

					let item =service.getItemById(pId);
					if(item){
						return $q.when(item);
					}

					if (!lookupData.packageOfLineItemsPromise) {

						let lineItems = estimateMainService.getList();
						let resources = estimateMainResourceService.getList();

						let packageIds = _.map(lineItems,'PrcPackageFk');

						packageIds = packageIds.concat( _.map(resources,'PrcPackageFk'));

						lookupData.packageOfLineItemsPromise = service.getPackageOfLineItemAsync(packageIds);
					}
					return lookupData.packageOfLineItemsPromise.then(function (data) {
						lookupData.packageOfLineItemsPromise = null;
						lookupList = data;
						if (data && data.length) {
							return _.find(data,{'Id':pId});
						}else{
							return null;
						}
					});
				};

				service.getPackageOfLineItemAsync = function getPackageOfLineItemAsync(headerIds){
					let itemAssignments = estimateMainPrcItemAssignmentListService.getList();
					headerIds = headerIds.concat( _.map(itemAssignments,'PrcPackageFk'));

					return $http.post(globals.webApiBaseUrl + 'procurement/package/package/getitembyids',headerIds).then(function(response){
						if(response && response.data){
							return response.data;
						}else{
							return [];
						}
					});
				};

				service.getConOfResourceAsync = function getConOfResourceAsync(id){
					return $http.get(globals.webApiBaseUrl + 'procurement/contract/header/getitembyId?id=' + id).then(function(response){
						if(response && response.data){
							return response.data;
						}else{
							return [];
						}
					});
				};

				service.getQtnOfResourceAsync = function getQtnOfResourceAsync(id){
					return $http.get(globals.webApiBaseUrl + 'procurement/quote/header/getitembyId?id=' + id).then(function(response){
						if(response && response.data){
							return response.data;
						}else{
							return [];
						}
					});
				};

				service.getBusinessPartnerName = function getBusinessPartnerName(mainItemId){
					return $http.get(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/getItem?mainItemId=' + mainItemId).then(function(response){
						if(response && response.data  ){
							return response.data.BusinessPartnerName1;
						}else{
							return '';
						}
					});
				};

				service.clear = function clear() {
					lookupData = {};
					lookupList = [];
				};

				return service;
			}]);
})();
