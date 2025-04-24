(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.main';

	/**
	 * @ngdoc service
	 * @name businesspartner.main.businesspartnerMainActivityDataServiceNew
	 * @function
	 * @requireds platformDataServiceFactory, basicsLookupdataLookupFilterService
	 *
	 * @description Provide activity data service
	 */
	angular.module(moduleName).factory('businesspartnerMainRatingViewDataService',
		['platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'businesspartnerMainHeaderDataService', 'platformDataServiceDataProcessorExtension', 'globals',
			/* jshint -W072 */
			function (platformDataServiceFactory, basicsLookupdataLookupDescriptorService, businesspartnerMainHeaderDataService, platformDataServiceDataProcessorExtension, globals) {

				let serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'businesspartnerMainRatingViewDataService',
						entityRole: {leaf: {itemName: 'RatingView', parentService: businesspartnerMainHeaderDataService, doesRequireLoadAlways: true}},
						httpRead: {route: globals.webApiBaseUrl + 'businesspartner/main/ratingview/', endRead: 'list'},
						presenter: {list: {incorporateDataRead: incorporateDataRead}}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

				return serviceContainer.service;

				function incorporateDataRead(responseData, data) {
					let items = responseData || [];
					basicsLookupdataLookupDescriptorService.attachData(responseData);

					data.itemList.length = 0;
					for (let i = 0; i < items.length; ++i) {
						data.itemList.push(items[i]);
					}

					platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);

					data.listLoaded.fire();

					return data.itemList;
				}

			}]
	);

})(angular);
