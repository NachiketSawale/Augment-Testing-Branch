/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */

	'use strict';
	var moduleName = 'hsqe.checklist';

	/**
	 * @ngdoc service
	 * @name hsqeCheckListCommentDataService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	angular.module(moduleName).factory('hsqeCheckListCommentDataService', ['$injector', '$translate','platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'cloudDesktopSidebarService','hsqeCheckListDataService',
		function ($injector, $translate, dataServiceFactory, lookupDescriptorService, cloudDesktopSidebarService, parentService) {
			var service = {},serviceContainer;
			var factoryOptions = {
				flatLeafItem: {
					module: moduleName,
					serviceName: 'hsqeCheckListFormDataService',
					httpCRUD: {route: globals.webApiBaseUrl + 'hsqe/checklist/comment/'},
					entityRole: {
						leaf: {itemName: 'Comment', parentService: parentService}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = parentService.getSelected();
								creationData.HsqCheckListFk = selected.Id;
							}
						}
					}
				}
			};
			serviceContainer = dataServiceFactory.createNewComplete(factoryOptions);
			service = serviceContainer.service;
			service.canDelete = function () {
				return service.getSelected();
			};
			service.canCreate = function () {
				return parentService.getSelected();
			};
			return service;
		}
	]);
})(angular);
