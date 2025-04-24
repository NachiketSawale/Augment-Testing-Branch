/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainModifyResourceFieldsValuesDataService
	 * @function
	 *
	 * @description
	 * This service provides Estimate Modify Resource Fields Value Grid Data Service for dialog.
	 */
	angular.module(moduleName).factory('estimateMainModifyResourceFieldsValuesDataService',
		['$q', '$http', '$translate', 'PlatformMessenger', 'platformDataServiceFactory',
			function ($q, $http, $translate, PlatformMessenger, platformDataServiceFactory) {

				let service = {},
					data = [];

				angular.extend(service, {
					getList: getList,
					clear: clear
				});

				let serviceOption = {
					module: angular.module(moduleName),
					httpCRUD: {
						route: globals.webApiBaseUrl + 'estimate/main/modify/',
						endRead: 'getfilterfields'
					},
					presenter: {list: {isInitialSorted:true, sortOptions: {initialSortColumn: {field: 'Sorting'}, isAsc: true}}},
					entitySelection: {},
					modification: {multi: {}},
					translation: {
						uid: 'estimateMainModifyResourceFieldsValuesDataService',
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



				return service;

				function getList() {
					return data;
				}

				function clear() {
					// selectedItem = null;
					data = [];
				}
			}]);
})(angular);
