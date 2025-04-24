/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'defect.main';

	angular.module(moduleName).factory('defectCheckListFormDataService', ['globals','$injector', '$http', '$translate','platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService',
		'cloudDesktopSidebarService','defectMainHeaderDataService','basicsLookupdataLookupFilterService',
		function (globals,$injector, $http, $translate, dataServiceFactory, lookupDescriptorService, cloudDesktopSidebarService,
			parentService, basicsLookupdataLookupFilterService) {
			var service = {},serviceContainer = null;
			var factoryOptions = {
				flatLeafItem: {
					module: moduleName,
					serviceName: 'defectCheckListFormDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'hsqe/checklist/form/',
						initReadData: function initReadData(readData) {
							var selectDefect=parentService.getSelected();
							var mainItemId=-1;
							if(selectDefect&&selectDefect.HsqChecklistFk) {
								mainItemId =  selectDefect.HsqChecklistFk;
							}
							readData.filter = '?mainItemId=' + mainItemId;
						}
					},
					entityRole: {
						leaf: {itemName: 'FormData', parentService: parentService}
					},
					transaction:{
						uid: 'defectCheckListFormDataService',
						columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
						dtoScheme: {
							typeName: 'HsqCheckList2FormDto',
							moduleSubModule: 'Hsqe.CheckList'
						}
					}
				}
			};
			serviceContainer = dataServiceFactory.createNewComplete(factoryOptions);
			// var data = serviceContainer.data;
			service = serviceContainer.service;
			var filters = [{
				key: 'hsqe-checklist-form-data-filter',
				serverSide: true,
				fn: function () {
					return 'RubricFk = ' + parentService.checkListRubricFk;
				}
			}];
			basicsLookupdataLookupFilterService.registerFilter(filters);

			return service;
		}
	]);
})(angular);
