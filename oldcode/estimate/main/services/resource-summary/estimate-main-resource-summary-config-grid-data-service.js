/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainResourceSummaryConfigGridDataService
	 * @function
	 *
	 * @description
	 * This service provides  Configuration Grid Data Service for dialog.
	 */
	angular.module(moduleName).factory('estimateMainResourceSummaryConfigGridDataService',
		['$q', '$http', '$translate', 'PlatformMessenger', 'platformDataServiceFactory', 'estimateMainResourceSummaryConfigDataService',
			function ($q, $http, $translate, PlatformMessenger, platformDataServiceFactory, estimateMainResourceSummaryConfigDataService) {

				let service = {};

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
					return estimateMainResourceSummaryConfigDataService.getItemsByItemPath();
				}

				function clear() {
					// selectedItem = null;
				}

				return service;
			}]);
})(angular);
