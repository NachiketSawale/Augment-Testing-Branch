/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */

	'use strict';
	var moduleName = 'hsqe.checklist';

	/**
	 * @ngdoc service
	 * @name hsqeCheckListTemplateDataService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	angular.module(moduleName).factory('hsqeCheckListTemplateDataService', ['$injector', '$http', '$translate', 'platformDataServiceFactory','basicsLookupdataLookupDescriptorService',
		function ($injector, $http, $translate, dataServiceFactory, basicsLookupdataLookupDescriptorService) {
			var service = {}, serviceContainer = null;
			var allData;
			var filterData = {
				searchValue: '',
				groupValues: []
			};

			var serviceOption = {
				flatLeafItem: {
					module: moduleName,
					serviceName: 'hsqeCheckListTemplateDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'hsqe/checklisttemplate/header/',
						endRead:'listbyfilter',
						usePostForRead: true,
						extendSearchFilter: function (filterRequest) {
							filterRequest.Pattern = filterData.searchValue;
							if (filterData.groupValues.length > 0) {
								filterRequest.furtherFilters = _.map(filterData.groupValues, function (group) {
									return {
										Token: 'HsqCheckListGroupFk',
										Value: group
									};
								});
							} else {
								filterRequest.furtherFilters = [];
							}
							filterRequest.PageNumber = null;
							filterRequest.PageSize = null;
						}
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'hsqe/checklisttemplate/header/',
						usePostForRead: true,
						endCreate: 'createdto'
					},
					httpUpdate: {route: globals.webApiBaseUrl + 'hsqe/checklisttemplate/header/', endUpdate: 'update'},
					httpDelete: {
						route: globals.webApiBaseUrl + 'hsqe/checklisttemplate/header/',
						usePostForRead: true,
						endDelete: 'deletedto'
					},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: false,
							pattern: '',
							pageSize: 100,
							useCurrentClient: null,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: true,
							withExecutionHints: false
						}
					},
					actions: {delete: false, create: false}
				}
			};

			serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
			service = serviceContainer.service;
			var data = serviceContainer.data;

			function setActivityTemplateFk(){
				basicsLookupdataLookupDescriptorService.updateData('activitytemplatefk', serviceContainer.service.getList());
			}
			serviceContainer.service.registerListLoaded(setActivityTemplateFk);

			data.doUpdate = null;
			service.selectedItems = [];
			service.getAllData = function () {
				return allData;
			};
			service.reloadBySelectedGroup = function reloadBySelectedGroup(values) {
				if (!angular.isArray(values)) {
					values = [values];
				}
				filterData.groupValues = values;
				service.load();
			};

			service.getSelectedGroupId = function getSelectedGroupId() {
				return filterData.groupValues && filterData.groupValues.length > 0 ? filterData.groupValues[0]
					: null;
			};

			service.setFilterData = function setFilterData(newFilterData) {
				angular.extend(filterData, newFilterData);
			};

			function incorporateDataRead(readData, data) {
				/** @namespace readData.DefaultGroupId */
				allData = readData.Main;
				data.handleReadSucceeded(allData, data);
			}

			return service;
		}
	]);
})(angular);
