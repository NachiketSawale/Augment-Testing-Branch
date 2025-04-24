/**
 * Created by anl on 12/18/2017.
 */


(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('productionplanningCommonStatusLookupService', StatusLookupService);

	StatusLookupService.$inject = ['$http', '$q', '$injector', 'basicsLookupdataLookupDescriptorService', '_'];

	function StatusLookupService($http, $q, $injector, basicsLookupdataLookupDescriptorService, _) {
		var service = {};
		var lookupData = {
			heaserStatusList: [],
			productStatusList: []
		};

		service.getHeaderList = function () {
			return lookupData.heaserStatusList;
		};
		service.getProductList = function () {
			return lookupData.productStatusList;
		};

		service.allowProductToBeDeleted = (list) => {
			let deletableProducts = [];
			if(list && list.length > 0) {
				const deletableStatusList = _.filter(lookupData.productStatusList, (status) => {
					return status.IsDeletable;
				});
				if (deletableStatusList.length > 0) {
					const deletableStatusIds = _.map(deletableStatusList, 'Id');
					deletableProducts = _.filter(list, (product) => {
						return deletableStatusIds.indexOf(product.ProductStatusFk) > -1;
					});
				}
			}
			return deletableProducts.length === list.length;
		};

		service.clearCache = function clearCache() {
			lookupData.heaserStatusList = [];
			lookupData.productStatusList = [];
		};

		service.load = function load() {
			$http.post(globals.webApiBaseUrl + 'basics/customize/ppsheaderstatus/list').then(function (response) {
				lookupData.heaserStatusList = response.data;
				basicsLookupdataLookupDescriptorService.updateData('basics.customize.ppsheaderstatus', response.data);
			});
			$http.post(globals.webApiBaseUrl + 'basics/customize/ppsproductstatus/list').then(function (response) {
				lookupData.productStatusList = response.data;
				basicsLookupdataLookupDescriptorService.updateData('basics.customize.ppsproductstatus', response.data);
			});
		};

		service.load();

		return service;
	}

})(angular);