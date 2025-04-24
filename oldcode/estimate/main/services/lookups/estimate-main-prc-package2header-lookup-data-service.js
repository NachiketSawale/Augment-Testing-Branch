/**
 * Created by hzh on 11.05.2017.
 */
(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainPrcPackageLookupDataService
	 * @function
	 *
	 * @description
	 * estimateMainPrcPackageLookupDataService is the data service for Line item context prc package related functionality.
	 */
	angular.module(moduleName).factory('estimateMainPrcPackage2HeaderLookupDataService',
		['$injector','$q','platformLookupDataServiceFactory', function ($injector,$q,platformLookupDataServiceFactory) {

			let prcPackage2HeaderLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'procurement/package/prcpackage2header/',endPointRead :'getSubPackage'},
				filterParam: 'prcPackage',
				prepareFilter : function(filter){
					return filter;
				}
			};

			let instance = platformLookupDataServiceFactory.createInstance(prcPackage2HeaderLookupDataServiceConfig);

			let serviceData;
			let handleSuccessfulLoad = instance.data.handleSuccessfulLoad;
			instance.data.handleSuccessfulLoad = function(loaded, data, key) {
				if (!serviceData){
					serviceData = instance.data;
				}
				if (!data){
					data = instance.data;
				}

				return handleSuccessfulLoad(loaded, data, key);
			};

			let service = instance.service;
			let setFilter = service.setFilter;
			service.setFilter = function(filter){
				filter = getFilterString(filter);
				setFilter(filter);
			};

			function getFilterString(filter){
				let prcPackageId =  filter.prcPackageId >0 ? filter.prcPackageId : 0;
				return '?' + 'prcPackage=' +  prcPackageId + '&' + 'projectId=' + filter.projectId;
			}

			return angular.extend(service , {
				handleSuccessfulLoad : instance.data.handleSuccessfulLoad,
				readData : instance.data.readData,
				getFilterString : getFilterString
			});
		}]);
})();
