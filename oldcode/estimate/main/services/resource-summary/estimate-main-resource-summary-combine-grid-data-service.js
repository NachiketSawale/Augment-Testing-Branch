/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainResourceSummaryCombineGridDataService
	 * @function
	 *
	 * @description
	 * This service provides  Configuration Grid Data Service for dialog.
	 */
	angular.module(moduleName).factory('estimateMainResourceSummaryCombineGridDataService',
		['$q', '$http', '$translate', 'PlatformMessenger', 'platformDataServiceFactory', 'estimateMainResourceSummaryConfigDataService',
			function ($q, $http, $translate, PlatformMessenger, platformDataServiceFactory, estimateMainResourceSummaryConfigDataService) {

				let service = {},
					data = [];

				angular.extend(service, {
					getList: getList,
					clear: clear,
					getContainerData: getContainerData
				});

				let serviceOption = {
					module: angular.module(moduleName),
					entitySelection: {},
					modification: {multi: {}},
					translation: {
						uid: 'estimateMainResourceSummaryDataService',
						title: 'Title',
						columns: [
							{
								header: 'cloud.common.entityDescription',
								field: 'DescriptionInfo'
							}]
					}
				};

				let container = platformDataServiceFactory.createNewComplete(serviceOption);
				angular.extend(service, container.service);


				function getContainerData(){
					return container.data;
				}
				function getList() {
					data = estimateMainResourceSummaryConfigDataService.getCombinedItems();
					return data;
				}

				function clear() {
					// selectedItem = null;
				}

				return service;
			}]);
})(angular);
