/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainReplaceResourceFieldsGridDataService
	 * @function
	 *
	 * @description
	 * This service provides Estimate Replaced Value Configuration Grid Data Service for dialog.
	 */
	angular.module(moduleName).factory('estimateMainReplaceResourceFieldsGridDataService',
		['$q', '$injector', '$http', '$translate', 'PlatformMessenger', 'platformDataServiceFactory',
			function ($q, $injector, $http, $translate, PlatformMessenger, platformDataServiceFactory) {

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
						endRead: 'getcolumnfields'
					},
					presenter: {
						list: {
							isInitialSorted:true,
							sortOptions: {initialSortColumn: {field: 'Description'}, isAsc: true},
							incorporateDataRead: function (readData, data) {

								let selectedFunction = $injector.get('estimateMainReplaceResourceCommonService').getSelectedFunction();
								if(selectedFunction && selectedFunction.Id === 131){
									readData = _.filter(readData , function (item) {
										return item.Id !== 23;
									});
								}

								return container.data.handleReadSucceeded(readData, data);

							}}},
					entitySelection: {},
					entityRole: {
						root: {addToLastObject: true, lastObjectModuleName: moduleName,codeField: 'Description', itemName: 'Description', moduleName: 'estimate'}
					},
					modification: {multi: {}},
					translation: {
						uid: 'estimateMainReplaceResourceFieldsGridDataService',
						title: 'Title',
						columns: [
							{
								header: 'cloud.common.entityDescription',
								field: 'DescriptionInfo'
							}]
					}
				};

				let container = platformDataServiceFactory.createNewComplete(serviceOption);
				container.data.doUpdate = null;
				angular.extend(service, container.service);


				return service;

				function getList() {
					return data;
				}

				function clear() {
					// selectedItem = null;
				}
			}]);
})(angular);
